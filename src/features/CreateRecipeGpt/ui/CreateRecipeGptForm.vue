<template>
	<button
		class="text-[#735F2B] font-bold cursor-pointer self-start opacity-70 mb-5"
		@click="router.push('/create-recipe')"
	>
		&lt; Назад
	</button>
	<form class="flex flex-col gap-[23px] mb-6">
		<div class="flex gap-1 text-[#735F2B]">
			<img
				src="/image/icons/icon-gpt.svg"
				width="18"
			>
			<span class="text-[15px] font-medium">
				ChatGPT
			</span>
		</div>

		<div class="flex flex-col gap-[12px]">
			<span class="form-element-title">
				Name food
			</span>
			<div class="w-full h-[42px] bg-white rounded-[40px] p-[15px] mb-[11px] flex items-center justify-between">
				<div class="opacity-0" />
				<input
					type="text"
				>
				<v-button class="cursor-pointer">
					<img
						src="/image/icons/icon-pen.svg"
						width="17"
					>
				</v-button>
			</div>
			<v-button class="generate-button self-end">
				Generate
			</v-button>
		</div>

		<div class="flex flex-col gap-7">
			<h3 class="font-medium text-center text-[#735F2B]">
				Or choose from the suggested ones
			</h3>
			<SuggestedRecipes
				:recipes="suggestedRecipes"
			/>
		</div>

		<TagsList
			:tags="tags"
		/>

		<v-button
			class="generate-button w-[235px] h-[54px] self-center"
		>
			Generate using ai
		</v-button>
	</form>
</template>

<script setup lang="ts">
import { SuggestedRecipes } from 'entities/create-recipe-gpt/ui/suggested-recipes'
import { TagsList } from 'entities/create-recipe-gpt/ui/tags-list'
import { useRouter } from 'vue-router'

const router = useRouter()

const suggestedRecipes = [
	{ id:1, title: 'Soup with cats', img:'/image/suggested-placeholder.png', desc: 'text', time: 30, kkal: 150 },
	{ id:1, title: 'Soup with cats', img:'/image/suggested-placeholder.png', desc: 'text', time: 30, kkal: 150 },
	{ id:1, title: 'Soup with cats', img:'/image/suggested-placeholder.png', desc: 'text', time: 30, kkal: 150 }
]

const tags = [
	{ id:1, name: '#Italian' },
	{ id:2, name: '#Chicken' }
]
</script>

<style scoped>
.form-element-title {
	@apply text-[#AB9F80] text-[11px] leading-[94.95%]
}

.generate-button {
	@apply text-[20px] leading-[110%] font-medium w-[185px] h-[45px] flex items-center justify-center
	bg-[#735F2B] rounded-[40px] text-white cursor-pointer
}
</style>