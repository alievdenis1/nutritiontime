import { Tag } from 'entities/Tag'
import { Category } from 'entities/Category'

export type TagsGroupedByCategory = Category & { tags: Tag[] }

export const groupTagsByCategories = (
	tags: Tag[],
	categories: Category[]
) => {
	return categories.reduce((acc, category) => {
		const _tags = tags.filter(tag => tag.category === category.name)

		acc.push({
			...category,
			tags: _tags
		})

		return acc
	}, [] as TagsGroupedByCategory[])
}
