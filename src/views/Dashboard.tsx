import { Invitations } from '#components/Invitations.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Onboarding } from '#components/onboarding/Onboarding.js'
import { useAuth } from '#context/Auth.js'
import { route } from 'preact-router'
import { useEffect } from 'preact/hooks'

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
			<Onboarding />
			<Main class="container">
				<section>
					<div class="row mt-4">
						<div class="col-12 col-lg-8 offset-lg-2">
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
									rel="noreferrer noopener"
								>
									Suggestions welcome!
								</a>
							</p>
						</div>
					</div>
				</section>
			</Main>
			<Invitations />
			<ProjectMenu />
		</>
	)
}
