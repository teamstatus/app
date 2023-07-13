import { decodeTime } from 'ulid'
import { type Project } from '../context/Projects.js'
import { ReactionRole, type Reaction, type Status } from '../context/Status.js'
import { QuestionIcon } from './Icons.js'
import { StatusSync } from './StatusSync.js'

const isRole = (role: ReactionRole) => (reaction: Reaction) =>
	'role' in reaction && reaction.role === role

const filterByRole = (role: ReactionRole) => (status: Status) =>
	status.reactions.find(isRole(role)) !== undefined

const byTimeAsc = (s1: Status, s2: Status): number =>
	decodeTime(s1.id) - decodeTime(s2.id)

export const ProjectSync = ({
	project,
	status,
	startDate,
}: {
	startDate?: Date
	project: Project
	status: Status[]
}) => {
	const significant = status
		.sort(byTimeAsc)
		.filter(filterByRole(ReactionRole.SIGNIFICANT))
	const normal = status
		.sort(byTimeAsc)
		.filter((status) => !significant.includes(status))
	const questions = status
		.sort(byTimeAsc)
		.filter(filterByRole(ReactionRole.QUESTION))

	return (
		<section class="pt-4">
			<h2 class="mt-4">{project.name ?? project.id}</h2>
			{status.length === 0 && (
				<>
					<p>
						{startDate === undefined && <em>No updates.</em>}
						{startDate !== undefined && (
							<em>
								No updates since{' '}
								<time dateTime={startDate.toISOString()}>
									{startDate.toLocaleDateString()}
								</time>
								.
							</em>
						)}
					</p>
					<hr />
				</>
			)}
			{questions.length > 0 && (
				<>
					<div class={'card'}>
						<div class={'card-header'}>
							<h3>Questions ({questions.length})</h3>
						</div>
						<div class="list-group list-group-flush">
							{questions.map((status) => {
								const users = status.reactions
									.filter(isRole(ReactionRole.QUESTION))
									.map(({ author }) => author)
								return (
									<div class="list-group-item">
										<div>
											<QuestionIcon />{' '}
											{users.map((user) => (
												<span>{user}</span>
											))}
										</div>
										<StatusSync status={status} />
									</div>
								)
							})}
						</div>
					</div>
				</>
			)}
			{significant.length > 0 && (
				<>
					<div class="card mt-3 mb-3">
						<div class="card-header">
							<h3>Significant updates</h3>
						</div>
						<div class="list-group list-group-flush">
							{significant.map((status) => (
								<div class="list-group-item">
									<StatusSync status={status} />
								</div>
							))}
						</div>
					</div>
					{normal.length > 0 && <h3>Remaining updates</h3>}
				</>
			)}
			{normal.map((status) => (
				<StatusSync status={status} />
			))}
		</section>
	)
}
