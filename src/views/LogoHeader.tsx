import { useEffect, useState } from 'preact/hooks'
import { logoColors } from '../components/Colorpicker.js'

export const LogoHeader = () => {
	const [offset, setOffset] = useState<number>(logoColors.length - 1)
	useEffect(() => {
		const i = setInterval(() => {
			setOffset((i) => (i - 1 > 0 ? i - 1 : logoColors.length - 1))
		}, 60)
		return () => {
			clearInterval(i)
		}
	}, [])

	const colorAtIndex = (i: number) =>
		logoColors[(i + offset) % logoColors.length]
	return (
		<header class="bg-dark">
			<div class="container">
				<div class="d-flex align-items-center pt-2 pb-2 pt-md-4 pb-md-4">
					<h1 class="fs-4 fw-bold m-0">
						<img
							src="/static/heart.svg"
							alt="❤️ teamstatus"
							width="25"
							height="25"
							class="me-2"
						/>
						{'teamstatus.space'.split('').map((s, i) => (
							<span style={{ color: colorAtIndex(i) }}>{s}</span>
						))}
					</h1>
				</div>
			</div>
		</header>
	)
}
