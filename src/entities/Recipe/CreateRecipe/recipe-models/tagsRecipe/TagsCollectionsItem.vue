<template>
	<div>
		<div
			v-for="(category, index) in categoriesTags"
			:key="index"
			class="mb-5"
		>
			<h3 class="mb-3.5 text-lg">
				{{ category.name }}
			</h3>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="tag in category.tags"
					:key="tag"
					:class="['px-2 py-1 border rounded-full cursor-pointer', { 'bg-forestGreen text-white': hasTag(tag), 'bg-lightGray': !hasTag(tag) }]"
					@click="toggleTag(tag)"
				>
					{{ tag }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

interface Category {
	name: string;
	tags: string[];
}

const props = defineProps<{
	categoriesTags: Category[];
	modalSelectedTags: string[];
}>()

const emit = defineEmits<{
	(event: 'tagChanged', tags: string[]): void;
}>()

const { categoriesTags } = toRefs(props)
const selectedTags = ref<string[]>([...props.modalSelectedTags])

watch(() => props.modalSelectedTags, (newTags) => {
	selectedTags.value = [...newTags]
})

const toggleTag = (tag: string) => {
	const index = selectedTags.value.indexOf(tag)
	if (index > -1) {
		selectedTags.value.splice(index, 1)
	} else {
		selectedTags.value.push(tag)
	}
	emit('tagChanged', selectedTags.value)
}

const hasTag = (tag: string): boolean => selectedTags.value.includes(tag)
</script>

<style scoped></style>