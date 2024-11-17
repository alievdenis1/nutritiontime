<template>
	<div class="w-full max-w-4xl bg-white rounded-lg">
		<!-- Селектор периода -->
		<div class="mt-4 flex border-b">
			<button
				v-for="period in periods"
				:key="period.value"
				class="flex-1 p-4 text-sm font-medium text-center transition-colors border-b-2"
				:class="[
					selectedPeriod === period.value
						? 'border-emerald-600 text-emerald-600'
						: 'border-transparent text-gray-500 hover:text-gray-700'
				]"
				@click="selectedPeriod = period.value"
			>
				{{ t(period.label) }}
			</button>
		</div>

		<div class="space-y-6">
			<!-- Загрузка -->
			<div
				v-if="statisticsLoading"
				class="flex justify-center py-8"
			>
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
			</div>

			<!-- Ошибка -->
			<div
				v-else-if="statisticsError"
				class="p-4 bg-red-50 text-red-600 rounded-md text-sm"
			>
				{{ statisticsError }}
			</div>

			<!-- Статистика -->
			<div
				v-else-if="statisticsData && chartsData"
			>
				<!-- Комбинированный график калорий и БЖУ -->
				<div
					v-if="chartsData.calories.length > 0 && chartsData.macros.proteins.length > 0"
				>
					<div class="h-[320px] mt-10">
						<div class="w-full flex justify-between text-sm pl-5 pr-10">
							<span>{{ t('kcal') }}.</span>
							<span>{{ t('g') }}.</span>
						</div>
						<apexchart
							:key="nutritionChartKey"
							:options="nutritionChartOptions"
							:series="nutritionChartOptions.series"
							height="100%"
						/>
					</div>
					<!-- Легенда графика -->
					<div class="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
						<button
							v-for="series in nutritionSeries"
							:key="series.id"
							class="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-all justify-center"
							:class="{ 'font-bold': series.visible }"
							@click="toggleSeries(series.id)"
						>
							<div
								class="w-3 h-3 rounded"
								:style="{ backgroundColor: series.color }"
							/>
							<span>{{ t(series.label) }} ({{ series.unit }})</span>
						</button>
					</div>
				</div>

				<!-- После блока с графиком БЖУ и его легендой -->
				<!-- График веса -->
				<div class="space-y-4 border-t pt-8">
					<!-- График веса -->
					<div class="h-[200px]">
						<div class="w-full flex justify-between text-sm pl-5 pr-10">
							<span>{{ t('kg') }}.</span>
						</div>
						<apexchart
							:key="weightChartKey"
							:options="weightChartOptions"
							:series="weightChartOptions.series"
							height="100%"
						/>
					</div>
					<!-- Легенда графика веса -->
					<div class="flex justify-center text-sm">
						<div class="flex items-center gap-2 mt-5">
							<div class="w-3 h-3 bg-[#319A6E] rounded" />
							<span>{{ t('weight') }} ({{ t('kg') }})</span>
						</div>
					</div>

					<WeightInput
						:current-log-id="todayWeightLog?.id"
						:current-weight="todayWeightLog?.weight"
						@updated="handleWeightUpdated"
					/>
				</div>

				<!-- Средние значения -->
				<div class="p-4 bg-white border border-gray-200 rounded-lg ">
					<h3 class="text-lg font-semibold mb-4 text-center">
						{{ t('averageValues') }}
					</h3>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<div class="text-sm text-gray-500 text-center">
								{{ t('calories') }}
							</div>
							<div class="font-medium text-center">
								{{ Math.round(statisticsData.averages.calories) }} {{ t('kcal') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 text-center">
								{{ t('proteins') }}
							</div>
							<div class="font-medium text-[#319A6E] text-center">
								{{ Math.round(statisticsData.averages.proteins) }} {{ t('g') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 text-center">
								{{ t('fats') }}
							</div>
							<div class="font-medium text-[#FDC755] text-center">
								{{ Math.round(statisticsData.averages.fats) }} {{ t('g') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 text-center">
								{{ t('carbs') }}
							</div>
							<div class="font-medium text-[#FFA767] text-center">
								{{ Math.round(statisticsData.averages.carbs) }} {{ t('g') }}
							</div>
						</div>
					</div>
				</div>

				<!-- Прогресс веса -->
				<h3 class="text-lg font-semibold mb-4 text-center">
					{{ t('progress_weight') }}
				</h3>
				<div
					v-if="statisticsData?.weight_progress"
					class="grid grid-cols-2 gap-4 mb-4"
				>
					<div>
						<div class="text-sm text-gray-500 text-center">
							{{ t('startWeight') }}
						</div>
						<div class="font-medium text-center">
							{{ statisticsData.weight_progress.start }} {{ t('kg') }}
						</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 text-center">
							{{ t('currentWeight') }}
						</div>
						<div class="font-medium text-center">
							{{ statisticsData.weight_progress.current }} {{ t('kg') }}
						</div>
					</div>
				</div>
				<div>
					<div class="text-sm text-gray-500 text-center">
						{{ t('weightChange') }}
					</div>
					<div
						class="font-medium text-center"
						:class="{
							'text-red-500': statisticsData.weight_progress?.change > 0,
							'text-emerald-500': statisticsData.weight_progress?.change < 0
						}"
					>
						{{ statisticsData.weight_progress?.change > 0 ? '+' : '' }}
						{{ statisticsData.weight_progress?.change }} {{ t('kg') }}
					</div>
				</div>

				<!-- Суммарная статистика -->
				<div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="p-4 bg-emerald-50 rounded-2xl">
						<h3 class="mt-5 text-lg font-semibold mb-4 text-center">
							{{ t('summary') }}
						</h3>
						<div class="text-sm text-gray-500 mb-2 text-center">
							{{ t('totalMeals') }}: {{ statisticsData.summary.total_meals }}
						</div>
						<div class="text-sm text-gray-500 mb-2 text-center">
							{{ t('daysTracked') }}: {{ statisticsData.summary.days_tracked }}
						</div>
						<div class="text-sm text-gray-500 mb-2 text-center">
							{{ t('averageMealsPerDay') }}: {{ statisticsData.summary.average_meals_per_day }}
						</div>

						<!-- Достижение целей -->
						<div
							v-if="statisticsData.goals_achievement"
						>
							<h3 class="mt-5 text-lg font-semibold mb-4 text-center">
								{{ t('goalsAchievement') }}
							</h3>
							<div class="text-sm text-gray-500 mb-2 text-center">
								{{ t('loggingConsistency') }}: {{ Math.round(statisticsData.goals_achievement.logging_consistency) }}%
							</div>
							<div class="text-sm text-gray-500 mb-2 text-center">
								{{ t('caloriesTargetHit') }}: {{ Math.round(statisticsData.goals_achievement.calories_target_hit) }}%
							</div>
							<div class="text-sm text-gray-500 mb-5 text-center">
								{{ t('proteinsTargetHit') }}: {{ Math.round(statisticsData.goals_achievement.proteins_target_hit) }}%
							</div>
						</div>
					</div>
				</div>

				<!-- Нет данных -->
				<div
					v-if="!hasAnyData"
					class="text-center py-8 text-gray-500"
				>
					{{ t('noData') }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './ProfileStats.localization.json'
import { getStatistics } from '../api'
import type { ApexOptions } from 'apexcharts'
import { WeightInput } from './index'

type YAxisOptions = {
  seriesName?: string
  title?: {
    text: string
  }
  min?: number
  show?: boolean
  opposite?: boolean
  labels?: {
    formatter?: (value: number) => string
  }
}
interface CustomApexOptions extends ApexOptions {
  series: Array<{
    name: string
    type?: 'line' | 'column'
    color?: string
    data: (number | null)[]
    yAxisIndex?: number
  }>
  yaxis?: YAxisOptions | YAxisOptions[]
}

interface ChartData {
  date: string
  value: number
}

interface MacrosData {
  proteins: ChartData[]
  fats: ChartData[]
  carbs: ChartData[]
}

interface ChartsData {
  calories: ChartData[]
  macros: MacrosData
  weight: ChartData[]
}

// Тип для серии данных
interface NutritionSeries {
  id: 'calories' | 'proteins' | 'fats' | 'carbs'
  label: string
  color: string
  visible: boolean
  unit: string
  type: 'column' | 'line'
}

// Обновленное определение серий с явным указанием типа
const nutritionSeries = ref<NutritionSeries[]>([
  {
    id: 'calories',
    label: 'calories',
    color: '#f1e3cb',
    visible: true,
    unit: 'ккал',
    type: 'column'
  },
  {
    id: 'proteins',
    label: 'proteins',
    color: '#319A6E',
    visible: true,
    unit: 'г',
    type: 'line'
  },
  {
    id: 'fats',
    label: 'fats',
    color: '#FDC755',
    visible: true,
    unit: 'г',
    type: 'line'
  },
  {
    id: 'carbs',
    label: 'carbs',
    color: '#FFA767',
    visible: true,
    unit: 'г',
    type: 'line'
  }
])

// Функция для получения данных серии
const getSeriesData = (data: ChartsData | null, seriesId: NutritionSeries['id']): number[] => {
  if (!data) return []

  if (seriesId === 'calories') {
    return data.calories.map(item => item.value)
  }
  return data.macros[seriesId].map(item => item.value)
}

// Обновление графиков с учетом видимости серий
const updateCharts = () => {
  if (!chartsData.value) return

  const dates = chartsData.value.calories.map(item => new Date(item.date).getTime())

  // Обновляем оба графика с одинаковыми настройками дат
  const commonXAxisSettings = {
    ...getComboChartOptions().xaxis,
    categories: dates
  }

  // Сначала подготовим все серии независимо от их видимости
  const allSeries = nutritionSeries.value.map(s => ({
    id: s.id,
    name: t(s.label),
    type: s.type,
    color: s.color,
    data: getSeriesData(chartsData.value, s.id),
    visible: s.visible
  }))

  // Отделяем калории от остальных серий
  const caloriesSeries = allSeries.find(s => s.id === 'calories')
  const nutrientSeries = allSeries.filter(s => s.id !== 'calories')

  // Формируем финальные серии для отображения
  const visibleSeries = []

  // Добавляем калории, если они видимы
  if (caloriesSeries?.visible) {
    visibleSeries.push({
      name: caloriesSeries.name,
      type: caloriesSeries.type,
      color: caloriesSeries.color,
      data: caloriesSeries.data,
      yAxisIndex: 0 // Калории всегда на первой оси
    })
  }

  // Добавляем видимые нутриенты
  nutrientSeries
      .filter(s => s.visible)
      .forEach(series => {
        visibleSeries.push({
          name: series.name,
          type: series.type,
          color: series.color,
          data: series.data,
          yAxisIndex: 1 // Нутриенты всегда на второй оси
        })
      })

  // Формируем настройки осей
  const yAxisConfig = [
    {
      seriesName: 'calories',
      min: 0,
      show: caloriesSeries?.visible ?? false,
      labels: {
        formatter: (value: number) => `${Math.round(value)}`
      }
    },
    {
      seriesName: 'nutrients',
      opposite: true,
      min: 0,
      show: nutrientSeries.some(s => s.visible),
      labels: {
        formatter: (value: number) => `${Math.round(value)}`
      }
    }
  ]

  // Обновляем настройки графика
  nutritionChartOptions.value = {
    ...getComboChartOptions(),
    series: visibleSeries,
    xaxis: commonXAxisSettings,
    yaxis: yAxisConfig
  }

  // Добавляем отладочную информацию
  console.log('Chart update:', {
    visibleSeries: visibleSeries.map(s => ({ name: s.name, visible: true })),
    yAxisConfig: yAxisConfig.map(axis => ({ show: axis.show })),
    hasVisibleNutrients: nutrientSeries.some(s => s.visible),
    totalSeriesCount: visibleSeries.length
  })

  nutritionChartKey.value++
}

// Обновленная функция переключения видимости
const toggleSeries = (seriesId: string) => {
  const series = nutritionSeries.value.find(s => s.id === seriesId)
  if (series) {
    series.visible = !series.visible
    console.log(`Toggling series ${seriesId}:`, {
      newVisibility: series.visible,
      allSeries: nutritionSeries.value.map(s => ({ id: s.id, visible: s.visible }))
    })
    updateCharts()
  }
}

const updateWeightChart = (newData: ChartsData) => {
  if (!newData.weight.length) return

  const dates = newData.calories.map(item => new Date(item.date).getTime())
  const weightOptions = getWeightChartOptions()

  weightChartOptions.value = {
    ...weightOptions,
    series: [{
      name: t('weight'),
      type: 'line',
      data: dates.map(timestamp => {
        const date = new Date(timestamp).toISOString().split('T')[0]
        const weightData = newData.weight.find(w => w.date === date)
        return weightData ? weightData.value : null
      })
    }],
    xaxis: {
      ...weightOptions.xaxis,
      type: 'datetime',
      categories: dates,
      labels: {
        formatter: function(value: string) {
          return formatDate(value, selectedPeriod.value)
        },
        style: {
          fontSize: '10px',
          colors: '#6B7280'
        },
        rotateAlways: false,
        hideOverlappingLabels: true,
        maxHeight: 50
      }
    }
  }

  weightChartKey.value++
}

// Обработчик обновления веса
const handleWeightUpdated = () => {
  fetchStatistics() // Перезагружаем статистику
}

export interface StatisticsResponse {
  period: {
    start: string
    end: string
  }
  summary: {
    total_meals: number
    days_tracked: number
    average_meals_per_day: number
  }
  averages: {
    calories: number
    proteins: number
    fats: number
    carbs: number
  }
  charts: {
    calories: ChartData[]
    macros: {
      proteins: ChartData[]
      fats: ChartData[]
      carbs: ChartData[]
    }
    weight: ChartData[]
  }
  weight_progress?: {
    start: number
    current: number
    change: number
  } | null
  goals_achievement?: {
    logging_consistency: number
    calories_target_hit: number
    proteins_target_hit: number
  } | null
}

// Translations
const { t } = useTranslation(localization)

// State
const statisticsData = ref<StatisticsResponse | null>(null)
const statisticsLoading = ref(false)
const statisticsError = ref<string | null>(null)
const selectedPeriod = ref('week')

// Chart keys for forcing re-render
const nutritionChartKey = ref(0)
const weightChartKey = ref(0)

// Date formatting
// Форматирование даты с учетом периода
// Обновленная функция форматирования даты
// Base chart options
const getComboChartOptions = (): CustomApexOptions => {
  const baseOptions: CustomApexOptions = {
    chart: {
      type: 'line',
      height: '100%',
      fontFamily: 'inherit',
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      },
      stacked: false
    },
    // Добавляем пустой массив series в базовые настройки
    series: [],
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '60%'
      }
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number | null, { seriesIndex }) => {
          if (value === null || value === undefined) return '-'
          const series = nutritionSeries.value[seriesIndex]
          return `${value.toFixed(1)} ${series.unit}`
        }
      }
    },
    legend: {
      show: false
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function(value: string) {
          return formatDate(value, selectedPeriod.value)
        },
        style: {
          fontSize: '10px',
          colors: '#6B7280'
        },
        rotateAlways: false,
        hideOverlappingLabels: true, // Скрываем перекрывающиеся метки
        maxHeight: 50
      },
      tickAmount: selectedPeriod.value === 'week' ? 7 :
          selectedPeriod.value === 'month' ? 6 : 9, // Контролируем количество отображаемых тиков
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: true
      }
    },
  }

  return baseOptions
}

const getWeightChartOptions = (): CustomApexOptions => {
  const baseOptions = getComboChartOptions()
  return {
    ...baseOptions,
    chart: {
      type: 'line',
      height: '100%',
      fontFamily: 'inherit',
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      }
    },
    colors: ['#319A6E'], // Зеленый цвет для графика веса
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    markers: {
      size: 4,
      colors: ['#319A6E'],
      strokeColors: '#319A6E',
      hover: {
        size: 6
      }
    },
    yaxis: {
      show: true,
      labels: {
        formatter: (value: number) => `${value.toFixed(1)}`
      },
      min: undefined, // Позволяем ApexCharts автоматически определить минимум
    },
    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: (value: number | null) => {
          if (value === null || value === undefined) return '-'
          return `${value.toFixed(1)} кг`
        }
      }
    }
  }
}
// Initialize chart options
const nutritionChartOptions = ref<CustomApexOptions>(getComboChartOptions())
const weightChartOptions = ref<CustomApexOptions>(getWeightChartOptions())

// Helper function to validate chart data
const getValidChartData = (data: ChartData[] | undefined): ChartData[] => {
  return Array.isArray(data) ? data.filter(item => item && typeof item.value === 'number') : []
}

// Computed properties
const chartsData = computed(() => {
  if (!statisticsData.value) return null

  return {
    calories: getValidChartData(statisticsData.value.charts.calories),
    macros: {
      proteins: getValidChartData(statisticsData.value.charts.macros?.proteins),
      fats: getValidChartData(statisticsData.value.charts.macros?.fats),
      carbs: getValidChartData(statisticsData.value.charts.macros?.carbs)
    },
    weight: getValidChartData(statisticsData.value.charts.weight)
  }
})

const hasAnyData = computed(() => {
  const data = chartsData.value
  if (!data) return false

  return (
      (data.calories.length > 0 && data.macros.proteins.length > 0) ||
      data.weight.length > 0
  )
})

// Methods
const fetchStatistics = async () => {
  statisticsLoading.value = true
  statisticsError.value = null

  try {
    const statsApi = getStatistics(selectedPeriod.value)
    await statsApi.execute()

    if (statsApi.error.value) {
      statisticsError.value = statsApi.error.value
    } else {
      statisticsData.value = statsApi.data.value
    }
  } catch (error) {
    statisticsError.value = error instanceof Error ? error.message : String(error)
  } finally {
    statisticsLoading.value = false
  }
}

// Watchers
// Обновляем watch для chartsData
watch(chartsData, (newData) => {
  if (!newData) return

  if (newData.calories.length > 0 && newData.macros.proteins.length > 0) {
    updateCharts()
  }

  if (newData.weight.length > 0) {
    updateWeightChart(newData)
  }
})

watch(selectedPeriod, () => {
  fetchStatistics()
})

const periods = [
  { value: 'week', label: 'week' },
  { value: 'month', label: 'month' },
  { value: '3months', label: '3months' }
]

const formatDate = (dateValue: string | number, period: string): string => {
  const date = new Date(dateValue)

  // Функция для форматирования в нужный вид (DD.MM.YY)
  const formatToPattern = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}.${month}.${year}`
  }

  // Определяем частоту отображения дат в зависимости от периода
  const shouldShowDate = (date: Date): boolean => {
    const day = date.getDate()

    switch (period) {
      case 'week':
        // Для недели показываем каждый день
        return true
      case 'month':
        // Для месяца показываем каждые 5 дней и последний день месяца
        return day % 5 === 0 || day === getLastDayOfMonth(date)
      case '3months':
        // Для 3 месяцев показываем каждые 10 дней и последние дни месяцев
        return day % 10 === 0 || day === getLastDayOfMonth(date)
      default:
        return true
    }
  }

  // Вспомогательная функция для определения последнего дня месяца
  const getLastDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  return shouldShowDate(date) ? formatToPattern(date) : ''
}

// Initial fetch
fetchStatistics()
</script>