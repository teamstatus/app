import { GET } from '#api/client.js'
import { createContext, type ComponentChildren } from 'preact'
import { notReady } from '#api/notReady.js'
import { resolve } from '#api/resolve.js'
import { useContext, useState } from 'preact/hooks'

export type UserProfile = {
	id: string // e.g. '@alex'
	name: string // e.g. 'Alex Doe'
	pronouns?: string
}

export type UserProfilesContext = {
	get: (id: string) => ReturnType<typeof GET<{ user: UserProfile }>>
	profiles: Record<string, UserProfile>
}

export const UserProfilesContext = createContext<UserProfilesContext>({
	get: notReady<{ user: UserProfile }>,
	profiles: {},
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [profilesMap, setProfilesMap] = useState<Record<string, UserProfile>>(
		{},
	)
	return (
		<UserProfilesContext.Provider
			value={{
				get: (id) => {
					const maybeProfile = profilesMap[id]
					if (maybeProfile !== undefined) return resolve({ user: maybeProfile })
					return GET<{ user: UserProfile }>(
						`/user/${encodeURIComponent(id)}`,
					).ok(({ user }) => {
						setProfilesMap((profiles) => ({ ...profiles, [id]: user }))
					})
				},
				profiles: profilesMap,
			}}
		>
			{children}
		</UserProfilesContext.Provider>
	)
}

export const useUserProfiles = () => useContext(UserProfilesContext)
