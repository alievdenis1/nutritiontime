export const calculateCalories = (data: {
	proteins: number,
	fats: number,
	carbohydrates: number
}) => {
	const { proteins, fats, carbohydrates } = data

	return (proteins * 4) + (carbohydrates * 4) + (fats * 9)
}
