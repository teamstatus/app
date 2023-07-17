import { useEffect } from 'preact/hooks'
import { ReactionsHelp } from '../components/ReactionsHelp.js'
import { SelectID } from '../components/SelectID.js'
import { useAuth } from '../context/Auth.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { route } from 'preact-router'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'

export const About = ({ redirect }: { redirect?: string }) => {
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
				{user?.id === undefined && <SelectID />}
				<section>
					<div class="row mt-3">
						<div class="col-md-8 offset-md-2">
							<p>Welcome {user?.id ?? user?.email ?? 'anonymous'}!</p>
							<h2>What is teamstatus.space?</h2>
							<p>
								Teamstatus.space allows distributed teams to collect status
								updates and collect them for a sync meeting.
							</p>
							<p>
								You use teamstatus.space to track what you are working on, as it
								happens. It may be small updates, or big releases.
							</p>
							<p>
								Status updates are associated to projects, which belong to
								organizations.
							</p>
							<p>
								You can invite coworkers to the projects you are working on.
								They than can also add their own status to the project.
							</p>
							<p>
								And when it's time for a sync meeting with your collaborators,
								you <a href="/sync/create">create a new sync</a> which collect
								all the status updates from the projects your meeting is about,
								from all the collaborators and a time frame you can specify.
								Your previous syncs can be found <a href="/syncs">here</a>.
							</p>
							<p>
								So, in order to share your first status, let's create an
								organization for you. Head over to{' '}
								<a href="/organization/create">organizations</a> to get started.
							</p>
						</div>
					</div>
				</section>
				<ReactionsHelp />
			</Main>
			<ProjectMenu />
		</>
	)
}
