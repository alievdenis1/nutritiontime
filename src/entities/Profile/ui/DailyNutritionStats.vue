// DailyNutritionStats.vue
<template>
	<div class="space-y-4">
		<WeightInput
			v-if="profile"
			:profile="profile"
			:visible-button="false"
			@updated="$emit('retry')"
		/>

		<VLoading
			v-if="loading"
			class="h-64"
		/>

		<div class="p-6 bg-white rounded-lg shadow-sm">
			<!-- Заголовок с календарем -->
			<div class="flex items-center justify-between p-4">
				<div class="flex items-center justify-center w-full gap-2">
					<!-- Стрелка влево -->
					<button
						class="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold"
						@click="handlePrevDay"
					>
						{{ '<' }}
					</button>

					<!-- Заголовок -->
					<h3
						class="text-lg font-bold"
						@click="toggleCalendar"
					>
						{{ headerTitle }}
					</h3>

					<!-- Стрелка вправо -->
					<button
						class="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold"
						:disabled="isToday"
						:class="{ 'opacity-50 cursor-not-allowed': isToday }"
						@click="handleNextDay"
					>
						{{ '>' }}
					</button>
				</div>

				<!-- Календарь -->
				<Teleport to="body">
					<div
						v-if="showCalendar"
						class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
						@click="closeCalendar"
					>
						<div
							class="bg-white w-full max-w-lg rounded-lg mx-4"
							@click.stop
						>
							<!-- Шапка календаря -->
							<div class="flex items-center justify-between p-4 border-b">
								<h4 class="text-lg font-medium">
									{{ t('selectDate') }}
								</h4>
								<button
									class="p-2 hover:bg-gray-100 rounded-full transition-colors"
									@click="closeCalendar"
								>
									✕
								</button>
							</div>

							<el-calendar
								ref="calendar"
								v-model="calendarDate"
								class="custom-calendar"
							>
								<template #date-cell="{ data }">
									<div
										class="text-center cursor-pointer py-2 h-[100%]"
										:class="{
											'text-gray-400': !isFilledDate(formatDate(data.day)),
											'font-bold text-emerald-600': isFilledDate(formatDate(data.day)),
											'bg-emerald-50': isCurrentDate(data.day),
											'opacity-50 cursor-not-allowed': isFutureDate(data.day)
										}"
										@click="handleDateClick(data.day)"
									>
										{{ new Date(data.day).getDate() }}
									</div>
								</template>
								<template #header="{ date }">
									<div class="flex justify-between w-[100%] flex-wrap gap-[16px]">
										<span>{{ date }}</span>
										<el-button-group class="flex">
											<el-button
												size="small"
												@click="selectDate('prev-month')"
											>
												{{ t('prevMonth') }}
											</el-button>
											<el-button
												size="small"
												@click="selectDate('today')"
											>
												{{ t('today') }}
											</el-button>
											<el-button
												:disabled="isNextMonthDisabled(calendarDate)"
												size="small"
												@click="selectDate('next-month')"
											>
												{{ t('nextMonth') }}
											</el-button>
										</el-button-group>
									</div>
								</template>
							</el-calendar>
						</div>
					</div>
				</Teleport>
			</div>
			<!-- Калории и приемы пищи -->
			<div class="mb-6">
				<div class="flex flex-col items-center mb-2">
					<div class="text-base text-gray-500 mb-1">
						<template v-if="dayStats?.meals?.length">
							{{ t('mealsCount', { count: dayStats.meals_count.toString() }) }}
						</template>
						<template v-else>
							<div class="text-center">
								{{ t('noDataForDate') }}:<br>
								<template v-if="!profile">
									<span
										class="text-green hover:text-[#ff9142] transition-colors"
										@click="handleToProfile()"
									>{{ t('fillProfile') }}</span>
								</template>
								<template v-else-if="isToday">
									<span
										class="text-green underline transition-colors"
										@click="handleAddMeal()"
									>
										{{ t('addMeal') }}
									</span>
								</template>
							</div>
						</template>
					</div>
					<div>
						<span class="text-gray-500">{{ t('calories') }}: </span>
						<span>{{ formatNumber(dayStats?.total_calories || 0) }} {{ t('out_of') }} {{ formatNumber(profile?.target_calories) }} {{ t('kcal') }}</span>
						<span
							v-if="isExceeded(dayStats?.total_calories, profile?.target_calories)"
							class="font-bold"
							style="color: #F04F4F"
						>
							(+{{ formatNumber(Number(dayStats?.total_calories || 0) - (Number(profile?.target_calories) || 0)) }})
						</span>
					</div>
				</div>
				<!-- Прогресс бар -->
				<div class="relative w-full h-2 bg-beige rounded-full overflow-hidden">
					<div
						class="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
						:style="{
							width: `${Math.min(calculatePercentage(dayStats?.total_calories, profile?.target_calories), 100)}%`,
							backgroundColor: getProgressBarColor()
						}"
					/>
				</div>
			</div>

			<!-- БЖУ -->
			<div class="flex flex-col items-center">
				<!-- График БЖУ -->
				<div class="w-40 mb-4">
					<apexchart
						type="radialBar"
						height="240"
						:options="getMacrosChartOptions()"
						:series="macrosPercentages"
					/>
				</div>

				<!-- Подписи БЖУ -->
				<div class="w-full flex flex-col justify-center">
					<div class="flex items-center gap-2 m-auto">
						<div
							class="w-3 h-3 rounded-full"
							style="background-color: #319A6E"
						/>
						<span class="text-gray-500">
							{{ t('proteins') }}: {{ formatNumber(dayStats?.total_proteins || 0) }} {{ t('out_of') }} {{ formatNumber(profile?.macro_proteins) }} {{ t('gram') }}.
							<span
								class="font-semibold"
								style="color: #319A6E"
							>({{ macrosPercentages[0] }}%)</span>
						</span>
					</div>
					<div class="flex items-center gap-2 m-auto">
						<div
							class="w-3 h-3 rounded-full"
							style="background-color: #FDC755"
						/>
						<span class="text-gray-500">
							{{ t('fats') }}: {{ formatNumber(dayStats?.total_fats || 0) }} {{ t('out_of') }} {{ formatNumber(profile?.macro_fats) }} {{ t('gram') }}.
							<span
								class="font-semibold"
								style="color: #FDC755"
							>({{ macrosPercentages[1] }}%)</span>
						</span>
					</div>
					<div class="flex items-center gap-2 m-auto">
						<div
							class="w-3 h-3 rounded-full"
							style="background-color: #FFA767"
						/>
						<span class="text-gray-500">
							{{ t('carbs') }}: {{ formatNumber(dayStats?.total_carbs || 0) }} {{ t('out_of') }} {{ formatNumber(profile?.macro_carbs) }} {{ t('gram') }}.
							<span
								class="font-semibold"
								style="color: #FFA767"
							>({{ macrosPercentages[2] }}%)</span>
						</span>
					</div>
				</div>
			</div>

			<VButton
				:color="ButtonColors.Green"
				class="mt-5"
				@click="handleToProfile()"
			>
				{{ t('editProfile') }}
			</VButton>
		</div>

		<MealsList
			:profile="profile"
			:day-stats="dayStats"
			@meal-deleted="handleMealDeleted"
		/>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
 import { useTranslation } from '@/shared/lib/i18n'
 import { ElCalendar, CalendarInstance, CalendarDateType, ElButtonGroup, ElButton } from 'element-plus'
 import { VLoading } from '@/shared/components/Loading'
 import type { Profile, MealStats, MealItem } from '../model'
 import localization from './ProfileStats.localization.json'
 import { MealsList, WeightInput } from './index'
 import { ButtonColors, VButton } from 'shared/components/Button'
 import WebApp from '@twa-dev/sdk'
 import { sendToAddMeal, sendToProfile } from 'entities/Profile'

 interface Props {
   modelValue: string
   profile: Profile | null
   mealStats: MealStats | null
   loading: boolean
   error: string | null
 }

 const props = defineProps<Props>()

 const emit = defineEmits<{
   (e: 'update:modelValue', date: string): void
   (e: 'setGoals'): void
   (e: 'retry'): void
   (e: 'meal-deleted'): void
 }>()

 const handleToProfile = async () => {
   await sendToProfile().execute()
   WebApp.close()
 }

 const handleMealDeleted = () => {
  emit('meal-deleted')
 }

 const handleAddMeal = async () => {
   await sendToAddMeal().execute()
   WebApp.close()
 }

 // Локализация
 const { t } = useTranslation(localization)

 // Состояние
 const showCalendar = ref(false)
 const today = computed(() => {
   return getServerDate.value?.toISOString().split('T')[0] || ''
 })
 // Добавляем проверку на будущий месяц
 const isNextMonthDisabled = (chosenDate: Date | string) => {
  const nextMonth = new Date(chosenDate).getMonth() + 1
  const todayMonth = new Date(today.value).getMonth()

  return nextMonth > todayMonth
 }
 // Добавляем проверку на будущую дату
 const isFutureDate = (date: string) => {
   if (!getServerDate.value) return true
   const selectedDate = new Date(date)
   selectedDate.setHours(0, 0, 0, 0)

   const serverDate = new Date(getServerDate.value)
   serverDate.setHours(0, 0, 0, 0)

   return selectedDate > serverDate
 }
 // Добавляем обработчик клика по дате
 const handleDateClick = (date: string) => {
   if (isFutureDate(date)) return
   emit('update:modelValue', new Date(date).toISOString().split('T')[0])
   showCalendar.value = false
 }

 // Календарь
 const calendarDateType = ref<CalendarDateType | null>(null)
 const calendar = ref<CalendarInstance>()
 const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendarDateType.value = val
  calendar.value.selectDate(val)
 }

 const calendarDate = computed({
   get: () => new Date(props.modelValue),
   set: (value: Date) => {
     const dateString = value.toISOString().split('T')[0]
     if (!isFutureDate(dateString)) {
       emit('update:modelValue', dateString)
       if (calendarDateType.value !== 'next-month' && calendarDateType.value !== 'prev-month') {
         showCalendar.value = false
       }
     }
     calendarDateType.value = null
   }
 })

 // Форматирование даты для отображения
 const formatDateForDisplay = (date: string | Date): string => {
   return new Date(date).toLocaleDateString('ru-RU')
 }

 // Закрытие календаря при клике вне
 const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.el-calendar') && showCalendar.value) {
   showCalendar.value = false
  }
 }

 onMounted(() => {
   if (props.profile?.server_datetime) {
     emit('update:modelValue', new Date(props.profile.server_datetime).toISOString().split('T')[0])
   }
   document.addEventListener('click', handleClickOutside)
 })

 onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
 })

 const getServerDate = computed(() => {
   return props.profile?.server_datetime ?
       new Date(props.profile.server_datetime) :
       null
 })

 // Вычисляемые свойства
 const isToday = computed(() =>
//  new Date().toLocaleDateString() === props.modelValue.toLocaleDateString()
     props.modelValue === today.value
 )

 // Обновляем headerTitle
 const headerTitle = computed(() => {
   if (!getServerDate.value) return ''

   const selectedDateTime = new Date(props.modelValue)
   const serverDateTime = getServerDate.value

   // Сравниваем даты, игнорируя время
   const isToday = selectedDateTime.toISOString().split('T')[0] ===
       serverDateTime.toISOString().split('T')[0]

   if (isToday) {
     return t('reportToday')
   }

   const yesterday = new Date(serverDateTime)
   yesterday.setDate(yesterday.getDate() - 1)

   const isYesterday = selectedDateTime.toISOString().split('T')[0] ===
       yesterday.toISOString().split('T')[0]

   if (isYesterday) {
     return t('reportYesterday')
   }

   return t('reportForDate').replace('{date}', formatDateForDisplay(selectedDateTime))
 })

 const macrosPercentages = computed(() => {
  if (!dayStats.value || !props.profile) return [0, 0, 0]

  return [
   calculatePercentage(dayStats.value.total_proteins, props.profile.macro_proteins),
   calculatePercentage(dayStats.value.total_fats, props.profile.macro_fats),
   calculatePercentage(dayStats.value.total_carbs, props.profile.macro_carbs)
  ]
 })

 const formatNumber = (value: string | number | undefined | null): string => {
  if (value == null) return '0'
  return Math.round(Number(value)).toString()
 }

 const calculatePercentage = (current: string | number | null | undefined, target: number | null | undefined): number => {
  if (!current || !target) return 0
  return Math.round((Number(current) / target) * 100)
 }

 const isExceeded = (current: string | number | null | undefined, target: number | null | undefined): boolean => {
  if (!current || !target) return false
  return Number(current) > target
 }

 const handlePrevDay = () => {
   const date = new Date(props.modelValue)
   date.setDate(date.getDate() - 1)
   emit('update:modelValue', date.toISOString().split('T')[0])
 }
 const handleNextDay = () => {
   if (isToday.value) return
   const date = new Date(props.modelValue)
   date.setDate(date.getDate() + 1)
   emit('update:modelValue', date.toISOString().split('T')[0])
 }
 const toggleCalendar = (event: MouseEvent) => {
  event.stopPropagation()
  showCalendar.value = !showCalendar.value
 }

 const isFilledDate = (date: string) => {
  return props.mealStats?.filled_dates?.includes(date) ?? false
 }

 const closeCalendar = () => {
  showCalendar.value = false
 }

 const formatDate = (date: Date | string): string => {
   return new Date(date).toISOString().split('T')[0]
 }

 const isCurrentDate = (date: string) => {
  return formatDate(date) === props.modelValue
 }

 const getProgressBarColor = () => {
  const percentage = calculatePercentage(
   dayStats.value?.total_calories,
   props.profile?.target_calories
  )

  if (percentage > 100) return '#F04F4F'
  if (percentage >= 90) return '#10B981'
  return '#F59E0B'
 }

 const getMacrosChartOptions = () => ({
  chart: {
   fontFamily: 'inherit',
   toolbar: { show: false }
  },
  plotOptions: {
   radialBar: {
    hollow: {
     margin: 0,
     size: '35%'
    },
    track: {
     background: '#e5e7eb',
     margin: 1,
     strokeWidth: '12'
    },
    dataLabels: {
     show: false
    }
   }
  },
  stroke: {
   lineCap: 'round',
   dashArray: 0
  },
  colors: ['#319A6E', '#FDC755', '#FFA767']
 })

 const dayStats = computed(() => {
   if (!props.mealStats?.daily_stats?.length) return null
   const stats = props.mealStats.daily_stats.find(
       day => day.date === props.modelValue
   )
   if (!stats) return null

   interface MealGroup {
     meals: MealItem[]
   }

   // Группируем приемы пищи по времени (разница менее часа)
   const groupedMeals: MealGroup[] = []
   let currentGroup: MealGroup | null = null

   if (stats.meals) {
     // Сортируем приемы пищи по времени
     const sortedMeals = [...stats.meals].sort((a, b) =>
         new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
     )

     sortedMeals.forEach((meal) => {
       const mealTime = new Date(meal.created_at)

       if (!currentGroup || getTimeDifferenceInMinutes(
           new Date(currentGroup.meals[currentGroup.meals.length - 1].created_at),
           mealTime
       ) > 60) {
         if (currentGroup) {
           groupedMeals.push(currentGroup)
         }
         currentGroup = {
           meals: [meal]
         }
       } else {
         currentGroup.meals.push(meal)
       }
     })

     if (currentGroup) {
       groupedMeals.push(currentGroup)
     }
   }

   return {
     ...stats,
     meals_count: groupedMeals.length // Количество групп приемов пищи
   }
 })

 // Добавим функцию для подсчета разницы во времени
 const getTimeDifferenceInMinutes = (date1: Date, date2: Date): number => {
   return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60)
 }
</script>

<style>
 /* Кастомные стили для календаря Element Plus */
 .custom-calendar {
  --el-color-primary: #059669 !important; /* emerald-600 */
 }

 .custom-calendar .el-calendar__header {
  padding: 12px 20px;
 }

 .custom-calendar .el-button--primary {
  --el-button-bg-color: #059669;
  --el-button-border-color: #059669;
  --el-button-hover-bg-color: #047857;
  --el-button-hover-border-color: #047857;
 }

 .custom-calendar .el-button--primary.is-plain {
  --el-button-bg-color: #f1f5f9;
  --el-button-border-color: #e2e8f0;
  --el-button-hover-bg-color: #059669;
  --el-button-hover-border-color: #059669;
  --el-button-hover-text-color: white;
 }

 .custom-calendar .el-calendar-table td.is-selected .text-center,
 .custom-calendar .el-calendar-table td.is-selected
 {
  background-color: #059669;
  color: white;
 }

 .custom-calendar .el-calendar-table th {
  text-align: center;
  padding: 8px;
  color: #64748b;
 }

 .custom-calendar .el-calendar-table td {
  padding: 4px;
  text-align: center;
 }

 /* Кастомные стили для календаря Element Plus */
 .custom-calendar {
   --el-color-primary: #059669 !important; /* emerald-600 */
 }

 .custom-calendar .el-calendar__header {
   padding: 8px 12px; /* Уменьшаем отступы в шапке */
 }

 .custom-calendar {
   --el-color-primary: #059669 !important; /* emerald-600 */
   border-radius: 8px; /* Скругление для всего календаря */
   overflow: hidden; /* Чтобы содержимое не выходило за пределы скругления */
 }

 .custom-calendar .el-calendar__header {
   padding: 8px 12px;
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;
 }

 .custom-calendar .el-calendar__body {
   padding: 8px 12px;
   border-bottom-left-radius: 8px;
   border-bottom-right-radius: 8px;
 }

 /* Скругляем углы у таблицы */
 .custom-calendar .el-calendar-table {
   border-radius: 8px;
 }

 /* Скругляем углы у первой и последней ячеек в первой строке */
 .custom-calendar .el-calendar-table tr:first-child th:first-child {
   border-top-left-radius: 8px;
 }

 .custom-calendar .el-calendar-table tr:first-child th:last-child {
   border-top-right-radius: 8px;
 }

 /* Скругляем углы у первой и последней ячеек в последней строке */
 .custom-calendar .el-calendar-table tr:last-child td:first-child {
   border-bottom-left-radius: 8px;
 }

 .custom-calendar .el-calendar-table tr:last-child td:last-child {
   border-bottom-right-radius: 8px;
 }

 .custom-calendar .el-button--primary {
   --el-button-bg-color: #059669;
   --el-button-border-color: #059669;
   --el-button-hover-bg-color: #047857;
   --el-button-hover-border-color: #047857;
   height: 28px; /* Уменьшаем высоту кнопок */
   padding: 4px 12px; /* Уменьшаем padding кнопок */
 }

 .custom-calendar .el-button--primary.is-plain {
   --el-button-bg-color: #f1f5f9;
   --el-button-border-color: #e2e8f0;
   --el-button-hover-bg-color: #059669;
   --el-button-hover-border-color: #059669;
   --el-button-hover-text-color: white;
 }

 .custom-calendar .el-calendar-table td.is-selected .text-center,
 .custom-calendar .el-calendar-table td.is-selected {
   background-color: #059669;
   color: white;
 }

 .custom-calendar .el-calendar-table th {
   text-align: center;
   padding: 4px; /* Уменьшаем padding в заголовках */
   color: #64748b;
   font-size: 12px; /* Уменьшаем размер шрифта */
 }

 .custom-calendar .el-calendar-table td {
   padding: 2px; /* Уменьшаем padding в ячейках */
   text-align: center;
   height: 32px; /* Фиксируем высоту ячеек */
 }

 .custom-calendar .el-calendar-table .el-calendar-day {
   height: 28px; /* Уменьшаем высоту дней */
   line-height: 28px;
   font-size: 12px; /* Уменьшаем размер шрифта */
   padding: 0;
 }

 /* Стили для текста внутри ячеек */
 .custom-calendar .text-center {
   padding: 4px;
   line-height: 1;
 }

 .custom-calendar .cursor-not-allowed {
   pointer-events: none;
 }

 /* Уменьшаем размер шрифта в шапке календаря */
 .custom-calendar .el-calendar__header .el-button {
   font-size: 12px;
 }

 /* Уменьшаем отступы в заголовке текущего месяца */
 .custom-calendar .el-calendar__title {
   font-size: 14px;
   height: 28px;
   line-height: 28px;
 }

</style>