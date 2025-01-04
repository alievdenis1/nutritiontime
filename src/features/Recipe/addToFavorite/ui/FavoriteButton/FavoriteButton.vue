<template>
	<button
		class="flex items-center justify-center rounded-full shadow-custom transition-colors duration-300 gap-1"
		:class="[props.bgColor, 'w-[62px] h-[44px]']"
		@click="handleClick"
	>
		<IconHeart
			class="w-[20px] h-[20px]"
			:is-liked="isFavorite"
			active-color="#319A6E"
		/>
		<span
			:class="['text-slateGray text-sm font-medium', { 'text-green-500': isFavorite }]"
		>
			{{ props.likes }}
		</span>
	</button>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults } from 'vue'
import { IconHeart } from '@/shared/components/Icon'

import { toggleFavorite } from '../../api'

const props = withDefaults(defineProps<{
	bgColor?: string,
	recipeId: string,
	likes: number,
}>(), {
	bgColor: 'bg-white',
})

const isFavorite = ref(false)

const { execute } = toggleFavorite({ recipeId: props.recipeId })

const handleClick = () => {
	execute()
}
</script>

<style>
</style>