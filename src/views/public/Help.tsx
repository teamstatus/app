import { LogoHeader } from '#components/LogoHeader.tsx'
import { ReactionsHelp } from '#components/ReactionsHelp.tsx'
import { Support } from '#components/Support.tsx'

export const Help = () => (
	<>
		<LogoHeader animated />
		<main class="container">
			<div class="row mt-4">
				<section class="col-12 col-lg-8 offset-lg-2">
					<Support />
				</section>
			</div>
			<div class="row mt-3">
				<div class="col-12 col-lg-8 offset-lg-2">
					<ReactionsHelp />
				</div>
			</div>
		</main>
	</>
)
