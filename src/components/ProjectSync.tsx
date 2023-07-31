import { decodeTime } from 'ulid'
import { type Project } from '#context/Projects.js'
import { type Status } from '#context/Status.js'
import { StatusSync } from '#components/StatusSync.js'
import './ProjectSync.css'
import { ShortDate } from '#components/ShortDate.js'

export const byTimeDesc = (s1: Status, s2: Status): number =>
	decodeTime(s2.id) - decodeTime(s1.id)

export const ProjectSync = ({
	project,
	status,
	startDate,
}: {
	startDate?: Date
	project: Project
	status: Status[]
}) => (
	<section class="projectInSync">
		<header class="d-flex justify-content-between align-items-end">
			<h2 class="mt-4 mb-0">{project.name ?? project.id}</h2>
			<small>
				<a
					href={`/project/${encodeURIComponent(project.id)}`}
					class="text-muted"
				>
					{project.id}
				</a>
			</small>
		</header>

		<hr class="mt-2 mb-4" />
		{status.length === 0 && (
			<>
				<p>
					{startDate === undefined && <em>No updates.</em>}
					{startDate !== undefined && (
						<em>
							No updates since <ShortDate date={startDate} />.
						</em>
					)}
				</p>
			</>
		)}
		{status.sort(byTimeDesc).map((status, i, arr) => (
			<>
				<StatusSync status={status} />
				{arr.length > 1 && i !== arr.length - 1 && (
					<hr style={{ opacity: 0.1 }} />
				)}
			</>
		))}
	</section>
)
