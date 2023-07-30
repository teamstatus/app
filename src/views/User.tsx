import { useAuth } from '#context/Auth.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { EditIcon } from '#components/Icons.js'
import { useProfile } from '#context/UserProfile.js'

export type MyProfile = {
	id: string // e.g. '@alex'
	email: string // e.g. 'alex@example.com'
	name: string // e.g. 'Alex Doe'
	version: number // e.g. 1
	pronouns?: string
}

export const User = () => {
	const { user } = useAuth()
	const { profile } = useProfile()

	if (user === undefined) return null
	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<h1>Your details</h1>
						<dl>
							<dt>Email</dt>
							<dd>{user.email}</dd>
							<dt>ID</dt>
							<dd>{user.id}</dd>
							{profile !== undefined && (
								<>
									<dt>Name</dt>
									<dd>{profile.name}</dd>
									{profile?.pronouns !== undefined && (
										<>
											<dt>Pronouns</dt>
											<dd>{profile.pronouns}</dd>
										</>
									)}
								</>
							)}
						</dl>
					</div>
				</div>
			</Main>
			<ProjectMenu
				action={{
					href: '/user/edit',
					icon: <EditIcon />,
				}}
			/>
		</>
	)
}
