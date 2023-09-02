import type { Status } from '#context/Status'
import { GET } from '#api/client.js'
import type { RequestResult } from '#api/requestResult.js'

export const fetchProjectStatus = (
	id: string,
	startDate?: Date,
	endDate?: Date,
): RequestResult<{ status: Status[] }> => {
	const url = `/project/${encodeURIComponent(id)}/status`
	const params = new URLSearchParams()
	if (startDate !== undefined) {
		params.set('inclusiveStartDate', startDate.toISOString())
	}
	if (endDate !== undefined) {
		params.set('inclusiveEndDate', endDate.toISOString())
	}
	return GET<{ status: Status[] }>(`${url}?${params.toString()}`)
}

export const fetchProjectStatusById = (
	projectId: string,
	statusId: string,
): ReturnType<typeof GET<{ status: Status }>> =>
	GET<{ status: Status }>(
		`/project/${encodeURIComponent(projectId)}/status/${encodeURIComponent(
			statusId,
		)}`,
	)
