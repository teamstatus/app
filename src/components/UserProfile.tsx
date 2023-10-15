import { useEffect, useState } from 'preact/hooks'
import {
	useUserProfiles,
	type UserProfile as TUserProfile,
} from '#context/UserProfiles.js'

export const UserProfile = ({ id }: { id: string }) => {
	const { get, profiles } = useUserProfiles()
	const [profile, setProfile] = useState<TUserProfile | undefined>(profiles[id])

	useEffect(() => {
		if (profile !== undefined) return
		get(id).ok(({ user }) => setProfile(user))
	}, [profile])

	return <UserInfo id={id} name={profile?.name} pronouns={profile?.pronouns} />
}

const UserInfo = (
	profile: { id: string } | { id: string; name: string; pronouns?: string },
) => {
	const name = 'name' in profile ? profile.name : undefined
	const id = profile.id
	if (name === undefined) return <span>{id}</span>
	return (
		<span>
			<span>{name}</span>
			{'pronouns' in profile && profile.pronouns !== undefined && (
				<small class="text-muted ms-1">({profile.pronouns})</small>
			)}
			<span class="text-muted mx-1">&middot;</span>
			<span class="text-muted">
				<a
					href={`/user/${encodeURIComponent(id)}`}
					style={{ color: 'inherit' }}
				>
					{id}
				</a>
			</span>
		</span>
	)
}

export const UserName = ({ id }: { id: string }) => {
	const { get, profiles } = useUserProfiles()
	const [profile, setProfile] = useState<TUserProfile | undefined>(profiles[id])

	useEffect(() => {
		if (profile !== undefined) return
		get(id).ok(({ user }) => setProfile(user))
	}, [profile])

	return <span>{profile?.name ?? id}</span>
}
