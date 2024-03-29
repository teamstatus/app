import { Login as LoginComponent } from '#components/Login.js'
import { LogoHeader } from '#components/LogoHeader.js'
import { PickID } from '#components/PickID'
import { useAuth } from '#context/Auth'

export const Login = ({ redirect }: { redirect?: string }) => {
	const { loggedIn, user } = useAuth()
	return (
		<>
			<LogoHeader />
			<main class="container">
				<section class="row mt-3">
					<div class="col-12 col-lg-8 offset-lg-2">
						<LoginComponent redirect={redirect} />
					</div>
				</section>
				{loggedIn && user === undefined && <PickID />}
			</main>
		</>
	)
}
