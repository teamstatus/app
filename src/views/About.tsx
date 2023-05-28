import { Ago } from '../components/Ago.js'
import { ReactionsHelp } from '../components/ReactionsHelp.js'
import { useAuth } from '../context/Auth.js'

export const About = () => {
	const { user } = useAuth()
	return (
		<main class="container">
			<section>
				<div class="row mt-3">
					<div class="col-12">
						<h1>Teamstatus.space</h1>
						<p>Welcome {user?.id ?? user?.email ?? 'anonymous'}!</p>
						<hr />
						<dl>
							<dt>Version</dt>
							<dd>{VERSION}</dd>
							<dt>build time</dt>
							<dd>
								<time dateTime={BUILD_TIME}>
									<Ago date={new Date(BUILD_TIME)} />
								</time>
							</dd>
						</dl>
					</div>
				</div>
			</section>
			<ReactionsHelp />
		</main>
	)
}
