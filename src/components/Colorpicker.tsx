import Color from 'color'
import { useState } from 'preact/hooks'

export const logoColors = [
	'#8b48fe',
	'#ca41fc',
	'#ff46fb',
	'#ff5400',
	'#ff8e00',
	'#ffd200',
	'#81e650',
	'#00d267',
	'#00c0ff',
]

export const gradient = (colors: string[]) =>
	`linear-gradient(135deg, ${colors
		.map(
			(color, i, colors) => `${color} ${i * Math.round(100 / colors.length)}%`,
		)
		.join(',')})`

export const colors = [
	...logoColors
		.map((color) => [
			new Color(color).darken(0.45).hex(),
			new Color(color).darken(0.3).hex(),
			new Color(color).darken(0.15).hex(),
			color,
			new Color(color).lighten(0.15).hex(),
			new Color(color).lighten(0.3).hex(),
			new Color(color).lighten(0.45).hex(),
		])
		.flat(),
	'#333',
	'#666',
	'#999',
	'#ccc',
]
export const Colorpicker = ({
	onColor,
	color,
}: {
	color: string
	onColor: (color: string) => void
}) => {
	const [customColor, setCustomColor] = useState(color)
	return (
		<div class="mt-2">
			<p class="mb-1">Pick a predefined color:</p>
			<div>
				{colors
					.sort((a, b) => parseInt(a.slice(1), 16) - parseInt(b.slice(1), 16))
					.map((color) => (
						<button
							type="button"
							class="btn btn-outline-secondary px-3 py-3 me-1 mb-1"
							style={{ backgroundColor: color }}
							onClick={() => {
								onColor(color)
							}}
						></button>
					))}
			</div>
			<div>
				<label htmlFor="customColor">or select a custom color:</label>
				<label class="d-flex align-items-center justify-content-start">
					<input
						type="color"
						class="me-1"
						style={{
							height: '38px',
							width: '38px',
							padding: 0,
							border: 0,
							borderRadius: '25%',
						}}
						value={customColor}
						onInput={(e) =>
							setCustomColor((e.target as HTMLInputElement).value)
						}
					/>
					<button
						type="button"
						class="btn btn-outline-secondary"
						onClick={() => {
							onColor(customColor)
						}}
					>
						OK
					</button>
				</label>
			</div>
		</div>
	)
}
