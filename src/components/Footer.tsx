import Color from 'color'
import { useState } from 'preact/hooks'
import { useAuth } from '../context/Auth.js'
import { useSettings } from '../context/Settings.js'
import {
	CloseIcon,
	HelpIcon,
	LogoutIcon,
	ProjectsIcon,
	ReportIcon,
	SubMenuIcon,
	UserIcon,
} from './Icons.js'

export const Footer = () => {
	const { user, logout } = useAuth()
	const { getProjectPersonalization, visibleProjects } = useSettings()
	const [settingsVisible, setSettingsVisible] = useState(false)

	return (
		<footer class="fixed-bottom bg-dark text-white container-fluid d-flex align-items-center justify-content-between px-2 py-2">
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
									<div class="d-flex flex-column align-items-center">
										<a href="/projects" class="btn btn-success">
											<ProjectsIcon />
										</a>
									</div>
									<div class="d-flex flex-column align-items-center">
										<a href="/report" class="btn btn-primary">
											<ReportIcon />
										</a>
									</div>
								</>
							)}
							<div class="d-flex flex-column align-items-center">
								<a href="/" class="btn btn-secondary">
									<HelpIcon />
								</a>
							</div>
							<div class="d-flex flex-column align-items-center">
								<a href="/user" class="btn btn-secondary">
									<UserIcon />
								</a>
							</div>
							<div class="d-flex flex-column align-items-center">
								<button
									type="button"
									class="btn btn-outline-danger"
									onClick={() => logout()}
								>
									<LogoutIcon />
								</button>
							</div>
							<div class="d-flex flex-column align-items-center">
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
		</footer>
	)
}
