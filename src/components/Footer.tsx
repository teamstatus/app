import Color from 'color'
import { useState } from 'preact/hooks'
import { useAuth } from '../context/Auth.js'
import { useSettings } from '../context/Settings.js'
import {
	CloseIcon,
	HelpIcon,
	LogoutIcon,
	ProjectsIcon,
	SubMenuIcon,
	SyncIcon,
	SyncsIcon,
	UserIcon,
} from './Icons.js'
import { LogInIcon } from 'lucide-preact'

export const Footer = () => {
	const { user, logout } = useAuth()
	const { getProjectPersonalization, visibleProjects } = useSettings()
	const [settingsVisible, setSettingsVisible] = useState(false)

	const hideSettings = () => setSettingsVisible(false)

	return (
		<footer
			class="fixed-bottom bg-dark text-white container-fluid d-flex align-items-center justify-content-between px-2 py-2"
			style={{
				overflowY: 'hidden',
				overflowX: 'scroll',
			}}
		>
			{user && (
				<>
					{!settingsVisible && (
						<>
							{visibleProjects().length > 0 && (
								<div class="d-flex align-items-center">
									{visibleProjects().map((id) => {
										const { color, name } = getProjectPersonalization(id)
										return (
											<div class="d-flex flex-column align-items-center me-2">
												<a
													href={`/project/${encodeURIComponent(id)}`}
													class="btn"
													style={{
														color:
															new Color(color).luminosity() > 0.5
																? 'black'
																: 'white',
														backgroundColor: color,
													}}
												>
													{name}
												</a>
											</div>
										)
									})}
								</div>
							)}

							<div class="d-flex flex-column align-items-center">
								<button
									type="button"
									class="btn btn-outline-light"
									onClick={() => setSettingsVisible((v) => !v)}
								>
									<SubMenuIcon />
								</button>
							</div>
						</>
					)}
					{settingsVisible && (
						<>
							{user.id !== undefined && (
								<>
									<div class="d-flex flex-row align-items-center">
										<a
											href="/projects"
											class="btn btn-success me-2"
											onClick={hideSettings}
										>
											<ProjectsIcon />
										</a>
										<a
											href="/sync/create"
											onClick={hideSettings}
											class="btn btn-primary me-2"
										>
											<SyncIcon />
										</a>
										<a
											href="/syncs"
											onClick={hideSettings}
											class="btn btn-secondary"
										>
											<SyncsIcon />
										</a>
									</div>
								</>
							)}
							<div class="d-flex flex-row align-items-center">
								<a
									href="/"
									onClick={hideSettings}
									class="btn btn-secondary me-2"
								>
									<HelpIcon />
								</a>
								<a
									href="/user"
									onClick={hideSettings}
									class="btn btn-secondary me-2"
								>
									<UserIcon />
								</a>
								<button
									type="button"
									class="btn btn-outline-danger me-2"
									onClick={() => logout()}
								>
									<LogoutIcon />
								</button>
								<button
									type="button"
									class="btn btn-outline-light"
									onClick={() => setSettingsVisible((v) => !v)}
								>
									<CloseIcon />
								</button>
							</div>
						</>
					)}
				</>
			)}
			{!user && (
				<>
					<div />
					<div>
						<a href="/login" class="btn btn-primary me-2">
							<LogInIcon />
							<span class="ms-2">Log in</span>
						</a>
					</div>
				</>
			)}
		</footer>
	)
}
