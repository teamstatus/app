import { logoColors } from '#components/Colorpicker.tsx'
import { QuestionIcon } from '#components/Icons.tsx'
import { LogoHeader } from '#components/LogoHeader.tsx'
import { Main } from '#components/Main.tsx'
import { ProjectMenu } from '#components/ProjectMenu.tsx'
import { ProjectSync } from '#components/ProjectSync.tsx'
import { StatusSync } from '#components/StatusSync.tsx'
import { SyncTitle } from '#components/SyncTitle.tsx'
import { UserProfile } from '#components/UserProfile.tsx'
import { WithSync } from '#components/WithSync.tsx'
import { ReactionRole, type Status } from '#context/Status.tsx'
import Color from 'color'

export type ProjectStatusMap = Record<string, Status[]>

export const isStatus = (item: Status | undefined): item is Status =>
	item !== undefined

export const Sync = ({ id }: { id: string }) => (
	<WithSync id={id}>
		{({ statusWithQuestions, projectsWithStatus, sync }) => (
			<>
				<LogoHeader />
				<Main>
					<header
						style={{
							backgroundColor: new Color(logoColors[8]).lighten(0.8).hex(),
						}}
					>
						<div class="container py-4">
							<header class="row">
								<div class="col-12 col-lg-8 offset-lg-2">
									<SyncTitle sync={sync} />
									<p class="mt-2">
										Export for{' '}
										<a href={`/sync/${encodeURIComponent(id)}/export/teams`}>
											Teams
										</a>{' '}
										(
										<a
											href={`/sync/${encodeURIComponent(id)}/export/teams?status=without-links`}
										>
											<abbr title={'without links to statuses'}>no links</abbr>
										</a>
										) &middot;{' '}
										<a
											href={`/sync/${encodeURIComponent(id)}/export/confluence`}
										>
											Confluence
										</a>{' '}
										(
										<a
											href={`/sync/${encodeURIComponent(id)}/export/confluence?status=without-links`}
										>
											<abbr title={'without links to statuses'}>no links</abbr>
										</a>
										)
									</p>
								</div>
							</header>
						</div>
					</header>
					{statusWithQuestions.length > 0 && (
						<div
							style={{
								backgroundColor: new Color(logoColors[5]).lighten(0.8).hex(),
							}}
						>
							<div class="container mb-4 py-4">
								<div class="row">
									<div class="col-12 col-lg-8 offset-lg-2">
										<h2>Questions</h2>
										<hr class="mt-2 mb-4" />
										{statusWithQuestions.map((status) => (
											<>
												<StatusSync key={status.id} status={status} />
												{status.reactions
													.filter(
														(r) =>
															'role' in r && r.role === ReactionRole.QUESTION,
													)
													.map((reaction) => (
														<>
															<QuestionIcon
																key={`${reaction.id}`}
																class="me-1"
															/>
															<UserProfile
																key={`${reaction.id}-user`}
																id={reaction.author}
															/>
														</>
													))}
											</>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
					{projectsWithStatus.map(({ project, status }) => (
						<div key={project.id} class="container ">
							<div class="row mt-3">
								<div class="col-12 col-lg-8 offset-lg-2">
									<ProjectSync
										project={project}
										status={status}
										startDate={sync.inclusiveStartDate}
									/>
								</div>
							</div>
						</div>
					))}
				</Main>
				<ProjectMenu />
			</>
		)}
	</WithSync>
)
