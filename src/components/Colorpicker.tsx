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
		<div class="ps-0">
			<label class="d-flex align-items-center justify-content-start">
				Pick your color:
				<input
					type="color"
					class="mx-1 my-1"
					style={{
						height: '32px',
						width: '32px',
						padding: 0,
						border: 0,
						borderRadius: '25%',
					}}
					value={customColor}
					onInput={(e) => setCustomColor((e.target as HTMLInputElement).value)}
				/>
				<button
					type="button"
					class="btn btn-sm btn-outline-secondary"
					onClick={() => {
						onColor(customColor)
					}}
				>
					OK
				</button>
			</label>
			<div>
				{colors
					.sort((a, b) => parseInt(a.slice(1), 16) - parseInt(b.slice(1), 16))
					.map((color) => (
						<button
							type="button"
							class="btn px-3 py-3 mx-1 my-1"
							style={{ backgroundColor: color }}
							onClick={() => {
								onColor(color)
							}}
						></button>
					))}
			</div>
		</div>
	)
}
