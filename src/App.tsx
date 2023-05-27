import Router, { Route } from 'preact-router'
import { Footer } from './components/Footer.js'
import { useAuth } from './context/Auth.js'
import { Provider as ProjectsProvider } from './context/Projects.js'
import { Provider as SettingsProvider } from './context/Settings.js'
import { Provider as StatusProvider } from './context/Status.js'
import { About } from './views/About.js'
import { ComposeStatus } from './views/ComposeStatus.js'
import { CreateProject } from './views/CreateProject.js'
import { Login } from './views/Login.js'
import { Project } from './views/Project.js'
import { Projects } from './views/Projects.js'
import { User } from './views/User.js'

export const App = () => {
	const { loggedIn } = useAuth()

	if (loggedIn)
		return (
			<ProjectsProvider>
				<SettingsProvider>
					<StatusProvider>
						<Router>
							<Route path="/" component={About} />
							<Route path="/projects" component={Projects} />
							<Route path="/project/create" component={CreateProject} />
							<Route path="/project/:id" component={Project} />
							<Route path="/project/:id/compose" component={ComposeStatus} />
							<Route path="/user" component={User} />
						</Router>
					</StatusProvider>
					<Footer />
				</SettingsProvider>
			</ProjectsProvider>
		)
	return <Login />
}
