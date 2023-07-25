import { useAuth } from '#context/Auth.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { useEffect, useState } from 'preact/hooks'
import { GET } from '#api/client.js'

type Profile = {
	id: string // e.g. '@alex'
	email: string // e.g. 'alex@example.com'
	name: string // e.g. 'Alex Doe'
	version: number // e.g. 1
	pronouns?: string
}

export const User = () => {
	const { user } = useAuth()
	const [profile, setProfile] = useState<Profile>()

	useEffect(() => {
		if (user?.id === undefined) return
		GET<{
			user: Profile
		}>(`/me`).ok(({ user }) => setProfile(user))
	}, [user])

	if (user === undefined) return null
	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<h1>
							{profile !== undefined && <UserInfo profile={profile} />}
							{profile === undefined && <>{user.id ?? 'anonymous'}</>}
						</h1>
						<dl>
							<dt>Email</dt>
							<dd>{user.email}</dd>
							<dt>ID</dt>
							<dd>{user.id}</dd>
							{profile !== undefined && (
								<>
									<dt>Name</dt>
									<dd>{profile.name}</dd>
								</>
							)}
						</dl>
					</div>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}

const UserInfo = ({ profile }: { profile: Profile }) => {
	return (
		<>
			<strong class="me-1">{profile.name}</strong>
			{profile.pronouns !== undefined && (
				<span class="text-muted">({profile.pronouns})</span>
			)}
			<small class="text-muted">{profile.id}</small>
		</>
	)
}
