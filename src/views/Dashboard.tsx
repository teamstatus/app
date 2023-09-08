import { AsHeadline } from '#components/HeadlineFont'
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
								<a href="/project/%24teamstatus%23feedback">
									Suggestions welcome!
								</a>
							</p>
						</div>
					</div>
				</section>

				<section>
					<div class="row mt-4">
						<div class="col-12 col-lg-8 offset-lg-2">
							<hr />
							<h2 class="mt-4">Feedback wanted</h2>
							<p>
								In September 2023, <AsHeadline>teamstatus.space</AsHeadline>{' '}
								<a
									href="https://coderbyheart.com/introducing-teamstatus.space"
									target="_blank"
									rel="friend met noreferrer noopener"
								>
									was announced publicly
								</a>
								.
							</p>
							<p>
								I am interested to hear your feedback, especially whether this
								is a tool you would use yourself. As a thank you for your input
								you’ll be able to keep using the tool without charge with all
								paid features, if and when this turns into a paid service.
							</p>
							<p>
								I’ve created a{' '}
								<a href="/organizations?onboarding=1">
									self-guided onboarding flow
								</a>{' '}
								which will guide you through the features. I’m happy to receive
								your feedback on a channel that you prefer, but I want to
								dog-food it, so please use the{' '}
								<a href="/project/%24teamstatus%23feedback">
									<AsHeadline>$teamstatus#feedback</AsHeadline>
								</a>{' '}
								project for your feedback.
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
