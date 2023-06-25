import { AddIcon, EndDate, StartDate } from '../components/Icons.js'
import { useSyncs } from '../context/Syncs.js'

export const Syncs = () => {
	const { syncs } = useSyncs()
	const syncItems = Object.values(syncs)

	return (
		<main class="container">
			<div class="row mt-3">
				<div class="col-12 col-md-6 offset-md-3">
					<div class="card">
						<div class="card-header">
							<h1>Syncs</h1>
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
								{syncItems.map((sync) => (
									<li class="list-group-item">
										<a href={`/sync/${sync.id}`}>
											{sync.title}
											{sync.inclusiveStartDate !== undefined && (
												<time dateTime={sync.inclusiveStartDate.toISOString()}>
													<StartDate />
													{sync.inclusiveStartDate.toISOString()}
												</time>
											)}
											{sync.inclusiveEndDate !== undefined && (
												<time dateTime={sync.inclusiveEndDate.toISOString()}>
													<EndDate />
													{sync.inclusiveEndDate.toISOString()}
												</time>
											)}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>

			<a
				href={`/sync/create`}
				style={{
					borderRadius: '100%',
					color: 'white',
					backgroundColor: '#198754',
					display: 'block',
					height: '48px',
					width: '48px',
					boxShadow: '0 0 8px 0 #00000075',
					position: 'fixed',
					right: '10px',
					bottom: '70px',
				}}
				class="d-flex align-items-center justify-content-center"
			>
				<AddIcon />
			</a>
		</main>
	)
}
