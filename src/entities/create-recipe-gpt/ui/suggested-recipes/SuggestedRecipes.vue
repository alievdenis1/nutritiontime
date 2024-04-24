<template>
	<div
		v-for="recipe in recipes"
		:key="recipe.id"
		class="flex gap-3 bg-white items-center rounded-[40px] py-[14px] px-[21px] justify-between"
	>
		<div class="flex gap-2">
			<img
				:src="recipe.img"
				alt="recipe_picture"
				height="90"
				width="82"
			>
			<div class="flex flex-col justify-between">
				<div class="flex flex-col gap-[5px] mt-[22px] font-medium text-[#735F2B]">
					<span class="text-[15px] w leading-[95%]">
						{{ recipe.title }}
					</span>
					<span class="text-[10px] opacity-70">
						{{ recipe.desc }}
					</span>
				</div>
				<div class="flex gap-3 text-[#735F2B] items-center font-medium">
					<span class="flex items-center text-[10px] gap-1">
						<img
							height="16"
							src="/image/icons/icon-clock.svg"
							width="16"
						>
						{{ `${recipe.time}min.` }}
					</span>
					<span class="flex items-center text-[10px] gap-1">
						<img
							height="15"
							src="/image/icons/icon-fire.svg"
							width="11"
						>
						{{ `${recipe.kkal} kkal.` }}
					</span>
				</div>
			</div>
		</div>
		<v-button
			class="cursor-pointer"
		>
			<el-icon
				class="items-center"
				size="8"
			>
				<el-icon-arrow-right-bold class="text-[#735F2B]" />
			</el-icon>
		</v-button>
	</div>
</template>

<script setup lang="ts">
import { type Recipe } from '../../types'

defineProps<{
	recipes: Recipe[],
}>()
</script>

<style scoped>

</style>