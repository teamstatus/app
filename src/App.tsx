import Router, { Route } from 'preact-router'
import { Provider as AuthProvider, useAuth } from '#context/Auth.tsx'
import { Provider as ProjectsProvider } from '#context/Projects.tsx'
import { Provider as SettingsProvider } from '#context/Settings.tsx'
import { Provider as StatusProvider } from '#context/Status.tsx'
import { Provider as SyncsProvider } from '#context/Syncs.tsx'
import { Dashboard } from '#views/Dashboard.tsx'
import { CreateStatus } from '#views/CreateStatus.tsx'
import { CreateOrganization } from '#views/CreateOrganization.tsx'
import { CreateProject } from '#views/CreateProject.tsx'
import { CreateSync } from '#views/CreateSync.tsx'
import { EditStatus } from '#views/EditStatus.tsx'
import { InviteToProject } from '#views/InviteToProject.tsx'
import { Project } from '#views/Project.tsx'
import { PersonalizeProjects } from '#views/PersonalizeProjects.tsx'
import { Sync } from '#views/Sync.tsx'
import { Syncs } from '#views/Syncs.tsx'
import { User } from '#views/User.tsx'
import { Sync as PublicSync } from '#views/public/Sync.tsx'
import { Provider as UiProvider } from '#context/UI.tsx'
import { Help } from '#views/public/Help.tsx'
import { Home } from '#views/public/Home.tsx'
import { Login } from '#views/public/Login.tsx'
import { LoginRedirect } from '#views/LoginRedirect.tsx'
import { Reactions } from '#views/Reactions.tsx'
import { Organizations } from '#views/Organizations.tsx'
import { Organization } from '#views/Organization.tsx'
import { Status } from '#views/Status.tsx'
import { ProjectSettings } from '#views/ProjectSettings.tsx'
import { UserProfile } from '#views/UserProfile.tsx'
import { Provider as UserProfilesProvider } from '#context/UserProfiles.tsx'
import { EditUser } from '#views/EditUser.tsx'
import { SyncExportTeams } from '#views/SyncExportTeams.tsx'
import { SyncExportConfluence } from '#views/SyncExportConfluence.tsx'
import { Provider as OpenmojiProvider } from '#context/Openmoji.tsx'

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
								<UiProvider>
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
								</UiProvider>
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
