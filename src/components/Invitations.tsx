import { useProjects, type Invitation } from '#context/Projects.js'
import { parseInvitationId } from '#proto/ids.js'
import { RolePill } from '#components/RolePill.js'
import { AcceptInvitationIcon } from './Icons.js'
import { ProjectId } from './ProjectId.js'

export const Invitations = () => {
	const { invitations } = useProjects()
	if (invitations.length === 0) return null
	return (
		<section>
			<h2>Open invitations</h2>
			{invitations.map((invitation) => (
				<Invitation invitation={invitation} />
			))}
		</section>
	)
}

const Invitation = ({ invitation }: { invitation: Invitation }) => {
	const { projectId } = parseInvitationId(invitation.id)
	const { acceptProjectInvitation } = useProjects()

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
					acceptProjectInvitation(invitation.id)
				}}
			>
				<AcceptInvitationIcon />
			</button>
		</div>
	)
}