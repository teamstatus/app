import Color from 'color'
import { useSettings } from '../context/Settings.js'
import { useState } from 'preact/hooks'
import { CloseIcon, ProjectsIcon, AddIcon } from './Icons.js'
import { useProjects } from '../context/Projects.js'

export const ProjectMenu = ({
	action,
}: {
	action?: {
		href: string
		color?: string
	}
}) => {
	const { projects } = useProjects()
	const { getProjectPersonalization, visibleProjects } = useSettings()
	const [projectsVisible, showProjects] = useState<boolean>(false)

	return (
		<nav
			class="d-flex flex-column align-items-end"
			style={{
				position: 'fixed',
				bottom: '1rem',
				right: '1rem',
			}}
		>
			{projectsVisible && (
				<a
					href={`/projects`}
					style={{
						borderRadius: '100%',
						color: 'white',
						backgroundColor: '#212529',
						display: 'block',
						height: '48px',
						width: '48px',
						boxShadow: '0 0 8px 0 #00000075',
					}}
					class="d-flex align-items-center justify-content-center mb-2"
					onClick={() => showProjects((s) => !s)}
				>
					<ProjectsIcon />
				</a>
			)}
			{projectsVisible &&
				visibleProjects().length > 0 &&
				visibleProjects().map((id) => {
					const project = projects[id]
					const { color, icon, alias } = getProjectPersonalization(id)
					return (
						<div class="d-flex flex-column align-items-center">
							<a
								href={`/project/${encodeURIComponent(id)}`}
								class="mb-2 d-flex align-items-center text-decoration-none text-dark"
							>
								<span
									style={{
										background: '#fff',
										boxShadow: '0 0 8px 0 #00000075',
										borderRadius: '10px',
									}}
									class="px-2 py-1 me-2"
								>
									{alias ?? project?.name ?? id}
								</span>
								{icon === undefined && (
									<span
										class="d-flex align-items-center justify-content-center"
										style={{
											color:
												new Color(color ?? '#212529').luminosity() > 0.5
													? 'black'
													: 'white',
											backgroundColor: color ?? '#212529',
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
											color:
												new Color(color ?? '#212529').luminosity() > 0.5
													? 'black'
													: 'white',
											backgroundColor: color ?? '#212529',
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
					)
				})}
			{!projectsVisible && (
				<>
					{action !== undefined && (
						<a
							href={action.href}
							style={{
								borderRadius: '100%',
								color:
									new Color(action.color ?? '#198754').luminosity() > 0.5
										? 'black'
										: 'white',
								backgroundColor: action.color ?? '#198754',
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
					<button
						onClick={() => showProjects((s) => !s)}
						style={{
							borderRadius: '100%',
							color: 'white',
							backgroundColor: '#212529',
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
			{projectsVisible && (
				<button
					onClick={() => showProjects((s) => !s)}
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
			)}
		</nav>
	)
}
