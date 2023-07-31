import { decodeTime } from 'ulid'
import { useSyncs, type Sync } from '#context/Syncs.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { ProjectMenu } from '#components/ProjectMenu.js'
import { Main } from '#components/Main.js'
import {
	CollapseRightIcon,
	DeleteIcon,
	SubMenuIcon,
	SyncIcon,
} from '#components/Icons.js'
import { ShortDate } from '#components/ShortDate.js'
import { useState } from 'preact/hooks'

export const Syncs = () => {
	const { syncs } = useSyncs()
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
												<EditMenu sync={sync} />
											</div>
											<hr />
										</>
									)
								})}
						</section>
					</div>
				</div>
			</Main>
			<ProjectMenu action={{ href: '/sync/create' }} />
		</>
	)
}

const EditMenu = ({ sync }: { sync: Sync }) => {
	const [operationsVisible, showOperations] = useState<boolean>(false)
	const { deleteSync } = useSyncs()

	if (!operationsVisible) {
		return (
			<button
				type="button"
				class="btn btn-sm btn-light me-1"
				onClick={() => showOperations(true)}
			>
				<SubMenuIcon size={18} />
			</button>
		)
	}
	return (
		<div>
			<button
				type="button"
				class="btn btn-sm btn-outline-danger me-1"
				onClick={() => {
					deleteSync(sync)
				}}
			>
				<DeleteIcon size={18} />
			</button>
			<button
				type="button"
				class="btn btn-sm btn-light"
				onClick={() => showOperations(false)}
			>
				<CollapseRightIcon size={18} />
			</button>
		</div>
	)
}
