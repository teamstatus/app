import { Login as LoginComponent } from '../../components/Login.js'
import { LogoHeader } from '../../components/LogoHeader.js'

export const Login = ({ redirect }: { redirect?: string }) => (
	<>
		<LogoHeader />
		<main class="container">
			<section class="row mt-3">
				<div class="col-12 offset-md-3 col-md-6">
					<LoginComponent redirect={redirect} />
				</div>
			</section>
		</main>
	</>
)
