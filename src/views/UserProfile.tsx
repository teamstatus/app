import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import {
	useUserProfiles,
	type UserProfile as TUserProfile,
} from '#context/UserProfiles.js'
import { useEffect, useState } from 'preact/hooks'

export const UserProfile = ({ id }: { id: string }) => {
	const { get } = useUserProfiles()
	const [profile, setProfile] = useState<TUserProfile>()

	useEffect(() => {
		get(id).ok(({ user }) => setProfile(user))
	}, [id])

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<h1>{id}</h1>
						{profile !== undefined && (
							<dl>
								<dt>Name</dt>
								<dd>{profile.name}</dd>
								{profile.pronouns !== undefined && (
									<>
										<dt>Pronouns</dt>
										<dd>{profile.pronouns}</dd>
									</>
								)}
							</dl>
						)}
					</div>
				</div>
			</Main>
			<ProjectMenu />
		</>
	)
}
