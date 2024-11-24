// StatisticsTab.vue
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
					<div class="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 text-sm">
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
						:today-weight="todayWeight"
						@updated="handleWeightUpdated"
					/>
				</div>

				<!-- Прогресс веса -->
				<h3 class="text-lg font-semibold my-4 text-center">
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
							{{ statisticsData.weight_progress.current ?? '-' }} {{ t('kg') }}
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
							'text-red': (statisticsData.weight_progress?.change ?? 0) > 0,
							'text-forestGreen': (statisticsData.weight_progress?.change ?? 0) < 0
						}"
					>
						{{ (statisticsData.weight_progress?.change ?? 0) > 0 ? '+' : '' }}
						{{ statisticsData.weight_progress?.change ?? '-' }} {{ t('kg') }}
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
								{{ t('caloriesAverage') }}: {{ Math.round(statisticsData.goals_achievement.calories_average) }}%
							</div>
							<div class="text-sm text-gray-500 mb-2 text-center">
								{{ t('proteinsAverage') }}: {{ Math.round(statisticsData.goals_achievement.proteins_average) }}%
							</div>
							<div class="text-sm text-gray-500 mb-2 text-center">
								{{ t('fatsAverage') }}: {{ Math.round(statisticsData.goals_achievement.fats_average) }}%
							</div>
							<div class="text-sm text-gray-500 mb-5 text-center">
								{{ t('carbsAverage') }}: {{ Math.round(statisticsData.goals_achievement.carbs_average) }}%
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
import { StatisticsResponse, ChartsData, ChartData } from '../model'
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

  let values: ChartData[] = []
  if (seriesId === 'calories') {
    values = data.calories
  } else {
    values = data.macros[seriesId]
  }

  // Проверяем наличие данных и преобразуем их
  if (!values || values.length === 0) return []

  return values.map(item => item.value)
}

// Обновляем интерфейсы
interface TooltipContext {
  seriesIndex: number;
  w: {
    config: {
      series: Array<{
        name: string;
      }>;
    };
  };
}

interface YAxisConfig {
  seriesName?: string;
  title?: {
    text: string;
  };
  min?: number;
  show?: boolean;
  opposite?: boolean;
  labels?: {
    formatter: (value: number) => string;
  };
}

// Обновление графиков с учетом видимости серий
const updateCharts = () => {
  if (!chartsData.value) return

  const { start, end } = getDateRange(selectedPeriod.value)
  const dates = generateDateRange(start, end)

  const visibleSeries = nutritionSeries.value
      .filter(s => s.visible)
      .map(series => ({
        name: t(series.label),
        type: series.type as 'line' | 'column',
        color: series.color,
        data: getSeriesData(chartsData.value, series.id)
      }))

  if (visibleSeries.length === 0) {
    nutritionChartOptions.value = getComboChartOptions()
    nutritionChartKey.value++
    return
  }

  const hasCalories = visibleSeries.some(s => s.name === t('calories'))
  const hasNutrients = visibleSeries.some(s => s.name !== t('calories'))

  const baseOptions: CustomApexOptions = {
    ...getComboChartOptions(),
    series: visibleSeries,
    chart: {
      ...getComboChartOptions().chart,
      type: 'line',
      animations: {
        enabled: true,
        speed: 800
      }
    },
    xaxis: {
      ...getComboChartOptions().xaxis,
      categories: dates,
      type: 'datetime'
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, context: TooltipContext) => {
          if (value === null || value === undefined) return '-'
          const seriesName = context.w.config.series[context.seriesIndex].name
          const unit = seriesName === t('calories') ? t('kcal') : t('g')
          return `${value.toFixed(1)} ${unit}`
        }
      }
    }
  }

  // Настройка осей в зависимости от видимых серий
  if (hasCalories && !hasNutrients) {
    // Только калории
    const yAxisConfig: YAxisConfig = {
      min: 0,
      labels: {
        formatter: (value: number) => `${Math.round(value)}`
      }
    }

    nutritionChartOptions.value = {
      ...baseOptions,
      yaxis: yAxisConfig
    }
  } else if (!hasCalories && hasNutrients) {
    // Только нутриенты
    const yAxisConfig: YAxisConfig = {
      min: 0,
      labels: {
        formatter: (value: number) => `${Math.round(value)}`
      }
    }

    nutritionChartOptions.value = {
      ...baseOptions,
      yaxis: yAxisConfig
    }
  } else {
    // Обе оси
    const yAxisConfig: YAxisConfig[] = [
      {
        min: 0,
        labels: {
          formatter: (value: number) => `${Math.round(value)}`
        }
      },
      {
        opposite: true,
        min: 0,
        labels: {
          formatter: (value: number) => `${Math.round(value)}`
        }
      }
    ]

    nutritionChartOptions.value = {
      ...baseOptions,
      yaxis: yAxisConfig
    }
  }

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

  const { start, end } = getDateRange(selectedPeriod.value)
  const dates = generateDateRange(start, end)

  // Заполняем пропущенные дни последним известным весом
  const weightValues = fillMissingWeightData(newData.weight, dates)

  weightChartOptions.value = {
    ...getWeightChartOptions(),
    series: [{
      name: t('weight'),
      type: 'line',
      data: weightValues
    }],
    xaxis: {
      type: 'datetime',
      categories: dates,
      tickAmount: selectedPeriod.value === 'week' ? 5 :
          selectedPeriod.value === 'month' ? 6 : 9,
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
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5,
      colors: ['#fff'],
      strokeColors: '#319A6E',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    }
  }

  weightChartKey.value++
}
// Обработчик обновления веса
const handleWeightUpdated = () => {
  fetchStatistics() // Перезагружаем статистику
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
const getComboChartOptions = (): CustomApexOptions => ({
  chart: {
    type: 'line',
    height: '100%',
    fontFamily: 'inherit',
    toolbar: {
      show: false
    },
    animations: {
      enabled: false,
    }
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
      hideOverlappingLabels: true,
      maxHeight: 50
    },
    tickAmount: selectedPeriod.value === 'week' ? 5 :
        selectedPeriod.value === 'month' ? 6 : 9
  },
  legend: {
    show: false // Отключаем встроенную легенду
  },
  series: [] // добавляем пустой массив серий по умолчанию
})
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

const todayWeight = computed(() => {
  if (!statisticsData.value?.charts.weight.length) return null

  const today = new Date().toISOString().split('T')[0]
  const lastWeight = statisticsData.value.charts.weight.find(
      entry => entry.date === today
  )

  return lastWeight ? {
    weight: lastWeight.value,
    date: lastWeight.date
  } : null
})

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
  const date = new Date(Number(dateValue))

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
        return true
      case 'month':
        return day % 5 === 0 || day === getLastDayOfMonth(date)
      case '3months':
        return day % 10 === 0 || day === getLastDayOfMonth(date)
      default:
        return true
    }
  }

  const getLastDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  return shouldShowDate(date) ? formatToPattern(date) : ''
}

// Функция для получения диапазона дат в зависимости от периода
const getDateRange = (period: string) => {
  const end = new Date() // Сегодняшний день
  const start = new Date()

  switch(period) {
    case 'week':
      start.setDate(end.getDate() - 6) // последние 7 дней включая сегодня
      break
    case 'month':
      start.setDate(end.getDate() - 29) // последние 30 дней включая сегодня
      break
    case '3months':
      start.setDate(end.getDate() - 89) // последние 90 дней включая сегодня
      break
  }

  return { start, end }
}

// Функция для генерации массива дат
const generateDateRange = (start: Date, end: Date) => {
  const dates = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(new Date(current).getTime())
    current.setDate(current.getDate() + 1)
  }

  return dates
}

// Обновляем функцию заполнения данных
const fillMissingWeightData = (weightData: ChartData[], dates: number[]): (number | null)[] => {
  // Для одной точки заполняем только два дня
  if (weightData.length === 1) {
    return dates.map(timestamp => {
      const currentDate = new Date(timestamp).toISOString().split('T')[0]
      const weightDate = new Date(weightData[0].date)
      const prevDate = new Date(weightDate)
      prevDate.setDate(prevDate.getDate() - 1)

      if (currentDate === weightData[0].date ||
          currentDate === prevDate.toISOString().split('T')[0]) {
        return weightData[0].value
      }
      return null
    })
  }

  const sortedWeightData = [...weightData].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return dates.map(timestamp => {
    const currentDate = new Date(timestamp).toISOString().split('T')[0]
    const weightDataPoint = sortedWeightData.find(w => w.date === currentDate)

    if (weightDataPoint) {
      // Нашли запись для текущей даты
      return weightDataPoint.value
    }

    // Проверяем, является ли текущая дата предыдущим днем для какой-либо записи
    const isNextDayWeight = sortedWeightData.find(w => {
      const weightDate = new Date(w.date)
      const prevDate = new Date(weightDate)
      prevDate.setDate(prevDate.getDate() - 1)
      return currentDate === prevDate.toISOString().split('T')[0]
    })

    if (isNextDayWeight) {
      return isNextDayWeight.value
    }

    return null
  })
}

// Initial fetch
fetchStatistics()
</script>