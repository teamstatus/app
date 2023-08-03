import { Dizzy } from '#openmoji/1F4AB.jsx'
import { PersonRaisingHand } from '#openmoji/1F64B.jsx'
import { Rocket } from '#openmoji/1F680.jsx'
import { redirectAfterLogin } from './redirectAfterLogin.js'

export const Intro = () => (
	<>
		<h1>
			About{' '}
			<span
				style={{
					fontFamily: 'var(--headline-font)',
					fontWeight: 700,
				}}
			>
				teamstatus.space
			</span>
		</h1>
		<p>
			<a
				href="https://teamstatus.space"
				style={{
					fontFamily: 'var(--headline-font)',
					fontWeight: 700,
				}}
			>
				teamstatus.space
			</a>{' '}
			allows distributed teams to collect status updates and collect them for a
			sync meeting.
		</p>
		<p>
			It is made by <a href="https://coderbyheart.com/">Markus Tacker</a>, in
			Norway.
		</p>
		<p>
			You use{' '}
			<span
				style={{
					fontFamily: 'var(--headline-font)',
					fontWeight: 700,
				}}
			>
				teamstatus.space
			</span>{' '}
			to track what you are working on, as it happens. It may be small updates,
			or big releases.
		</p>
		<p>
			Status updates are associated to projects, which belong to organizations.
		</p>
		<p>
			You can invite coworkers to the projects you are working on. They than can
			also add their own status to the project.
		</p>
		<p>
			Team members can see status, and add reactions. They are an important tool
			to share praise <Dizzy />, but also prepare the next sync meeting. Status
			can be marked as significant <Rocket />, so they will be highlighted in
			the next sync. Or a status can be marked as a question{' '}
			<PersonRaisingHand /> so they can be discussed during the sync.
		</p>
		<p>
			And when it's time for a sync meeting with your collaborators, you create
			a new sync which collect all the status updates from the projects your
			meeting is about, from all the collaborators and a time frame you can
			specify.
		</p>
		<p>
			This way you do not have to remember all the big and small things that
			happened since your last sync with this team; or the other group of
			stakeholders you only meet every other week.
		</p>
		<p>
			And since you can share what happened in advance, you can spend your time
			during the meeting to discuss the highlights and the open question which
			ensures that everyone's time is used most efficiently.
		</p>
		<p>
			So, in order to share your first status, let's create an organization for
			you. Head over to{' '}
			<a href={redirectAfterLogin('/organization/create')}>organizations</a> to
			get started.
		</p>
	</>
)
