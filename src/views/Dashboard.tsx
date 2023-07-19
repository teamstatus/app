import { useEffect } from 'preact/hooks'
import { SelectID } from '../components/SelectID.js'
import { useAuth } from '../context/Auth.js'
import { LogoHeader } from '../components/LogoHeader.js'
import { route } from 'preact-router'
import { ProjectMenu } from '../components/ProjectMenu.js'
import { Main } from '../components/Main.js'

export const Dashboard = ({ redirect }: { redirect?: string }) => {
	const { user } = useAuth()

	useEffect(() => {
		if (redirect === undefined) return
		console.debug(`Redirecting to`, redirect)
		route(redirect)
	}, [redirect])

	return (
		<>
			<LogoHeader animated />
			<Main class="container">
				{user?.id === undefined && <SelectID />}
				<section>
					<div class="row mt-3">
						<div class="col-12 col-md-8 offset-md-2">
							<p>Welcome {user?.id ?? user?.email ?? 'anonymous'}!</p>
						</div>
					</div>
				</section>
			</Main>
			<ProjectMenu />
		</>
	)
}
