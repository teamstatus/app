import { Markdown } from '#components/Markdown.tsx'
import { byTimeDesc } from '#components/ProjectSync.tsx'
import { ShortDate } from '#components/ShortDate.tsx'
import { signficantReactionsByAuthor } from '#components/StatusSync.tsx'
import { WithSync } from '#components/WithSync.tsx'
import type { Status } from '#context/Status.tsx'
import type { Sync } from '#context/Syncs.tsx'
import { decodeTime } from 'ulid'

export const SyncExportConfluence = ({ id }: { id: string }) => (
	<WithSync id={id}>
		{({ sync, projectsWithStatus }) => (
			<ul>
				{projectsWithStatus.map(({ project, status }) => (
					<li key={project.id}>
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
				<li key={status.id}>
					{signficantReactionsByAuthor(status).map((reaction) => (
						<span key={`${reaction.emoji}-${reaction.description ?? ''}`}>
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
