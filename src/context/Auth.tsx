import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

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
		fetch(`${API_ENDPOINT}/me`, {
			headers: {
				Accept: 'application/json; charset=utf-8',
			},
			mode: 'cors',
			credentials: 'include',
		})
			.then(async (res) => res.json())
			.then((user) => {
				setUser(user)
				setAutoLoginState('success')
			})
			.catch((err) => {
				console.error(err)
				setAutoLoginState('failed')
			})
	}, [])

	return (
		<AuthContext.Provider
			value={{
				setUser,
				logout: () => {
					fetch(`${API_ENDPOINT}/logout`, {
						headers: {
							Accept: 'application/json; charset=utf-8',
						},
						mode: 'cors',
						credentials: 'include',
						method: 'POST',
					})
						.catch((err) => {
							console.error(`Server-side logout failed.`)
							console.error(err)
						})
						.finally(() => {
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
