import { Markdown } from '#components/Markdown.tsx'
import { byTimeDesc } from '#components/ProjectSync.tsx'
import { ShortDate } from '#components/ShortDate.tsx'
import { signficantReactionsByAuthor } from '#components/StatusSync.tsx'
import { WithSync } from '#components/WithSync.tsx'
import { decodeTime } from 'ulid'

export const SyncExportTeams = ({ id }: { id: string }) => {
	const noLinks =
		new URLSearchParams(window.location.search).get('status') ===
		'without-links'
	return (
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
								<table key={`project-${project.id}`}>
									<thead>
										<tr>
											<th colSpan={2}>{project.name ?? project.id}</th>
										</tr>
									</thead>
									<tbody>
										{status.sort(byTimeDesc).map((status) => (
											<tr key={status.id}>
												<td>
													{signficantReactionsByAuthor(status).map(
														(reaction) => (
															<p
																key={`${reaction.emoji}-${reaction.description ?? ''}`}
															>
																{reaction.emoji}{' '}
																<strong>
																	{reaction.description ??
																		'No description available.'}
																</strong>
															</p>
														),
													)}
													<Markdown markdown={status.message} />
												</td>
												{!noLinks && (
													<td>
														<a
															href={`/project/${encodeURIComponent(
																status.project,
															)}/status/${encodeURIComponent(status.id)}`}
															class="text-muted"
														>
															<ShortDate
																date={new Date(decodeTime(status.id))}
															/>
														</a>
													</td>
												)}
											</tr>
										))}
									</tbody>
								</table>
								<br key={`br-${project.id}`} />
							</>
						)
					})}
				</>
			)}
		</WithSync>
	)
}
