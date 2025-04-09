import {
	useProjects,
	type Invitation as tInvitation,
} from '#context/Projects.tsx'
import { parseInvitationId } from '#proto/ids.ts'
import { RolePill } from '#components/RolePill.tsx'
import { AcceptInvitationIcon, InFlightIcon } from './Icons.tsx'
import { ProjectId } from './ProjectId.tsx'
import { Aside } from './Aside.tsx'
import { useState } from 'preact/hooks'

export const Invitations = () => {
	const { invitations } = useProjects()
	if (invitations.length === 0) return null
	return (
		<Aside class="container">
			<div class="row mt-2">
				<div class="col-12 col-lg-8 offset-lg-2">
					<h2>Open invitations</h2>
					{invitations.map((invitation) => (
						<Invitation key={invitation.id} invitation={invitation} />
					))}
				</div>
			</div>
		</Aside>
	)
}

const Invitation = ({ invitation }: { invitation: tInvitation }) => {
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
