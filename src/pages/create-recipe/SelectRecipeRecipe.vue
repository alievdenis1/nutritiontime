<template>
	<div class="p-[16px]">
		<VLoading v-if="loading" />
		<div v-else>
			<div class="flex justify-center items-center mb-[16px] min-h-[44px]">
				<h2 class="text-center text-lg text-darkGray">
					{{ t('chooseRecipe') }}
				</h2>
			</div>
			<div class="mb-[80px] mt-[24px]">
				<div
					v-for="recipe in recipes"
					:key="recipe.id"
					class="max-w-md mx-auto rounded-[20px] overflow-hidden md:max-w-2xl mb-4 px-[2px] py-[2px] cursor-pointer"
					@click="choiceRecipe()"
				>
					<div class="flex border-custom">
						<div class="relative">
							<img
								class="img object-cover rounded-[20px]"
								:src="recipe.image"
								alt="recipe image"
							>
						</div>
						<div class="p-[12px] flex flex-col justify-between">
							<div>
								<h2 class="truncated-text text-lg font-regular text-sm">
									{{ recipe.title }}
								</h2>
							</div>
							<div class="flex justify-between items-center mt-2 flex-wrap gap-[6px]">
								<div
									class="flex justify-center items-center gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
								>
									<IconTime />
									<span>{{ t('time') }}</span>
								</div>
								<div
									class="flex justify-center items-center gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
								>
									<IconFire />
									<span>{{ t('calories') }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconFire, IconTime } from 'shared/components/Icon'
import { VLoading } from 'shared/components/Loading'
import { useRouter } from 'vue-router'

import { useTranslation } from '@/shared/lib/i18n'
import localizations from './SelectRecipeRecipe.localization.json'

const { t } = useTranslation(localizations)

const router = useRouter()
const loading = ref(true)

const recipes = [
	{
		id: 1,
		title: 'Вкуснейший домашний бургер',
		image: '/image/recipes1.png',
		time: '35 мин',
		calories: '300 ккал'
	},
	{
		id: 2,
		title: 'Вкуснейший домашний бургер',
		image: '/image/recipes1.png',
		time: '35 мин',
		calories: '300 ккал'
	},
	{
		id: 3,
		title: 'Вкуснейший домашний бургер',
		image: '/image/recipes1.png',
		time: '35 мин',
		calories: '300 ккал'
	}
]

const choiceRecipe = () => {
	router.push({ name: 'check-recipe', query: { source: 'ai' } })
}

onMounted(() => {
	setTimeout(() => {
		loading.value = false
	}, 2000)
})
</script>

<style scoped>
.border-custom {
    border: 1px solid #1C1C1C0D;
    border-radius: 20px;
}

.truncated-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
    max-height: 3em;
    line-height: 1.5em;
}

.img {
    height: 140px;
    min-width: 140px;
    max-width: 140px;
}
</style>