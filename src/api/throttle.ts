import pThrottle from 'p-throttle'

export const throttle = pThrottle({
	limit: 2,
	interval: 250,
})
