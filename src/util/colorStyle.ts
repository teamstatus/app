import Color from 'color'

export const colorStyle = (
	color?: string,
): {
	color: string
	backgroundColor: string
} => ({
	color: new Color(color ?? '#212529').luminosity() > 0.5 ? 'black' : 'white',
	backgroundColor: new Color(color ?? '#212529').hex(),
})
