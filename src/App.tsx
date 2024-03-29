import Router, { Route } from 'preact-router'
import { Provider as AuthProvider, useAuth } from '#context/Auth.js'
import { Provider as ProjectsProvider } from '#context/Projects.js'
import { Provider as SettingsProvider } from '#context/Settings.js'
import { Provider as StatusProvider } from '#context/Status.js'
import { Provider as SyncsProvider } from '#context/Syncs.js'
import { Dashboard } from '#views/Dashboard.js'
import { CreateStatus } from '#views/CreateStatus.js'
import { CreateOrganization } from '#views/CreateOrganization.js'
import { CreateProject } from '#views/CreateProject.js'
import { CreateSync } from '#views/CreateSync.js'
import { EditStatus } from '#views/EditStatus.js'
import { InviteToProject } from '#views/InviteToProject.js'
import { Project } from '#views/Project.js'
import { PersonalizeProjects } from '#views/PersonalizeProjects.js'
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
import { UserProfile } from '#views/UserProfile.js'
import { Provider as UserProfilesProvider } from '#context/UserProfiles.js'
import { EditUser } from '#views/EditUser.js'
import { SyncExportTeams } from '#views/SyncExportTeams.js'
import { SyncExportConfluence } from '#views/SyncExportConfluence.js'
import { Provider as OpenmojiProvider } from '#context/Openmoji.js'

export const App = () => (
	<AuthProvider>
		<OpenmojiProvider>
			<Routing />
		</OpenmojiProvider>
	</AuthProvider>
)

export const Routing = () => {
	const { user } = useAuth()

	if (user !== undefined) {
		return (
			<UserProfilesProvider>
				<ProjectsProvider>
					<SettingsProvider>
						<StatusProvider>
							<SyncsProvider>
								<UIProvider>
									<Router>
										<Route path="/" component={Dashboard} />
										<Route path="/login" component={LoginRedirect} />
										<Route path="/help" component={Help} />
										<Route
											path="/personalize-projects"
											component={PersonalizeProjects}
										/>
										<Route path="/sync/create" component={CreateSync} />
										<Route path="/sync/:id" component={Sync} />
										<Route
											path="/sync/:id/export/teams"
											component={SyncExportTeams}
										/>
										<Route
											path="/sync/:id/export/confluence"
											component={SyncExportConfluence}
										/>
										<Route path="/syncs" component={Syncs} />
										<Route path="/project/create" component={CreateProject} />
										<Route
											path="/organization/create"
											component={CreateOrganization}
										/>
										<Route path="/organizations" component={Organizations} />
										<Route path="/organization/:id" component={Organization} />
										<Route path="/project/:id" component={Project} />
										<Route
											path="/project/:id/status/create"
											component={CreateStatus}
										/>
										<Route
											path="/project/:projectId/status/:statusId"
											component={Status}
										/>
										<Route
											path="/project/:projectId/status/:statusId/edit"
											component={EditStatus}
										/>

										<Route
											path="/project/:id/invite"
											component={InviteToProject}
										/>
										<Route
											path="/project/:id/settings"
											component={ProjectSettings}
										/>
										<Route path="/user" component={User} />
										<Route path="/user/edit" component={EditUser} />
										<Route path="/user/:id" component={UserProfile} />
										<Route path="/reactions" component={Reactions} />
									</Router>
								</UIProvider>
							</SyncsProvider>
						</StatusProvider>
					</SettingsProvider>
				</ProjectsProvider>
			</UserProfilesProvider>
		)
	}

	return (
		<Router>
			<Route path="/" component={Home} />
			<Route path="/login" component={Login} />
			<Route path="/help" component={Help} />
			<Route path="/sync/:id" component={PublicSync} />
			<Route path="/organization/create" component={LoginRedirect} />
		</Router>
	)
}
