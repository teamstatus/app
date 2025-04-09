import { LogoHeader } from '#components/LogoHeader.tsx'
import { ReactionsHelp } from '#components/ReactionsHelp.tsx'

export const Reactions = () => (
	<>
		<LogoHeader />
		<main class="container">
			<div class="row mt-3">
				<div class="col-12 col-lg-8 offset-lg-2">
					<ReactionsHelp />
				</div>
			</div>
		</main>
	</>
)
