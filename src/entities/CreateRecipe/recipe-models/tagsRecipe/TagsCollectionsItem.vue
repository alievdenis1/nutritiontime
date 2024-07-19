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
import { toRefs } from 'vue'

const props = defineProps<{
	categoriesTags: {
		name: string
		tags: string[]
	}[],
	modalSelectedTags: string[]
}>()

const { modalSelectedTags, categoriesTags } = toRefs(props)

const toggleTag = (tag: string) => {
	if (modalSelectedTags.value.includes(tag)) {
		modalSelectedTags.value = modalSelectedTags.value.filter(t => t !== tag)
	} else {
		modalSelectedTags.value.push(tag)
	}
}
const hasTag = (tag: string) => modalSelectedTags.value.includes(tag)

</script>

<style scoped></style>