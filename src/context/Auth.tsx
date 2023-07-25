import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { CREATE, GET } from '#api/client.js'

export type UserContext = {
	email: string
	id?: string
}

type AutoLoginState = 'in_progress' | 'failed' | 'success'

export const AuthContext = createContext<{
	logout: () => void
	setUser: (user: UserContext) => void
	user?: UserContext
	autoLoginState: AutoLoginState
}>({
	logout: () => undefined,
	setUser: () => undefined,
	autoLoginState: 'in_progress',
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [user, setUser] = useState<UserContext>()
	const [autoLoginState, setAutoLoginState] =
		useState<AutoLoginState>('in_progress')

	useEffect(() => {
		GET<{ user: UserContext }>(`/me`)
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
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const Consumer = AuthContext.Consumer

export const useAuth = () => useContext(AuthContext)
