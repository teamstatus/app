import { Markdown } from '#components/Markdown.js'
import { byTimeDesc } from '#components/ProjectSync.js'
import { ShortDate } from '#components/ShortDate.js'
import { signficantReactionsByAuthor } from '#components/StatusSync.js'
import { WithSync } from '#components/WithSync.js'
import { decodeTime } from 'ulid'

export const SyncExportTeams = ({ id }: { id: string }) => (
	<WithSync id={id}>
		{({ sync, projectsWithStatus }) => (
			<>
				{projectsWithStatus.map(({ project, status }) => {
					const startDate = sync.inclusiveStartDate
					if (status.length === 0)
						return (
							<>
								<h2>{project.name ?? project.id}</h2>
								<p>
									{startDate === undefined && <em>No updates.</em>}
									{startDate !== undefined && (
										<em>
											No updates since <ShortDate date={startDate} />.
										</em>
									)}
								</p>
							</>
						)

					return (
						<>
							<table>
								<tr>
									<th colSpan={2}>{project.name ?? project.id}</th>
								</tr>
								{status.sort(byTimeDesc).map((status) => (
									<tr>
										<td>
											{signficantReactionsByAuthor(status).map((reaction) => (
												<p>
													{reaction.emoji}{' '}
													<strong>
														{reaction.description ??
															'No description available.'}
													</strong>
												</p>
											))}
											<Markdown markdown={status.message} />
										</td>
										<td>
											<a
												href={`/project/${encodeURIComponent(
													status.project,
												)}/status/${encodeURIComponent(status.id)}`}
												class="text-muted"
											>
												<ShortDate date={new Date(decodeTime(status.id))} />
											</a>
										</td>
									</tr>
								))}
							</table>
							<br />
						</>
					)
				})}
			</>
		)}
	</WithSync>
)
