import { readFile } from 'node:fs/promises'

const emojis = await readFile('./emoji-sequences.txt', 'utf-8')

const isSequence = (emoji: string[]) => emoji[0]?.includes('..') ?? false

for (const emoji of emojis
	.split('\n')
	.filter((s) => !s.startsWith('#'))
	.filter((s) => s.length > 0)
	.map((s) => s.replace(/#.+/, ''))
	.map((s) => s.split(';').map((s) => s.trim()))) {
	if (isSequence(emoji)) continue
	const codePoints = emoji[0]?.split(' ') ?? []
	console.log(
		codePoints
			.slice(0, 2)
			.map((s) => String.fromCharCode(parseInt(`0x${s}`, 16)))
			.join(''),
		emoji[2],
	)
}
