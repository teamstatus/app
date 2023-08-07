import { LogoHeader } from '#components/LogoHeader.js'
import { ReactionsHelp } from '#components/ReactionsHelp.js'

export const Reactions = () => (
	<>
		<LogoHeader />
		<main class="container">
			<div class="row mt-3">
				<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
					<ReactionsHelp />
				</div>
			</div>
		</main>
	</>
)
