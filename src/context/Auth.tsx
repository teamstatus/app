import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { CREATE, GET, UPDATE } from '#api/client.js'
import { notReady } from '#api/notReady.js'
import { requestResult, type RequestResult } from '#api/requestResult.js'
import { InternalError } from './InternalError'

type AuthContext = {
	email: string
}

export type UserContext = AuthContext & {
	id: string // e.g. '@alex'
	name?: string // e.g. 'Alex Doe'
	pronouns?: string
	version: number // e.g. 1
}

type AutoLoginState = 'in_progress' | 'failed' | 'success'

export const AuthContext = createContext<{
	logout: () => void
	user?: UserContext
	loggedIn: boolean
	autoLoginState: AutoLoginState
	update: (patch: {
		name: string
		pronouns?: string
	}) => ReturnType<typeof UPDATE>
	loginRequest: (email: string) => ReturnType<typeof CREATE>
	pinLogin: (
		email: string,
		pin: string,
	) => RequestResult<UserContext | undefined>
	selectID: (args: {
		id: string
		name?: string
		pronouns?: string
	}) => RequestResult<UserContext>
}>({
	logout: () => undefined,
	autoLoginState: 'in_progress',
	update: notReady,
	loggedIn: false,
	loginRequest: notReady,
	pinLogin: () => notReady<UserContext | undefined>(),
	selectID: notReady,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [user, setUser] = useState<UserContext>()
	const [autoLoginState, setAutoLoginState] =
		useState<AutoLoginState>('in_progress')
	const [auth, setAuth] = useState<AuthContext>()

	const loggedIn = auth !== undefined

	useEffect(() => {
		GET<{ user: AuthContext | UserContext }>(`/me`, { cacheError: false })
			.ok(({ user }) => {
				setAutoLoginState('success')
				if ('id' in user) {
					setUser(user)
				}
				setAuth(user)
			})
			.fail(() => {
				setAutoLoginState('failed')
			})
	}, [])

	return (
		<AuthContext.Provider
			value={{
				user,
				logout: () => {
					CREATE(`/logout`, {})
						.fail(() => {
							console.error(`Server-side logout failed.`)
						})
						.anyway(() => {
							setUser(undefined)
							setAuth(undefined)
							document.location.assign('/')
						})
				},
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
				loggedIn,
				loginRequest: (email) =>
					CREATE(`/login/email`, { email }).fail((problem) => {
						console.error(problem)
					}),
				pinLogin: (email, pin) => {
					const { request, onFail, onSuccess } = requestResult<
						UserContext | undefined
					>()
					CREATE<Record<string, never>>(`/login/email/pin`, {
						email,
						pin,
					})
						.ok(() => {
							GET<{ user: UserContext }>(`/me`, { cacheError: false })
								.ok(({ user }) => {
									setAuth(user)
									if (user.id !== undefined) {
										setUser(user)
										onSuccess(user)
									} else {
										onSuccess(undefined)
									}
								})
								.fail((problem) => {
									onFail(problem)
									console.error(problem)
								})
						})
						.fail((problem) => {
							onFail(problem)
							console.error(problem)
						})
					return request
				},
				selectID: ({ id, name, pronouns }) => {
					const { request, onFail, onSuccess } = requestResult<UserContext>()

					if (auth === undefined) {
						console.log('selectID', 'user is undefined')
						onFail(InternalError('Not logged in.'))
					} else {
						console.log('CREATE', `/me/user`, { id, name, pronouns })
						CREATE(`/me/user`, { id, name, pronouns })
							.ok(() => {
								const userWithId: UserContext = {
									email: auth.email,
									name,
									pronouns,
									version: 1,
									id,
								}
								setUser(userWithId)
								onSuccess(userWithId)
							})
							.fail(onFail)
					}
					return request
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
