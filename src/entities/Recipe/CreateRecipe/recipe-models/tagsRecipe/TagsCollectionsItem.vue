<template>
	<div>
		<div
			v-for="(category, index) in categoriesTags"
			:key="index"
			class="mb-5"
		>
			<h3 :class="['mb-3.5 text-lg', {'text-sm': isSubtitle}]">
				{{ category?.name }}
			</h3>
			<!-- Оборачиваем строки тегов в контейнер с боковым скроллом -->
			<div>
				<div class="tag-grid">
					<div
						v-for="rowTags in chunkTags(category.tags, props.chunkAmount)"
						:key="rowTags[0]"
						class="tag-row mb-[10px]"
						:class="{
							'has-active-tag': rowTags.some(tag => hasTag(tag) || tag.length > 8),
							'overflow-x-auto': !isSubtitle
						}"
					>
						<div
							v-for="tag in rowTags"
							:key="tag"
							class="tag-wrapper"
						>
							<button
								:class="['tag-button', { 'bg-forestGreen text-white': hasTag(tag), 'bg-lightGray': !hasTag(tag) }]"
								@click="selectTag(tag)"
							>
								<span class="tag-text">{{ tag }}</span>
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
import { ref, toRefs, watch } from 'vue'
import { IconClose } from 'shared/components/Icon'

interface Category {
	name?: string;
	tags: string[];
}

const props = withDefaults(defineProps<{
	categoriesTags: Category[];
	modalSelectedTags: string[];
	isSubtitle?: boolean;
	chunkAmount: number;
}>(), {
	isSubtitle: false,
	chunkAmount: 5,
})

const emit = defineEmits<{
	(event: 'tagChanged', tags: string[]): void;
}>()

const { categoriesTags } = toRefs(props)
const selectedTags = ref<string[]>([...props.modalSelectedTags])

watch(() => props.modalSelectedTags, (newTags) => {
	selectedTags.value = [...newTags]
})

// Разбиваем теги на строки по 5 элементов
const chunkTags = (tags: string[], chunkSize: number) => {
	const result = []
	for (let i = 0; i < tags.length; i += chunkSize) {
		result.push(tags.slice(i, i + chunkSize))
	}
	return result
}

const selectTag = (tag: string) => {
	if (!selectedTags.value.includes(tag)) {
		selectedTags.value.push(tag)
		emit('tagChanged', selectedTags.value)
	}
}

const removeTag = (tag: string) => {
	const index = selectedTags.value.indexOf(tag)
	if (index > -1) {
		selectedTags.value.splice(index, 1)
		emit('tagChanged', selectedTags.value)
	}
}

const hasTag = (tag: string): boolean => selectedTags.value.includes(tag)
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