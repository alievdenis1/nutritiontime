<script setup lang="ts">
import { IconFavorites } from 'shared/components/Icon'
import { Recipe } from 'entities/Recipe'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	recipe: Pick<Recipe, 'collection_ids' | 'id'> & Record<string, unknown>
	loading?: boolean
	withBackground?: boolean
	invertBackground?: boolean
}>(), {
	loading: false,
	withBackground: false,
	invertBackground: false
})

const isAlreadyInCollection = computed(() => {
	return !!props.recipe.collection_ids?.length
})

const backgroundColor = computed(() => {
	return props.invertBackground
		? 'bg-lightGray'
		: 'bg-white'
})

const emit = defineEmits<{
	click: [id: Recipe['id']]
}>()
</script>

<template>
	<button
		v-if="withBackground"
		v-loading="loading"
		class="flex items-center justify-center rounded-full shadow-custom transition-colors duration-300 gap-1"
		:class="['w-[62px] h-[44px]', backgroundColor]"
		@click="emit('click', props.recipe.id)"
	>
		<IconFavorites
			:is-liked="isAlreadyInCollection"
			active-color="#319A6E"
		/>
	</button>

	<div
		v-else
		v-loading="loading"
		class="flex gap-1 items-center cursor-pointer"
		@click="emit('click', props.recipe.id)"
	>
		<IconFavorites
			:is-liked="isAlreadyInCollection"
			active-color="#319A6E"
		/>
	</div>
</template>

<style module>

</style>
