import { decodeTime } from 'ulid'
import { useSyncs } from '../context/Syncs.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'
import { SyncIcon } from '../components/Icons.js'

export const Syncs = () => {
	const { syncs } = useSyncs()
	const syncItems = Object.values(syncs)

	return (
		<>
			<LogoHeader />
			<Main class="container">
				<div class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
						<div class="card">
							<div class="card-header  d-flex justify-content-between align-items-center">
								<h1>Syncs</h1>
								<SyncIcon />
							</div>
							{syncItems.length === 0 && (
								<div class="card-body">
									<p>You have no syncs,yet.</p>
									<p>
										Why don't you <a href="/sync/create">create a new sync</a>{' '}
										right now?
									</p>
								</div>
							)}
							{syncItems.length > 0 && (
								<ul class="list-group list-group-flush">
									{syncItems.map((sync) => {
										const ts = new Date(decodeTime(sync.id))
										return (
											<li class="list-group-item">
												<a href={`/sync/${sync.id}`}>{sync.title}</a>
												<small class="me-1 text-muted ms-1 text-nowrap">
													(
													<time dateTime={ts.toISOString()}>
														{ts.toISOString().slice(0, 10)}
													</time>
													)
												</small>
											</li>
										)
									})}
								</ul>
							)}
						</div>
					</div>
				</div>
			</Main>
			<ProjectMenu action={{ href: '/sync/create' }} />
		</>
	)
}
