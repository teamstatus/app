// Compile the openmoji data into a more slimline format

import openmojiData from './node_modules/openmoji/data/openmoji.json'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const openMojiIcons = (
	openmojiData as {
		emoji: string // e.g. "😀",
		hexcode: string // e.g. "1F600",
		group: string // e.g. "smileys-emotion",
		subgroups: string // e.g. "face-smiling",
		annotation: string // e.g. "grinning face",
		tags: string // e.g. "face, grin",
		openmoji_tags: string // e.g. "smile, happy",
		openmoji_author: string // e.g. "Emily Jäger",
		openmoji_date: string // e.g. "2018-04-18",
		skintone: string // e.g. "",
		skintone_combination: string // e.g. "",
		skintone_base_emoji: string // e.g. "",
		skintone_base_hexcode: string // e.g. "",
		unicode: number // e.g. 1,
		order: number // e.g. 1
	}[]
)
	.sort(({ order: o1 }, { order: o2 }) => o2 - o1)
	.map(
		({
			emoji, //  '😀',
			hexcode, //  '1F600',
			annotation, //  'grinning face',
			tags, //  'face, grin',
		}) => ({
			emoji,
			search: `${annotation}${tags.length > 0 ? ` (${tags})` : ''}`,
			hexcode,
		}),
	)

try {
	await mkdir(path.join(process.cwd(), 'static', 'openmoji'))
} catch {
	// pass
}

try {
	await mkdir(path.join(process.cwd(), 'src', 'openmoji'))
} catch {
	// pass
}

for (const { hexcode } of openMojiIcons) {
	const svgColor = (
		await readFile(
			path.join(
				process.cwd(),
				'node_modules',
				'openmoji',
				'color',
				'svg',
				`${hexcode}.svg`,
			),
			'utf-8',
		)
	)
		.replace('id="emoji"', 'class="openmoji"')
		.replace(/id="[^"]+"/g, '')
		.replace(/[a-z]+:[a-z]+="[^"]+"/gi, '')

	await writeFile(
		path.join('static', 'openmoji', `${hexcode}.svg`),
		svgColor,
		'utf-8',
	)
}

await writeFile(
	path.join(process.cwd(), 'static', 'openmoji', 'list.json'),
	JSON.stringify(
		openMojiIcons.map(({ hexcode, search, emoji }) => [hexcode, search, emoji]),
	),
	'utf-8',
)
