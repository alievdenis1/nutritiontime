<template>
	<div class="space-y-4">
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
					class="text-lg"
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

		<VLoading
			v-if="loading"
			class="h-64"
		/>

		<div
			v-if="dayStats"
			class="p-6 bg-white rounded-lg shadow-sm"
		>
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
 import type { Profile, MealStats } from '../model'
 import localization from './ProfileStats.localization.json'
 import { MealsList } from './index'
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

 const formatDateWithTimezone = (date: string | Date, timezone: number): string => {
   // Создаем дату в UTC
   const d = new Date(date)
   // Получаем текущее смещение пользователя в минутах
   const userTimezoneOffset = timezone * 60
   // Получаем смещение системы в минутах
   const systemOffset = new Date().getTimezoneOffset()
   // Вычисляем разницу в миллисекундах, учитывая оба смещения
   const offsetDiff = (userTimezoneOffset + systemOffset) * 60 * 1000

   // Создаем новую дату с учетом смещения
   const adjustedDate = new Date(d.getTime() + offsetDiff)
   return adjustedDate.toISOString().split('T')[0]
 }

 const getCurrentDateWithTimezone = (timezone: number): Date => {
   const now = new Date()
   const userTimezoneOffset = timezone * 60
   const systemOffset = now.getTimezoneOffset()
   const offsetDiff = (userTimezoneOffset + systemOffset) * 60 * 1000
   return new Date(now.getTime() + offsetDiff)
 }

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
   const timezone = props.profile?.timezone || 0
   return formatDateWithTimezone(getCurrentDateWithTimezone(timezone), timezone)
 })

 // Добавляем проверку на будущий месяц
 const isNextMonthDisabled = (chosenDate: Date | string) => {
  const nextMonth = new Date(chosenDate).getMonth() + 1
  const todayMonth = new Date(today.value).getMonth()

  return nextMonth > todayMonth
 }
 // Добавляем проверку на будущую дату
 const isFutureDate = (date: string) => {
   const timezone = props.profile?.timezone || 0
   const selectedDate = new Date(formatDateWithTimezone(date, timezone))
   const currentDate = new Date(today.value)

   selectedDate.setHours(0, 0, 0, 0)
   currentDate.setHours(0, 0, 0, 0)

   return selectedDate > currentDate
 }
 // Добавляем обработчик клика по дате
 const handleDateClick = (date: string) => {
   const timezone = props.profile?.timezone || 0
   if (isFutureDate(date)) {
     return
   }
   emit('update:modelValue', formatDateWithTimezone(new Date(date), timezone))
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
     const timezone = props.profile?.timezone || 0
     if (!isFutureDate(value.toISOString())) {
       emit('update:modelValue', formatDateWithTimezone(value, timezone))
       if (calendarDateType.value !== 'next-month' && calendarDateType.value !== 'prev-month') {
         showCalendar.value = false
       }
      }
      calendarDateType.value = null
   }
 })

 // Форматирование даты для отображения
 const formatDateForDisplay = (date: string | Date): string => {
   const d = new Date(date)
   return d.toLocaleDateString('ru-RU', {
     timeZone: `Etc/GMT${props.profile?.timezone && props.profile.timezone > 0 ? '-' : '+'}${Math.abs(props.profile?.timezone || 0)}`
   })
 }

 // Закрытие календаря при клике вне
 const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.el-calendar') && showCalendar.value) {
   showCalendar.value = false
  }
 }

 onMounted(() => {
   if (props.profile?.timezone) {
     emit('update:modelValue', formatDateWithTimezone(new Date(), props.profile.timezone))
   }
  document.addEventListener('click', handleClickOutside)
 })

 onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
 })

 // Вычисляемые свойства
 const isToday = computed(() =>
     props.modelValue === today.value
 )

 // Обновляем headerTitle
 const headerTitle = computed(() => {
   const timezone = props.profile?.timezone || 0
   const date = new Date(props.modelValue)
   const currentDate = getCurrentDateWithTimezone(timezone)

   if (formatDateWithTimezone(date, timezone) === formatDateWithTimezone(currentDate, timezone)) {
     return t('reportToday')
   }

   const yesterdayDate = new Date(currentDate)
   yesterdayDate.setDate(yesterdayDate.getDate() - 1)

   if (formatDateWithTimezone(date, timezone) === formatDateWithTimezone(yesterdayDate, timezone)) {
     return t('reportYesterday')
   }

   return t('reportForDate').replace('{date}', formatDateForDisplay(date))
 })

 const dayStats = computed(() => {
  if (!props.mealStats?.daily_stats?.length) return null
  return props.mealStats.daily_stats.find(
   day => day.date === props.modelValue
  ) ?? null
 })

 const macrosPercentages = computed(() => {
  if (!dayStats.value || !props.profile) return [0, 0, 0]

  return [
   calculatePercentage(dayStats.value.total_proteins, props.profile.macro_proteins),
   calculatePercentage(dayStats.value.total_fats, props.profile.macro_fats),
   calculatePercentage(dayStats.value.total_carbs, props.profile.macro_carbs)
  ]
 })

 // Методы
 const formatDate = (date: Date | string): string => {
   return formatDateWithTimezone(date, props.profile?.timezone || 0)
 }

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
   const timezone = props.profile?.timezone || 0
   const date = new Date(props.modelValue)
   // Вычитаем один день (24 часа)
   date.setDate(date.getDate() - 1)
   emit('update:modelValue', formatDateWithTimezone(date, timezone))
 }
 const handleNextDay = () => {
   if (isToday.value) return
   const timezone = props.profile?.timezone || 0
   const date = new Date(props.modelValue)
   // Добавляем один день (24 часа)
   date.setDate(date.getDate() + 1)
   emit('update:modelValue', formatDateWithTimezone(date, timezone))
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