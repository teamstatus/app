import { Intro } from '#components/Intro.js'
import { LogoHeader } from '#components/LogoHeader.js'

export const Home = () => (
	<>
		<LogoHeader animated />
		<main class="container">
			<section class="row mt-3">
				<div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
					<Intro />
				</div>
			</section>
		</main>
	</>
)
