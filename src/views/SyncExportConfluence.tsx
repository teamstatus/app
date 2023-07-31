import { Markdown } from '#components/Markdown.js'
import { byTimeDesc } from '#components/ProjectSync.js'
import { ShortDate } from '#components/ShortDate.js'
import { signficantReactionsByAuthor } from '#components/StatusSync.js'
import { WithSync } from '#components/WithSync.js'
import type { Status } from '#context/Status.js'
import type { Sync } from '#context/Syncs.js'
import { decodeTime } from 'ulid'

export const SyncExportConfluence = ({ id }: { id: string }) => (
	<WithSync id={id}>
		{({ sync, projectsWithStatus }) => (
			<ul>
				{projectsWithStatus.map(({ project, status }) => (
					<li>
						<h2>
							<strong>{project.name ?? project.id}</strong>
						</h2>
						<RenderProject status={status} sync={sync} />
					</li>
				))}
			</ul>
		)}
	</WithSync>
)

const RenderProject = ({ status, sync }: { status: Status[]; sync: Sync }) => {
	const startDate = sync.inclusiveStartDate
	if (status.length === 0)
		return (
			<>
				{startDate === undefined && <em>No updates.</em>}
				{startDate !== undefined && (
					<em>
						No updates since <ShortDate date={startDate} />.
					</em>
				)}
			</>
		)
	return (
		<ul>
			{status.sort(byTimeDesc).map((status) => (
				<li>
					{signficantReactionsByAuthor(status).map((reaction) => (
						<span>
							{reaction.emoji}{' '}
							<strong>
								{reaction.description ?? 'No description available.'}
							</strong>
						</span>
					))}
					<Markdown markdown={status.message} />
					<small>
						<a
							href={`/project/${encodeURIComponent(
								status.project,
							)}/status/${encodeURIComponent(status.id)}`}
							class="text-muted"
						>
							<ShortDate date={new Date(decodeTime(status.id))} />
						</a>
					</small>
				</li>
			))}
		</ul>
	)
}
