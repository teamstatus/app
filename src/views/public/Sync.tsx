import { LogoHeader } from '#components/LogoHeader.js'
import { redirectAfterLogin } from '#components/redirectAfterLogin.js'

export const Sync = ({ id }: { id: string }) => (
	<>
		<LogoHeader />
		<main class="container">
			<section class="row mt-3">
				<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
					<div class="alert alert-warning" role="alert">
						You need to{' '}
						<a href={redirectAfterLogin(`/sync/${encodeURIComponent(id)}`)}>
							log in
						</a>{' '}
						order to access this sync.
					</div>
				</div>
			</section>
		</main>
	</>
)
