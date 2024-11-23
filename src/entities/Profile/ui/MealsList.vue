<template>
	<!-- Список приемов пищи -->
	<div
		v-if="dayStats"
		class="mt-6 space-y-4"
	>
		<div
			v-if="dayStats.meals?.length"
			class="space-y-3"
		>
			<div
				v-for="meal in dayStats.meals"
				:key="meal.id"
				class="p-4 bg-gray-50 rounded-lg bg-white shadow-sm relative"
			>
				<!-- Кнопка удаления -->
				<button
					class="absolute top-11 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
					:disabled="isDeleting"
					@click.stop="confirmDelete(meal)"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="rgb(255, 167, 103)"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>

				<!-- Заголовок и время -->
				<div class="flex items-center mb-2">
					<h5 class="font-medium flex-grow">
						{{ meal.dish_name }}
					</h5>
					<span class="text-sm text-gray-500 text-slateGray">
						{{ formatTime(meal.created_at) }}
					</span>
				</div>

				<!-- Макронутриенты -->
				<div class="text-sm">
					<div class="flex flex-wrap gap-5">
						<!-- Белки -->
						<div class="flex items-center gap-2">
							<div
								class="w-2 h-2 rounded-full"
								style="background-color: #319A6E"
							/>
							<span class="text-gray-600">{{ t('proteinsShort') }}: {{ formatNumber(meal.proteins) }} {{ t('gram') }}.</span>
						</div>

						<!-- Жиры -->
						<div class="flex items-center gap-2">
							<div
								class="w-2 h-2 rounded-full"
								style="background-color: #FDC755"
							/>
							<span class="text-gray-600">{{ t('fatsShort') }}: {{ formatNumber(meal.fats) }} {{ t('gram') }}.</span>
						</div>

						<!-- Углеводы -->
						<div class="flex items-center gap-2">
							<div
								class="w-2 h-2 rounded-full"
								style="background-color: #FFA767"
							/>
							<span class="text-gray-600">{{ t('carbsShort') }}: {{ formatNumber(meal.carbs) }} {{ t('gram') }}.</span>
						</div>
					</div>

					<div class="flex mt-3 text-slateGray gap-5">
						<!-- Вес -->
						<div class="text-gray-500">
							{{ formatNumber(meal.weight) }} {{ t('gram') }}.
						</div>
						<!-- Калории -->
						<div class="flex items-center gap-2">
							<span class="text-gray-600">{{ formatNumber(meal.calories) }} {{ t('kcal') }}.</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Сообщение при отсутствии данных -->
		<div
			v-else
			class="text-center text-gray-500 py-8"
		>
			{{ t('noMealsForDate') }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { deleteMeal } from '../api'
import { openConfirm } from '@/shared/components/Confirm'
import type { MealItem, Profile } from '../model'
import localization from './ProfileStats.localization.json'

const { t } = useTranslation({ ...localization })

defineProps<{
  dayStats: {
    meals: MealItem[]
  } | null,
  profile: Profile | null,
}>()

const emit = defineEmits(['meal-deleted'])

// Состояние для процесса удаления
const isDeleting = ref(false)

// Функция подтверждения удаления
const confirmDelete = async (meal: MealItem) => {
  const confirmed = await openConfirm({
    title: t('deleteMealTitle'),
    description: t('deleteMealDescription'),
    confirmButtonText: t('confirmDelete'),
    cancelButtonText: t('cancelDelete')
  })

  if (confirmed) {
    isDeleting.value = true
    try {
      const { execute } = deleteMeal(meal.id)
      await execute()
      emit('meal-deleted', meal.id)
    } catch (error) {
      console.error('Error deleting meal:', error)
    } finally {
      isDeleting.value = false
    }
  }
}

// Заменяем formatDateWithTimezone на простой formatTime
const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Форматирование чисел остается без изменений
const formatNumber = (value: string | number | undefined | null): string => {
  if (value == null) return '0'
  return Math.round(Number(value)).toString()
}
</script>