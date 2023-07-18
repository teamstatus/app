export const orderIds = (
	ids: string[],
	id: string,
	direction: 'up' | 'down',
): string[] => {
	const idx = ids.indexOf(id)
	if (direction === 'down') {
		if (idx === ids.length - 1) return ids
		return [
			...ids.slice(0, idx),
			ids[idx + 1],
			id,
			...ids.slice(idx + 2),
		] as string[]
	} else {
		if (idx === 0) return ids
		return [
			...ids.slice(0, idx - 1),
			id,
			ids[idx - 1],
			...ids.slice(idx + 1),
		] as string[]
	}
}
