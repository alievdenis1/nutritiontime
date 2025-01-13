<template>
	<div>
		<div
			v-for="(category, index) in chunkedTagsByCategories"
			:key="index"
			class="mb-5"
		>
			<h3 :class="['mb-3.5 text-lg', {'text-sm': isSubtitle}]">
				{{ category.title ?? category.name }}
			</h3>
			<!-- Оборачиваем строки тегов в контейнер с боковым скроллом -->
			<div>
				<div class="tag-grid">
					<div
						v-for="rowTags in category.tags"
						:key="rowTags[0].id"
						class="tag-row mb-[10px]"
						:class="{
							'has-active-tag': rowTags.some(tag => hasTag(tag)),
							'overflow-x-auto': !isSubtitle
						}"
					>
						<div
							v-for="tag in rowTags"
							:key="tag.id"
							class="tag-wrapper"
						>
							<button
								:class="[
									'tag-button',
									{
										'bg-forestGreen text-white': selectedTagsSet.has(tag.id),
										'bg-lightGray': !selectedTagsSet.has(tag.id)
									}
								]"
								@click="selectTag(tag)"
							>
								<span class="tag-text">{{ tag.title ?? tag.name }}</span>

								<span
									v-if="hasTag(tag)"
									class="tag-close"
									@click.stop="removeTag(tag)"
								>
									<IconClose
										icon-color="#FFFFFF"
										class="w-[12px] h-[12px]"
									/>
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconClose } from 'shared/components/Icon'
import { Tag } from 'entities/Tag'

interface Category {
	name: string;
	title?: string
	id?: number,
	tags: Tag[];
}

interface CategoryWithChunkedTags {
	name: string
	title?: string
	id?: number
	tags: Tag[][]
}

const props = withDefaults(defineProps<{
	/** Тэги, сгруппированные по категориям */
	tagsByCategories: Category[];
	isSubtitle?: boolean;
	chunkAmount: number;
}>(), {
	isSubtitle: false,
	chunkAmount: 5,
})

const emit = defineEmits<{
	(event: 'tagChanged', tags: number[]): void;
}>()

const selectedTags = defineModel<number[]>({ required: true })

const selectedTagsSet = computed(() => {
	return new Set(selectedTags.value)
})

// Разбиваем теги на строки по 5 элементов
const chunkTags = (tags: Tag[], chunkSize: number): Tag[][] => {
	const result: Tag[][] = []

	for (let i = 0; i < tags.length; i += chunkSize) {
		result.push(tags.slice(i, i + chunkSize))
	}

	return result
}

// type ChunkedTagsByCategories =

const chunkedTagsByCategories = computed(() => {
	return props.tagsByCategories.reduce((acc, category) => {
		acc.push({
			...category,
			tags: chunkTags(category.tags, props.chunkAmount)
		})
		return acc
	}, [] as CategoryWithChunkedTags[])
})

const selectTag = (tag: Tag) => {
	if (!selectedTags.value.includes(tag.id)) {
		selectedTags.value.push(tag.id)
	}
}

const removeTag = (tag: Tag) => {
	const index = selectedTags.value.indexOf(tag.id)
	if (index > -1) {
		selectedTags.value.splice(index, 1)
	}
}

const hasTag = (tag: Tag): boolean => selectedTags.value.includes(tag.id)
</script>

<style scoped>
.tag-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.tag-row {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	justify-content: flex-start;
}

.tag-row.has-active-tag {
	justify-content: flex-start;
}

.tag-wrapper {
	min-width: 0;
}

.tag-button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	border-radius: 9999px;
	border: 1px solid #E1E1E1;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.tag-text {
	flex-grow: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tag-close {
	flex-shrink: 0;
	margin-left: 8px;
}

.bg-forestGreen {
	background-color: #319A6E;
}

.bg-lightGray {
	background-color: #F3F3F3;
}

.custom-scrollbar {
	overflow-x: auto;
	scrollbar-width: thin;
	scrollbar-color: #319A6E #e0e0e0;
}

.custom-scrollbar::-webkit-scrollbar {
	height: 4px;
	background-color: #e0e0e0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: #319A6E;
	border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	height: 8px;
	background-color: #24664f;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background-color: #e0e0e0;
}
</style>
