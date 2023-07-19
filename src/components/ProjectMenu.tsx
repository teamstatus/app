import Color from 'color'
import { useSettings } from '../context/Settings.js'
import { CloseIcon, ProjectsIcon, AddIcon } from './Icons.js'
import { useUI } from '../context/UI.js'
import { SettingsIcon } from 'lucide-preact'
import { gradient, logoColors } from './Colorpicker.js'

const colorStyle = (color?: string) => ({
	color: new Color(color ?? '#212529').luminosity() > 0.5 ? 'black' : 'white',
	backgroundColor: color ?? '#212529',
})

export const ProjectMenu = ({
	action,
}: {
	action?: {
		href: string
		color?: string
		disabled?: boolean
	}
}) => {
	const { visibleProjects } = useSettings()
	const { projectsMenuVisible, showProjectsMenu } = useUI()

	return (
		<nav
			class="d-flex flex-column align-items-end"
			style={{
				position: 'fixed',
				bottom: '1rem',
				right: '1rem',
				zIndex: 1000,
			}}
		>
			{projectsMenuVisible &&
				visibleProjects.length > 0 &&
				visibleProjects.map(
					({ project, personalization: { color, icon, alias } }) => (
						<div class="d-flex flex-column align-items-center">
							<a
								href={`/project/${encodeURIComponent(project.id)}`}
								class="mb-2 d-flex align-items-center text-decoration-none text-dark"
								onClick={() => showProjectsMenu(false)}
							>
								<span
									style={{
										...colorStyle(color),
										boxShadow: '0 0 8px 0 #00000075',
										borderRadius: '15px',
									}}
									class="px-3 py-1 me-2"
								>
									{alias ?? project?.name ?? project.id}
								</span>
								{icon === undefined && (
									<span
										class="d-flex align-items-center justify-content-center"
										style={{
											...colorStyle(color),
											borderRadius: '100%',
											display: 'block',
											height: '48px',
											width: '48px',
											boxShadow: '0 0 8px 0 #00000075',
										}}
									>
										<img
											src="/static/heart.svg"
											alt="❤️ teamstatus"
											width="20"
											height="20"
										/>
									</span>
								)}
								{icon !== undefined && (
									<span
										class="d-flex align-items-center justify-content-center"
										style={{
											borderRadius: '100%',
											...colorStyle(color),
											display: 'block',
											height: '48px',
											width: '48px',
											boxShadow: '0 0 8px 0 #00000075',
										}}
									>
										{icon}
									</span>
								)}
							</a>
						</div>
					),
				)}
			{!projectsMenuVisible && (
				<>
					{action !== undefined && (action.disabled ?? false) === false && (
						<a
							href={action.href}
							onClick={() => showProjectsMenu(false)}
							style={{
								borderRadius: '100%',
								...colorStyle(action.color),
								display: 'block',
								height: '48px',
								width: '48px',
								boxShadow: '0 0 8px 0 #00000075',
							}}
							class="d-flex align-items-center justify-content-center mb-2"
						>
							<AddIcon />
						</a>
					)}
					{action !== undefined && (action.disabled ?? false) === true && (
						<button
							disabled
							class="btn d-flex align-items-center justify-content-center mb-2"
							style={{
								border: 0,
								borderRadius: '100%',
								color: 'black',
								backgroundColor: '#999',
								display: 'block',
								height: '48px',
								width: '48px',
								boxShadow: '0 0 8px 0 #00000075',
							}}
						>
							<AddIcon />
						</button>
					)}
					<button
						onClick={() => showProjectsMenu(true)}
						style={{
							borderRadius: '100%',
							color: 'black',
							backgroundColor: '#212529',
							background: gradient(logoColors),
							display: 'block',
							height: '48px',
							width: '48px',
							boxShadow: '0 0 8px 0 #00000075',
							border: '0',
						}}
						class="d-flex align-items-center justify-content-center"
					>
						<ProjectsIcon />
					</button>
				</>
			)}
			{projectsMenuVisible && (
				<div class="d-flex">
					<a
						href={`/projects`}
						style={{
							borderRadius: '100%',
							color: 'black',
							backgroundColor: '#ffc107',
							display: 'block',
							height: '48px',
							width: '48px',
							boxShadow: '0 0 8px 0 #00000075',
						}}
						class="d-flex align-items-center justify-content-center me-2"
						onClick={() => showProjectsMenu(false)}
					>
						<SettingsIcon strokeWidth={1} />
					</a>
					<button
						onClick={() => showProjectsMenu(false)}
						style={{
							borderRadius: '100%',
							color: 'white',
							backgroundColor: '#999',
							display: 'block',
							height: '48px',
							width: '48px',
							boxShadow: '0 0 8px 0 #00000075',
							border: '0',
						}}
						class="d-flex align-items-center justify-content-center"
					>
						<CloseIcon />
					</button>
				</div>
			)}
		</nav>
	)
}
