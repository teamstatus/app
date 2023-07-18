import { LogoHeader } from '../../components/LogoHeader.js'
import { ReactionsHelp } from '../../components/ReactionsHelp.js'
import { Support } from '../../components/Support.js'

export const Help = () => (
	<>
		<LogoHeader animated />
		<main class="container">
			<div class="row mt-4">
				<section class="col-12 offset-md-3 col-md-6">
					<Support />
				</section>
			</div>
			<ReactionsHelp />
		</main>
	</>
)
