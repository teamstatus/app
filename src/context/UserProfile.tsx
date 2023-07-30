import { GET, UPDATE } from '#api/client.js'
import { createContext, type ComponentChildren } from 'preact'
import { notReady } from '#api/notReady.js'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useAuth } from '#context/Auth.js'

export type UserProfile = {
	id: string // e.g. '@alex'
	email: string // e.g. 'alex@example.com'
	name: string // e.g. 'Alex Doe'
	version: number // e.g. 1
	pronouns?: string
}

export type UserProfileContext = {
	profile?: UserProfile
	update: (patch: {
		name: string
		pronouns?: string
	}) => ReturnType<typeof UPDATE>
}

export const UserProfileContext = createContext<UserProfileContext>({
	update: notReady,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [profile, setProfile] = useState<UserProfile>()
	const { user } = useAuth()

	useEffect(() => {
		if (user?.id === undefined) return
		GET<{
			user: UserProfile
		}>(`/me`).ok(({ user }) => setProfile(user))
	}, [user])

	return (
		<UserProfileContext.Provider
			value={{
				profile,
				update: (patch) => {
					if (profile === undefined) return notReady()
					return UPDATE('/me', patch, profile.version).ok(() => {
						setProfile((me) => {
							if (me === undefined) return me
							return { ...me, ...patch, version: me.version + 1 }
						})
					})
				},
			}}
		>
			{children}
		</UserProfileContext.Provider>
	)
}

export const useProfile = () => useContext(UserProfileContext)
