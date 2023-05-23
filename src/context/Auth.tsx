import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type UserContext = {
	email: string
	id?: string
}

export const AuthContext = createContext<{
	logout: () => void
	setUser: (user: UserContext) => void
	loggedIn: boolean
	user?: UserContext
}>({
	logout: () => undefined,
	setUser: () => undefined,
	loggedIn: false,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [user, setUser] = useState<UserContext>()

	useEffect(() => {
		fetch(`${API_ENDPOINT}/me`, {
			headers: {
				Accept: 'application/json; charset=utf-8',
			},
			mode: 'cors',
			credentials: 'include',
		})
			.then(async (res) => res.json())
			.then(setUser)
			.catch(console.error)
	}, [])

	return (
		<AuthContext.Provider
			value={{
				setUser,
				loggedIn: user !== undefined,
				logout: () => {
					// FIXME: clear cookie
					setUser(undefined)
				},
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const Consumer = AuthContext.Consumer

export const useAuth = () => useContext(AuthContext)
