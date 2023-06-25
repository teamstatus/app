import Router, { Route } from 'preact-router'
import { Footer } from './components/Footer.js'
import { useAuth } from './context/Auth.js'
import { Provider as ProjectsProvider } from './context/Projects.js'
import { Provider as SettingsProvider } from './context/Settings.js'
import { Provider as StatusProvider } from './context/Status.js'
import { Provider as SyncsProvider } from './context/Syncs.js'
import { About } from './views/About.js'
import { ComposeStatus } from './views/ComposeStatus.js'
import { CreateOrganization } from './views/CreateOrganization.js'
import { CreateProject } from './views/CreateProject.js'
import { CreateSync } from './views/CreateSync.js'
import { EditStatus } from './views/EditStatus.js'
import { InviteToProject } from './views/InviteToProject.js'
import { Login } from './views/Login.js'
import { Project } from './views/Project.js'
import { Projects } from './views/Projects.js'
import { Syncs } from './views/Syncs.js'
import { User } from './views/User.js'

export const App = () => {
	const { loggedIn } = useAuth()

	if (loggedIn)
		return (
			<ProjectsProvider>
				<SettingsProvider>
					<StatusProvider>
						<SyncsProvider>
							<Router>
								<Route path="/" component={About} />
								<Route path="/projects" component={Projects} />
								<Route path="/sync/create" component={CreateSync} />
								<Route path="/syncs" component={Syncs} />
								<Route path="/project/create" component={CreateProject} />
								<Route
									path="/organization/create"
									component={CreateOrganization}
								/>
								<Route path="/project/:id" component={Project} />
								<Route path="/project/:id/compose" component={ComposeStatus} />
								<Route path="/project/:id/invite" component={InviteToProject} />
								<Route path="/user" component={User} />
								<Route path="/status/:id/edit" component={EditStatus} />
							</Router>
						</SyncsProvider>
					</StatusProvider>
					<Footer />
				</SettingsProvider>
			</ProjectsProvider>
		)
	return <Login />
}
