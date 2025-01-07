<template>
	<button
		class="flex items-center justify-center rounded-full shadow-custom transition-colors duration-300 gap-1"
		:class="[props.bgColor, 'w-[62px] h-[44px]']"
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
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import { IconHeart } from '@/shared/components/Icon'
import { useRecipeLikeStore } from 'entities/Recipe/model/use-recipe-like-store.ts'

const props = withDefaults(defineProps<{
	bgColor?: string,
	recipeId: number,
	likes: number,
}>(), {
	bgColor: 'bg-white',
})

const value = defineModel<boolean>({ required: true })

const likeStore = useRecipeLikeStore()

const handleClick = async () => {
	await likeStore.likeRecipe(props.recipeId)
}
</script>

<style>
</style>
