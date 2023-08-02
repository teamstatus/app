import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { CREATE, GET, UPDATE } from '#api/client.js'
import { notReady } from '#api/notReady.js'

export type UserContext = {
	email: string
	id?: string // e.g. '@alex'
	name?: string // e.g. 'Alex Doe'
	version: number // e.g. 1
	pronouns?: string
}

type AutoLoginState = 'in_progress' | 'failed' | 'success'

export const AuthContext = createContext<{
	logout: () => void
	setUser: (user: UserContext) => void
	user?: UserContext
	autoLoginState: AutoLoginState
	update: (patch: {
		name: string
		pronouns?: string
	}) => ReturnType<typeof UPDATE>
}>({
	logout: () => undefined,
	setUser: () => undefined,
	autoLoginState: 'in_progress',
	update: notReady,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [user, setUser] = useState<UserContext>()
	const [autoLoginState, setAutoLoginState] =
		useState<AutoLoginState>('in_progress')

	useEffect(() => {
		GET<{ user: UserContext }>(`/me`, { cacheError: false })
			.ok(({ user }) => {
				setUser(user)
				setAutoLoginState('success')
			})
			.fail(() => {
				setAutoLoginState('failed')
			})
	}, [])

	return (
		<AuthContext.Provider
			value={{
				setUser,
				logout: () => {
					CREATE(`/logout`, {})
						.fail(() => {
							console.error(`Server-side logout failed.`)
						})
						.anyway(() => {
							setUser(undefined)
							document.location.assign('/')
						})
				},
				user,
				autoLoginState,
				update: (patch) => {
					if (user === undefined) return notReady()
					return UPDATE('/me', patch, user.version).ok(() => {
						setUser((me) => {
							if (me === undefined) return me
							return { ...me, ...patch, version: me.version + 1 }
						})
					})
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
