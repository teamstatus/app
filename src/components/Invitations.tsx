import {
	useProjects,
	type Invitation as TInvitation,
} from '#context/Projects.js'
import { parseInvitationId } from '#proto/ids.js'
import { RolePill } from '#components/RolePill.js'
import { AcceptInvitationIcon, InFlightIcon } from './Icons.js'
import { ProjectId } from './ProjectId.js'
import { Aside } from './Aside.js'
import { useState } from 'preact/hooks'

export const Invitations = () => {
	const { invitations } = useProjects()
	if (invitations.length === 0) return null
	return (
		<Aside class="container">
			<div class="row mt-2">
				<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
					<h2>Open invitations</h2>
					{invitations.map((invitation) => (
						<Invitation invitation={invitation} />
					))}
				</div>
			</div>
		</Aside>
	)
}

const Invitation = ({ invitation }: { invitation: TInvitation }) => {
	const { projectId } = parseInvitationId(invitation.id)
	const { acceptProjectInvitation } = useProjects()
	const [inFlight, setInFlight] = useState<boolean>(false)

	return (
		<div class="d-flex align-items-center justify-content-between mb-2">
			<div class={'me-2'}>
				<small>
					Invitation by <code>{invitation.inviter}</code>
				</small>
				<br />
				<ProjectId id={projectId as string} />
				<RolePill role={invitation.role} class="ms-1" />
			</div>
			<button
				type="button"
				class="btn btn-outline-primary btn-sm"
				onClick={() => {
					setInFlight(true)
					acceptProjectInvitation(invitation.id).anyway(() => {
						setInFlight(false)
					})
				}}
				disabled={inFlight}
			>
				{inFlight ? <InFlightIcon /> : <AcceptInvitationIcon />}
			</button>
		</div>
	)
}
