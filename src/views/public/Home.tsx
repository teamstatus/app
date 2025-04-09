import { Intro } from '#components/Intro.tsx'
import { Login } from '#components/Login'
import { LogoHeader } from '#components/LogoHeader.tsx'

export const Home = () => (
	<>
		<LogoHeader animated />
		<main class="container">
			<section class="row mt-4">
				<div class="col-12 col-lg-7">
					<Intro />
				</div>
				<div class="col-12 col-lg-5 offset-xl-1 col-xl-4">
					<Login />
				</div>
			</section>
		</main>
	</>
)
