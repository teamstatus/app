import { useEffect, useState } from 'preact/hooks'
import { logoColors } from '#components/Colorpicker.js'

export const AnimatedLogo = ({ animated }: { animated?: boolean }) => {
	const [enableAnimation, setEnableAnimation] = useState<boolean>(
		animated ?? false,
	)
	const [offset, setOffset] = useState<number>(logoColors.length - 1)
	useEffect(() => {
		if (!enableAnimation) return
		const i = setInterval(() => {
			setOffset((i) => (i - 1 > 0 ? i - 1 : logoColors.length - 1))
		}, 60)
		return () => {
			clearInterval(i)
		}
	}, [enableAnimation])

	const colorAtIndex = (i: number) =>
		logoColors[(i + offset) % logoColors.length]
	return (
		<h1
			class="fs-4 fw-bold m-0"
			onClick={() => {
				setEnableAnimation((enabled) => !enabled)
			}}
			style={{ userSelect: 'none' }}
		>
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
	)
}
