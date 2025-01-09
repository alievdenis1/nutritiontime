export function softFilterBySearchQuery<T>(properties: {
	data: T[],
	key: keyof T,
	query: string
}) {
	const { data, key, query } = properties

	if (!query.trim()) {
		return data
	}

	return data.filter((item) => {
		return (
			typeof item[key] === 'string'
      && item[key].toLowerCase().includes(query.trim().toLowerCase())
		)
	})
}
