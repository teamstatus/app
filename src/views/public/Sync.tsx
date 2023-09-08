import { LogoHeader } from '#components/LogoHeader.js'
import { redirectAfterLogin } from '#components/redirectAfterLogin.js'

export const Sync = ({ id }: { id: string }) => (
	<>
		<LogoHeader />
		<main class="container">
			<section class="row mt-3">
				<div class="col-12 col-lg-8 offset-lg-2">
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
