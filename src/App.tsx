import Router, { Route } from 'preact-router'
import { Provider as AuthProvider, useAuth } from '#context/Auth.js'
import { Provider as ProjectsProvider } from '#context/Projects.js'
import { Provider as SettingsProvider } from '#context/Settings.js'
import { Provider as StatusProvider } from '#context/Status.js'
import { Provider as SyncsProvider } from '#context/Syncs.js'
import { Dashboard } from '#views/Dashboard.js'
import { ComposeStatus } from '#views/ComposeStatus.js'
import { CreateOrganization } from '#views/CreateOrganization.js'
import { CreateProject } from '#views/CreateProject.js'
import { CreateSync } from '#views/CreateSync.js'
import { EditStatus } from '#views/EditStatus.js'
import { InviteToProject } from '#views/InviteToProject.js'
import { Project } from '#views/Project.js'
import { Projects } from '#views/Projects.js'
import { Sync } from '#views/Sync.js'
import { Syncs } from '#views/Syncs.js'
import { User } from '#views/User.js'
import { Sync as PublicSync } from '#views/public/Sync.js'
import { Provider as UIProvider } from '#context/UI.js'
import { Help } from '#views/public/Help.js'
import { Home } from '#views/public/Home.js'
import { Login } from '#views/public/Login.js'
import { LoginRedirect } from '#views/LoginRedirect.js'
import { Reactions } from '#views/Reactions.js'
import { Organizations } from '#views/Organizations.js'
import { Organization } from '#views/Organization.js'
import { Status } from '#views/Status.js'
import { ProjectSettings } from '#views/ProjectSettings.js'

export const App = () => (
	<AuthProvider>
		<ProjectsProvider>
			<SettingsProvider>
				<StatusProvider>
					<SyncsProvider>
						<UIProvider>
							<Routing />
						</UIProvider>
					</SyncsProvider>
				</StatusProvider>
			</SettingsProvider>
		</ProjectsProvider>
	</AuthProvider>
)

export const Routing = () => {
	const { user } = useAuth()

	if (user !== undefined) {
		return (
			<>
				<Router>
					<Route path="/" component={Dashboard} />
					<Route path="/login" component={LoginRedirect} />
					<Route path="/help" component={Help} />
					<Route path="/projects" component={Projects} />
					<Route path="/sync/create" component={CreateSync} />
					<Route path="/sync/:id" component={Sync} />
					<Route path="/syncs" component={Syncs} />
					<Route path="/project/create" component={CreateProject} />
					<Route path="/organization/create" component={CreateOrganization} />
					<Route path="/organizations" component={Organizations} />
					<Route path="/organization/:id" component={Organization} />
					<Route path="/project/:id" component={Project} />
					<Route
						path="/project/:projectId/status/:statusId"
						component={Status}
					/>
					<Route
						path="/project/:projectId/status/:statusId/edit"
						component={EditStatus}
					/>
					<Route path="/project/:id/compose" component={ComposeStatus} />
					<Route path="/project/:id/invite" component={InviteToProject} />
					<Route path="/project/:id/settings" component={ProjectSettings} />
					<Route path="/user" component={User} />
					<Route path="/reactions" component={Reactions} />
				</Router>
			</>
		)
	}
	return (
		<>
			<Router>
				<Route path="/" component={Home} />
				<Route path="/login" component={Login} />
				<Route path="/help" component={Help} />
				<Route path="/sync/:id" component={PublicSync} />
			</Router>
		</>
	)
}
