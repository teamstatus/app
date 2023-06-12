import { Ago } from '../components/Ago.js'
import { colors } from '../components/Colorpicker.js'
import { ReactionsHelp } from '../components/ReactionsHelp.js'
import { SelectID } from '../components/SelectID.js'
import { useAuth } from '../context/Auth.js'
import { LogoHeader } from './LogoHeader.js'

export const About = () => {
	const { user } = useAuth()
	return (
		<>
			<LogoHeader />
			<main class="container">
				<section>
					<div class="row mt-3">
						<div class="col-12 col-md-6 offset-md-3">
							<p>Welcome {user?.id ?? user?.email ?? 'anonymous'}!</p>
						</div>
					</div>
				</section>
				{user?.id !== undefined && <ReactionsHelp />}
				{user?.id === undefined && <SelectID />}
				<div class="row">
					<div class="col-12 col-md-6 offset-md-3">
						<aside class="clearfix mt-3">
							<h2>Colors</h2>
							{colors.map((color) => (
								<div
									style={{
										backgroundColor: color,
										width: '32px',
										height: '32px',
										borderRadius: '25%',
										display: 'block',
										float: 'left',
										margin: '0.1rem',
									}}
								></div>
							))}
						</aside>
					</div>
				</div>

				<aside class="row mt-3">
					<div class="col-12 col-md-6 offset-md-3">
						<h2>About</h2>
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
				</aside>
			</main>
		</>
	)
}