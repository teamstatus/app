import Color from 'color'
import { LogOut, MoreHorizontal, Sprout, User, X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useAuth } from '../context/Auth.js'
import { useSettings } from '../context/Settings.js'

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
							{visibleProjects.map((id) => {
								const { color, name } = getProjectPersonalization(id)
								return (
									<div class="d-flex flex-column align-items-center">
										<a
											href={`/project/${encodeURIComponent(id)}`}
											class="btn"
											style={{
												color: new Color(color).negate().hex(),
												backgroundColor: color,
											}}
										>
											{name}
										</a>
									</div>
								)
							})}
							<div class="d-flex flex-column align-items-center">
								<button
									type="button"
									class="btn btn-outline-light"
									onClick={() => setSettingsVisible((v) => !v)}
								>
									<MoreHorizontal />
								</button>
							</div>
						</>
					)}
					{settingsVisible && (
						<>
							<div class="d-flex flex-column align-items-center">
								<a href="/projects" class="btn btn-success">
									<Sprout />
								</a>
							</div>
							<div class="d-flex flex-column align-items-center">
								<a href="/user" class="btn btn-secondary">
									<User />
								</a>
							</div>
							<div class="d-flex flex-column align-items-center">
								<button
									type="button"
									class="btn btn-outline-danger"
									onClick={() => logout()}
								>
									<LogOut />
								</button>
							</div>
							<div class="d-flex flex-column align-items-center">
								<button
									type="button"
									class="btn btn-outline-light"
									onClick={() => setSettingsVisible((v) => !v)}
								>
									<X />
								</button>
							</div>
						</>
					)}
				</>
			)}
		</footer>
	)
}
