// Compile the openmoji data into a more slimline format

import openmojiData from './node_modules/openmoji/data/openmoji.json'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const fixBadNames = (s: string): string =>
	s.replace(/^1st/, 'First').replace(/^2nd/, 'Second').replace(/^3rd/, 'Third')

const slugify = (s: string): string =>
	s
		.split(' ')
		.map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
		.map(fixBadNames)
		.join('')
		.replace(/[^a-z0-9]/gi, '')

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
			name: `${slugify(annotation)}`,
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

for (const { name, hexcode } of openMojiIcons) {
	const [svgBlack, svgColor] = (
		await Promise.all([
			await readFile(
				path.join(
					process.cwd(),
					'node_modules',
					'openmoji',
					'black',
					'svg',
					`${hexcode}.svg`,
				),
				'utf-8',
			),
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
			),
		])
	).map((s) =>
		s
			.replace('id="emoji"', 'class="openmoji"')
			.replace(/id="[^"]+"/g, '')
			.replace(/[a-z]+:[a-z]+="[^"]+"/gi, ''),
	) as [string, string]

	const svgWithcurrentColor = svgBlack.replace(/#0000*/g, 'currentColor')
	await Promise.all([
		writeFile(
			path.join('static', 'openmoji', `${hexcode}Black.svg`),
			svgBlack,
			'utf-8',
		),
		writeFile(
			path.join('static', 'openmoji', `${hexcode}.svg`),
			svgColor,
			'utf-8',
		),
		writeFile(
			path.join('src', 'openmoji', `${hexcode}.js`),
			[
				`export const ${name} = () => ${svgColor}`,
				`export const ${name}Black = () => ${svgWithcurrentColor}`,
			].join('\n'),
		),
	])
}

await writeFile(
	path.join(process.cwd(), 'static', 'openmoji', 'list.json'),
	JSON.stringify(
		openMojiIcons.map(({ hexcode, search, emoji, name }) => [
			hexcode,
			search,
			emoji,
			name,
		]),
	),
	'utf-8',
)

await writeFile(
	path.join(process.cwd(), 'src', 'openmoji', 'types.d.ts'),
	openMojiIcons
		.map(({ name, emoji, search, hexcode }) =>
			[
				`declare module '#openmoji/${hexcode}.js' {`,
				`/**`,
				` * ${emoji} (${search})`,
				` */`,
				`export function ${name}(): JSX.Element;`,
				`/**`,
				` * ${emoji} (${search}) Black`,
				` */`,
				`export function ${name}Black(): JSX.Element;`,
				`}`,
			].join('\n'),
		)
		.join('\n'),
	'utf-8',
)
