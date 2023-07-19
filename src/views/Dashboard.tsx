import { useEffect } from 'preact/hooks'
import { SelectID } from '../components/SelectID.js'
import { useAuth } from '../context/Auth.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { route } from 'preact-router'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'

export const Dashboard = ({ redirect }: { redirect?: string }) => {
	const { user } = useAuth()

	useEffect(() => {
		if (redirect === undefined) return
		console.debug(`Redirecting to`, redirect)
		route(redirect)
	}, [redirect])

	return (
		<>
			<LogoHeader animated />
			<Main class="container">
				<section>
					<div class="row mt-4">
						<div class="col-12 col-md-6 offset-md-3">
							<h1>
								Welcome{' '}
								<strong>{user?.id ?? user?.email ?? 'anonymous'}</strong>!
							</h1>
							<p>
								This is your Dashboard, and we haven't figured out what to show
								you here, yet.
							</p>
							<p>
								<a
									href="https://github.com/orgs/teamstatus/discussions/categories/ideas"
									target="_blank"
								>
									Suggestions welcome!
								</a>
							</p>
						</div>
					</div>
				</section>
				{user?.id === undefined && (
					<section>
						<div class="row mt-4">
							<div class="col-12 col-md-6 offset-md-3">
								<SelectID />
							</div>
						</div>
					</section>
				)}
			</Main>
			<ProjectMenu />
		</>
	)
}
