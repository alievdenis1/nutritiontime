export const normalizeImageUrl = (imageUrl: string) => {
	if (imageUrl?.startsWith('/')) {
		return import.meta.env.VITE_IMAGE_BASE_URL + imageUrl
	}

	return imageUrl
}
