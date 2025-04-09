import { LogoHeader } from '#components/LogoHeader.tsx'
import { ProjectMenu } from '#components/ProjectMenu.tsx'
import { Main } from '#components/Main.tsx'
import {
	useUserProfiles,
	type UserProfile as tUserProfile,
} from '#context/UserProfiles.tsx'
import { useCallback, useEffect, useState } from 'preact/hooks'

export const UserProfile = ({
	id,
	version,
}: {
	id: string
	version?: string
}) => {
	const { get } = useUserProfiles()
	const [profile, setProfile] = useState<tUserProfile>()

	const getProfile = useCallback(() => get(id), [get, id])

	useEffect(() => {
		getProfile().ok(({ user }) => setProfile(user))
	}, [getProfile])

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-lg-8 offset-lg-2">
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
