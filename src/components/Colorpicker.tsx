import { useState } from 'preact/hooks'

export const colors = [
	'#6a3d9a',
	'#666666',
	'#386cb0',
	'#984ea3',
	'#a65628',
	'#1f78b4',
	'#e31a1c',
	'#d53e4f',
	'#bf5b17',
	'#7570b3',
	'#377eb8',
	'#f0027f',
	'#a6761d',
	'#3288bd',
	'#d95f02',
	'#33a02c',
	'#bc80bd',
	'#f46d43',
	'#999999',
	'#4daf4a',
	'#ff7f00',
	'#fb8072',
	'#f781bf',
	'#80b1d3',
	'#66c2a5',
	'#fb9a99',
	'#e6ab02',
	'#beaed4',
	'#7fc97f',
	'#cab2d6',
	'#bebada',
	'#fdae61',
	'#fdb462',
	'#fbb4ae',
	'#8dd3c7',
	'#a6cee3',
	'#b3cde3',
	'#fdbf6f',
	'#fdc086',
	'#b3de69',
	'#abdda4',
	'#decbe4',
	'#b2df8a',
	'#d9d9d9',
	'#e5d8bd',
	'#fccde5',
	'#fed9a6',
	'#fee08b',
	'#ccebc5',
	'#fddaec',
	'#ffed6f',
	'#e6f598',
	'#f2f2f2',
	'#ffff33',
	'#ffffb3',
	'#ffffcc',
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
