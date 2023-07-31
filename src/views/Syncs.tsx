import { decodeTime } from 'ulid'
import { useSyncs } from '#context/Syncs.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import { DeleteIcon, SyncIcon } from '#components/Icons.js'
import { ShortDate } from '#components/ShortDate.js'
import { EditMenu } from '#components/EditMenu.js'

export const Syncs = () => {
	const { syncs, deleteSync } = useSyncs()
	const syncItems = Object.values(syncs)

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
						<section>
							<div class="d-flex justify-content-between align-items-center">
								<h1>Syncs</h1>
								<SyncIcon />
							</div>
							{syncItems.length === 0 && (
								<>
									<p>You have no syncs,yet.</p>
									<p>
										Why don't you <a href="/sync/create">create a new sync</a>{' '}
										right now?
									</p>
								</>
							)}
							{syncItems.length > 0 &&
								syncItems.map((sync) => {
									const ts = new Date(decodeTime(sync.id))
									return (
										<>
											<div
												class="my-2 d-flex justify-content-between align-items-center"
												key={sync.id}
											>
												<div>
													<small class="text-muted text-nowrap">
														<ShortDate date={ts} />
													</small>
													<br />
													<a href={`/sync/${sync.id}`}>{sync.title}</a>
												</div>
												<EditMenu>
													<button
														type="button"
														class="btn btn-sm btn-outline-danger me-1"
														onClick={() => {
															deleteSync(sync)
														}}
													>
														<DeleteIcon size={18} />
													</button>
												</EditMenu>
											</div>
											<hr />
										</>
									)
								})}
						</section>
					</div>
				</div>
			</Main>
			<ProjectMenu actions={[{ href: '/sync/create' }]} />
		</>
	)
}
