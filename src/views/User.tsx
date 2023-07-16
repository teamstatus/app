import { useAuth } from '../context/Auth.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { ProjectMenu } from '../components/ProjectMenu.js'

export const User = () => {
	const { user } = useAuth()
	if (user === undefined) return null
	return (
		<>
			<LogoHeader />
			<main class="container">
				<div class="row mt-3">
					<div class="col-md-8 offset-md-2">
						<h1>User</h1>
						<dl>
							<dt>Email</dt>
							<dd>{user.email}</dd>
							<dt>ID</dt>
							<dd>{user.id}</dd>
						</dl>
					</div>
				</div>
			</main>
			<ProjectMenu />
		</>
	)
}
