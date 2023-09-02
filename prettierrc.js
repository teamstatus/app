export default {
	printWidth: 80,
	endOfLine: 'lf',
	overrides: [
		{
			files: '*.md',
			options: {
				parser: 'markdown',
				proseWrap: 'always',
			},
		},
		{
			files: '*.{yml,yaml}',
			options: {
				parser: 'yaml',
				proseWrap: 'always',
			},
		},
	],
}
