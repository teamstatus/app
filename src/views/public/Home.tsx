import { Intro } from '#components/Intro.js'
import { LogoHeader } from '#components/LogoHeader.js'

export const Home = () => (
	<>
		<LogoHeader animated />
		<main class="container">
			<section class="row mt-3">
				<div class="col-12 col-lg-8 offset-lg-2">
					<Intro />
				</div>
			</section>
		</main>
	</>
)
