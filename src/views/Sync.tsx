import { logoColors } from '#components/Colorpicker.js'
import { QuestionIcon } from '#components/Icons.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { Main } from '#components/Main.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { ProjectSync } from '#components/ProjectSync.js'
import { StatusSync } from '#components/StatusSync.js'
import { SyncTitle } from '#components/SyncTitle.js'
import { UserProfile } from '#components/UserProfile.js'
import { WithSync } from '#components/WithSync.js'
import { ReactionRole, type Status } from '#context/Status.js'
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
										&middot;{' '}
										<a
											href={`/sync/${encodeURIComponent(id)}/export/confluence`}
										>
											Confluence
										</a>
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
												<StatusSync status={status} />
												{status.reactions
													.filter(
														(r) =>
															'role' in r && r.role === ReactionRole.QUESTION,
													)
													.map((reaction) => (
														<>
															<QuestionIcon class="me-1" />
															<UserProfile id={reaction.author} />
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
						<div class="container ">
							<div class="row mt-3">
								<div class="col-12 col-lg-8 offset-lg-2">
									<ProjectSync
										key={project.id}
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
