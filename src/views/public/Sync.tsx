import { LogoHeader } from '../../components/LogoHeader.js'

export const Sync = ({ id }: { id: string }) => (
	<>
		<LogoHeader />
		<main class="container">
			<section class="row mt-3">
				<div class="col">
					<div class="alert alert-warning" role="alert">
						You need to{' '}
						<a
							href={`/?${new URLSearchParams({
								redirect: `/sync/${id}`,
							})}`}
						>
							log in
						</a>{' '}
						order to access this sync.
					</div>
				</div>
			</section>
		</main>
	</>
)
