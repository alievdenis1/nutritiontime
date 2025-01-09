<template>
	<button
		v-if="withBackground"
		v-loading="likeStore.recipesWithPendingLike.has(props.recipeId)"
		class="flex items-center justify-center rounded-full shadow-custom transition-colors duration-300 gap-1"
		:class="['w-[62px] h-[44px]', backgroundColor]"
		@click="handleClick"
	>
		<IconHeart
			class="w-[20px] h-[20px]"
			:is-liked="value"
			active-color="#319A6E"
		/>
		<span
			:class="['text-slateGray text-sm font-medium', { 'text-green-500': value }]"
		>
			{{ props.likes }}
		</span>
	</button>

	<div
		v-else
		v-loading="likeStore.recipesWithPendingLike.has(props.recipeId)"
		class="flex gap-1 items-center cursor-pointer"
		@click="handleClick"
	>
		<IconHeart
			class="w-[20px] h-[20px]"
			:is-liked="value"
			active-color="#319A6E"
		/>
		<span
			class="leading-5 inline-block align-middle"
			:class="['text-slateGray text-sm font-medium', { 'text-green-500': value }]"
		>
			{{ props.likes }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'
import { IconHeart } from '@/shared/components/Icon'
import { useRecipeLikeStore } from 'entities/Recipe/model/use-recipe-like-store.ts'

const props = withDefaults(defineProps<{
	bgColor?: string,
	recipeId: number,
	likes: number,
	withBackground?: boolean
	invertBackground?: boolean
}>(), {
	bgColor: 'bg-white',
	withBackground: false,
	invertBackground: false
})

const value = defineModel<boolean>({ required: true })

const emit = defineEmits<{
	success: [{ recipeId: number, isFavorited: boolean}]
}>()

const backgroundColor = computed(() => {
	return props.invertBackground
		? 'bg-lightGray'
		: 'bg-white'
})

const likeStore = useRecipeLikeStore()

const handleClick = async () => {
	const result = await likeStore.likeRecipe(props.recipeId)

	if (result !== null) {
		emit('success', { recipeId: props.recipeId, isFavorited: result })
	}
}
</script>

<style>
</style>
