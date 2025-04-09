import { useState } from 'preact/hooks'
import { MenuIcon } from './Icons.tsx'
import { OffsetMenu } from '#navigation/OffsetMenu.tsx'
import { AnimatedLogo } from '#navigation/AnimatedLogo.tsx'

export const LogoHeader = ({ animated }: { animated?: boolean }) => {
	const [collapsed, setCollapsed] = useState(true)

	return (
		<>
			<header class="bg-dark">
				<div class="container">
					<div class="d-flex align-items-center justify-content-between pt-2 pb-2 pt-md-4 pb-md-4">
						<AnimatedLogo animated={animated} />
						<button
							type="button"
							class="btn btn-outline-secondary btn-sm"
							onClick={() => setCollapsed((c) => !c)}
							data-testid="show-menu"
						>
							<MenuIcon />
						</button>
					</div>
				</div>
			</header>
			{!collapsed && <OffsetMenu onClick={() => setCollapsed((c) => !c)} />}
		</>
	)
}
