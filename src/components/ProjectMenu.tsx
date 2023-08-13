import { useSettings } from '#context/Settings.js'
import { CloseIcon, ProjectsIcon, AddIcon, SubMenuIcon } from './Icons.js'
import { useUI } from '#context/UI.js'
import { SettingsIcon } from 'lucide-preact'
import { gradient, logoColors } from './Colorpicker.js'
import { type VNode } from 'preact'
import { useState } from 'preact/hooks'
import { OpenmojiIcon } from './OpenmojiIcon.js'
import { colorStyle } from '../util/colorStyle.js'

type Action = {
	href: string
	color?: string
	disabled?: boolean
	icon?: VNode<any>
	secondary?: boolean
}

export const ProjectMenu = ({ actions }: { actions?: Action[] }) => {
	const { visibleProjects } = useSettings()
	const { projectsMenuVisible, showProjectsMenu } = useUI()
	const [showSecondaryActions, setShowSecondaryActions] =
		useState<boolean>(false)

	const primaryActions = (actions ?? []).filter(
		({ secondary }) => secondary !== true,
	)
	const secondaryActions = (actions ?? []).filter(
		({ secondary }) => secondary === true,
	)

	return (
		<nav
			class="d-flex flex-column align-items-end p-2"
			style={{
				position: 'fixed',
				bottom: '0',
				right: '0',
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
								class="mb-1 d-flex align-items-center text-decoration-none text-dark"
								onClick={() => showProjectsMenu(false)}
							>
								<span
									style={{
										...colorStyle(color),
										boxShadow: '0 0 8px 0 #00000075',
										borderRadius: '15px',
									}}
									class="px-3 py-1 me-1"
								>
									<small class="me-2 opacity-75">
										{project.organizationId}
									</small>
									{alias ?? project?.name ?? project.id}
								</span>

								<span
									class="d-flex align-items-center justify-content-center flex-shrink-0"
									style={{
										...colorStyle(color),
										borderRadius: '100%',
										display: 'block',
										height: '40px',
										width: '40px',
										marginRight: '4px',
										boxShadow: '0 0 8px 0 #00000075',
									}}
								>
									{icon === undefined && (
										<img
											src="/static/heart.svg"
											alt="❤️ teamstatus"
											width="20"
											height="20"
										/>
									)}
									{icon !== undefined && (
										<OpenmojiIcon
											emoji={icon}
											title={project.name ?? project.id}
											width={30}
											height={30}
										/>
									)}
								</span>
							</a>
						</div>
					),
				)}
			{!projectsMenuVisible && (
				<>
					{secondaryActions.length > 0 && (
						<>
							{!showSecondaryActions && (
								<button
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
									onClick={() => setShowSecondaryActions(true)}
								>
									<SubMenuIcon />
								</button>
							)}
							{showSecondaryActions && (
								<>
									{secondaryActions.map((action) => (
										<ActionButton
											action={action}
											onClick={() => showProjectsMenu(false)}
										/>
									))}
									<CloseButton
										onClick={() => setShowSecondaryActions(false)}
										class="mb-2"
									/>
								</>
							)}
						</>
					)}
					{primaryActions.map((action) => (
						<ActionButton
							action={action}
							onClick={() => showProjectsMenu(false)}
						/>
					))}
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
						href={`/personalize-projects`}
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
					<CloseButton onClick={() => showProjectsMenu(false)} />
				</div>
			)}
		</nav>
	)
}

const CloseButton = ({
	onClick,
	class: c,
}: {
	onClick: () => unknown
	class?: string
}) => (
	<button
		onClick={onClick}
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
		class={`d-flex align-items-center justify-content-center ${c}`}
	>
		<CloseIcon />
	</button>
)

const ActionButton = ({
	action,
	onClick,
}: {
	action: Action
	onClick: () => unknown
}) => {
	if (action.disabled === true)
		return (
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
				{action.icon ?? <AddIcon />}
			</button>
		)
	return (
		<a
			href={action.href}
			onClick={onClick}
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
			{action.icon ?? <AddIcon />}
		</a>
	)
}
