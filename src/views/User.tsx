import { useAuth } from '#context/Auth.tsx'
import { LogoHeader } from '#components/LogoHeader.tsx'
import { ProjectMenu } from '#components/ProjectMenu.tsx'
import { Main } from '#components/Main.tsx'
import { EditIcon } from '#components/Icons.tsx'

export const User = () => {
	const { user } = useAuth()

	if (user === undefined) return null
	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-lg-8 offset-lg-2">
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
