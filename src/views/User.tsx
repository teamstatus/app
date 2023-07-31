import { useAuth } from '#context/Auth.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { EditIcon } from '#components/Icons.js'

export const User = () => {
	const { user } = useAuth()

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
							{user.name !== undefined && (
								<>
									<dt>Name</dt>
									<dd>{user.name}</dd>
								</>
							)}

							{user.pronouns !== undefined && (
								<>
									<dt>Pronouns</dt>
									<dd>{user.pronouns}</dd>
								</>
							)}
						</dl>
					</div>
				</div>
			</Main>
			<ProjectMenu
				actions={[
					{
						href: '/user/edit',
						icon: <EditIcon />,
					},
				]}
			/>
		</>
	)
}
