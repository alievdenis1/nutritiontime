<template>
	<div
		v-if="dayStats"
		class="mt-6 space-y-6"
	>
		<div
			v-if="dayStats.meals?.length"
			class="space-y-6"
		>
			<!-- Группа приемов пищи -->
			<div
				v-for="(group, groupIndex) in mealGroups"
				:key="groupIndex"
				class="bg-white shadow-sm rounded-lg overflow-hidden"
			>
				<!-- Заголовок группы с общей статистикой -->
				<div class="p-4 bg-gray-50 border-b border-gray-200">
					<div class="flex items-center justify-between mb-3">
						<h4 class="text-lg font-medium text-gray-700">
							{{ t('mealAt') }} {{ formatTime(group.startTime) }}
						</h4>
						<div class="text-gray-700 font-medium">
							{{ formatNumber(group.totalStats.calories) }} {{ t('kcal') }}
						</div>
					</div>

					<!-- Общая статистика группы -->
					<div class="flex flex-wrap items-center justify-between">
						<!-- Белки -->
						<div class="flex items-center gap-2 min-w-[80px] mb-1">
							<div
								class="w-2.5 h-2.5 rounded-full"
								style="background-color: #319A6E"
							/>
							<span class="text-gray-600">
								{{ t('proteinsShort') }}: {{ formatNumber(group.totalStats.proteins) }} {{ t('gram') }}
							</span>
						</div>
						<!-- Жиры -->
						<div class="flex items-center gap-2 min-w-[80px] mb-1">
							<div
								class="w-2.5 h-2.5 rounded-full"
								style="background-color: #FDC755"
							/>
							<span class="text-gray-600">
								{{ t('fatsShort') }}: {{ formatNumber(group.totalStats.fats) }} {{ t('gram') }}
							</span>
						</div>
						<!-- Углеводы -->
						<div class="flex items-center gap-2 min-w-[80px] mb-1">
							<div
								class="w-2.5 h-2.5 rounded-full"
								style="background-color: #FFA767"
							/>
							<span class="text-gray-600">
								{{ t('carbsShort') }}: {{ formatNumber(group.totalStats.carbs) }} {{ t('gram') }}
							</span>
						</div>
						<div class="text-gray-600 mb-1">
							{{ formatNumber(group.totalStats.weight) }} {{ t('gram') }}
						</div>
					</div>
				</div>

				<!-- Список блюд в группе -->
				<div class="divide-y divide-gray-100">
					<div
						v-for="meal in group.meals"
						:key="meal.id"
						class="px-4 py-3 bg-white relative  transition-colors"
					>
						<div class="w-full h-[1px] bg-[#f5f5f5] mb-3" />

						<div class="flex items-start justify-between gap-4 pr-10">
							<!-- Основная информация -->
							<div class="flex-grow">
								<!-- Название -->
								<h5 class="font-medium text-gray-900 mb-1.5">
									{{ meal.dish_name }}
								</h5>

								<!-- Нутриенты в одну строку -->
								<div class="flex items-center text-sm gap-3">
									<div class="flex flex-col items-center w-full">
										<!-- БЖУ -->
										<div class="flex w-full items-center gap-3 mb-2">
											<div class="flex items-center gap-1.5">
												<div
													class="w-1.5 h-1.5 rounded-full"
													style="background-color: #319A6E"
												/>
												<span class="text-gray">{{ formatNumber(meal.proteins) }}</span>
											</div>
											<div class="flex items-center gap-1.5">
												<div
													class="w-1.5 h-1.5 rounded-full"
													style="background-color: #FDC755"
												/>
												<span class="text-gray">{{ formatNumber(meal.fats) }}</span>
											</div>
											<div class="flex items-center gap-1.5">
												<div
													class="w-1.5 h-1.5 rounded-full"
													style="background-color: #FFA767"
												/>
												<span class="text-gray">{{ formatNumber(meal.carbs) }}</span>
											</div>
										</div>
										<!-- Вес и калории -->
										<div class="flex items-center gap-3 text-gray w-full">
											<span>{{ formatNumber(meal.weight) }} {{ t('gram') }}</span>
											<span>{{ formatNumber(meal.calories) }} {{ t('kcal') }}</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Кнопка удаления -->
							<button
								class="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 mt-9
								transition-colors duration-200"
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
import { ref, computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { deleteMeal } from '../api'
import { openConfirm } from '@/shared/components/Confirm'
import type { MealItem, Profile } from '../model'
import localization from './ProfileStats.localization.json'

const { t } = useTranslation({ ...localization })

interface MealGroup {
	startTime: string;
	meals: MealItem[];
	totalStats: {
		calories: number;
		proteins: number;
		fats: number;
		carbs: number;
		weight: number;
	};
}

const props = defineProps<{
	dayStats: {
		meals: MealItem[]
	} | null,
	profile: Profile | null,
}>()

const emit = defineEmits(['meal-deleted'])

// Состояние для процесса удаления
const isDeleting = ref(false)

// Группировка приемов пищи
const mealGroups = computed(() => {
	if (!props.dayStats?.meals?.length) return []

	const groups: MealGroup[] = []
	let currentGroup: MealGroup | null = null

	// Сортируем приемы пищи по времени
	const sortedMeals = [...props.dayStats.meals].sort((a, b) =>
		new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
	)

	sortedMeals.forEach((meal) => {
		const mealTime = new Date(meal.created_at)

		// Проверяем, нужно ли создать новую группу
		if (!currentGroup || getTimeDifferenceInMinutes(
			new Date(currentGroup.meals[currentGroup.meals.length - 1].created_at),
			mealTime
		) > 60) {
			// Сохраняем предыдущую группу
			if (currentGroup) {
				groups.push(currentGroup)
			}

			// Создаем новую группу
			currentGroup = {
				startTime: meal.created_at,
				meals: [meal],
				totalStats: {
					calories: meal.calories,
					proteins: meal.proteins,
					fats: meal.fats,
					carbs: meal.carbs,
					weight: meal.weight,
				},
			}
		} else {
			// Добавляем к существующей группе
			currentGroup.meals.push(meal)
			// Обновляем статистику группы
			currentGroup.totalStats.calories += meal.calories
			currentGroup.totalStats.proteins += meal.proteins
			currentGroup.totalStats.fats += meal.fats
			currentGroup.totalStats.carbs += meal.carbs
			currentGroup.totalStats.weight += meal.weight
		}
	})

	// Добавляем последнюю группу
	if (currentGroup) {
		groups.push(currentGroup)
	}

	return groups
})

// Функция для подсчета разницы во времени в минутах
const getTimeDifferenceInMinutes = (date1: Date, date2: Date): number => {
	return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60)
}

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

// Форматирование времени
const formatTime = (dateString: string): string => {
	const date = new Date(dateString)
	return date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

// Форматирование чисел
const formatNumber = (value: string | number | undefined | null): string => {
	if (value == null) return '0'
	return Math.round(Number(value)).toString()
}
</script>