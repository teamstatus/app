import { AppNavigation } from './AppNavigation.js'

export const OffsetMenu = ({ onClick }: { onClick: () => unknown }) => (
	<div
		class="offcanvas offcanvas-end show"
		tabIndex={-1}
		id="offcanvasNavbar"
		aria-labelledby="offcanvasNavbarLabel"
	>
		<div class="offcanvas-header">
			<a
				href="/"
				class="btn btn-link text-body text-decoration-none heading-font"
			>
				<img
					src="/static/heart.svg"
					alt="❤️ teamstatus"
					width="25"
					height="25"
					class="me-2"
				/>{' '}
				<span
					style={{
						fontFamily: 'var(--headline-font)',
						fontWeight: 700,
					}}
				>
					teamstatus.space
				</span>
			</a>
			<button
				type="button"
				class="btn-close text-white"
				data-bs-dismiss="offcanvas"
				aria-label="Close"
				onClick={onClick}
			></button>
		</div>
		<div class="offcanvas-body">
			<AppNavigation onClick={onClick} />
		</div>
	</div>
)
