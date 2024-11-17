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
					<div class="h-[320px]">
						<apexchart
							:key="nutritionChartKey"
							:options="nutritionChartOptions"
							:series="nutritionChartOptions.series"
							height="100%"
						/>
					</div>
					<!-- Легенда графика -->
					<div class="flex flex-wrap justify-center gap-4 text-sm">
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 bg-[#f1e3cb] rounded" />
							<span>{{ t('calories') }} ({{ t('kcal') }})</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 bg-[#319A6E] rounded" />
							<span>{{ t('proteins') }} ({{ t('g') }})</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 bg-[#FDC755] rounded" />
							<span>{{ t('fats') }} ({{ t('g') }})</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-3 h-3 bg-[#FFA767] rounded" />
							<span>{{ t('carbs') }} ({{ t('g') }})</span>
						</div>
					</div>
				</div>

				<!-- После блока с графиком БЖУ и его легендой -->
				<!-- График веса -->
				<div class="space-y-4 mt-8 border-t pt-8">
					<!-- График веса -->
					<div class="h-[200px]">
						<apexchart
							:key="weightChartKey"
							:options="weightChartOptions"
							:series="weightChartOptions.series"
							height="100%"
						/>
					</div>
					<!-- Легенда графика веса -->
					<div class="flex justify-center text-sm">
						<div class="flex items-center gap-2">
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
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

const todayWeightLog = computed(() => {
  if (!chartsData.value?.weight.length) return null

  const today = new Date().toISOString().split('T')[0]
  return chartsData.value.weight.find(w => w.date === today)
})

// Обработчик обновления веса
const handleWeightUpdated = () => {
  fetchStatistics() // Перезагружаем статистику
}

// Types
interface ChartData {
  date: string
  value: number
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

interface CustomApexOptions extends ApexOptions {
  series: Array<{
    name: string
    type?: string
    data: (number | null)[] // Разрешаем null значения в данных
  }>
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
const formatDate = (date: string, period: string): string => {
  const dateObj = new Date(date)
  if (period === '3months') {
    // Для трехмесячного периода показываем даты каждые 5 дней
    const day = dateObj.getDate()
    if (day % 5 === 0) {
      return dateObj.toLocaleDateString('ru-RU', {
        month: 'short',
        year: 'numeric'
      })
    }
    return ''
  }
  // Для остальных периодов показываем месяц и год
  return dateObj.toLocaleDateString('ru-RU', {
    month: 'short',
    year: 'numeric'
  })
}

// Base chart options
const getComboChartOptions = (): CustomApexOptions => ({
  chart: {
    type: 'line',
    height: '100%',
    fontFamily: 'inherit',
    toolbar: {
      show: false,
      tools: {
        download: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      },
    },
    animations: {
      enabled: false // Отключаем анимации для лучшей производительности
    }
  },
  series: [],
  stroke: {
    width: [0, 3, 3, 3], // [calories, proteins, fats, carbs]
    curve: 'smooth'
  },
  colors: ['#f1e3cb', '#319A6E', '#FDC755', '#FFA767'],
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 4,
    hover: {
      size: 6
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '60%'
    }
  },
  grid: {
    show: true,
    borderColor: '#E5E7EB',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  xaxis: {
    type: 'category',
    categories: [],
    labels: {
      formatter: function(value: string) {
        return formatDate(value, selectedPeriod.value)
      },
      style: {
        fontSize: '10px',
        colors: '#6B7280'
      },
      rotateAlways: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: [
    {
      show: true,
      // floating: true,
    },
    {
      show: true,
      opposite: true,
    }
  ],
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    theme: 'light',
    style: {
      fontSize: '12px'
    },
    y: {
      formatter: (value: number | null) => {
        if (value === null || value === undefined) {
          return '-'
        }
        return `${value.toFixed(1)} ${t('g')}`
      }
    }
  },
  legend: {
    show: false // Скрываем легенду, так как она вынесена отдельно
  }
})

const getWeightChartOptions = (): CustomApexOptions => ({
  ...getComboChartOptions(), // Наследуем базовые опции
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  colors: ['#319A6E'],
  markers: {
    size: 4,
    hover: {
      size: 6
    }
  }
})
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
watch(chartsData, (newData) => {
  if (!newData) return

  if (newData.calories.length > 0 && newData.macros.proteins.length > 0) {
    const dates = newData.calories.map(item => item.date)
    const comboChartOptions = getComboChartOptions()

    comboChartOptions.xaxis = {
      ...comboChartOptions.xaxis,
      categories: dates
    }

    comboChartOptions.series = [
      {
        name: t('calories'),
        type: 'column',
        data: newData.calories.map(item => item.value)
      },
      {
        name: t('proteins'),
        type: 'line',
        data: newData.macros.proteins.map(item => item.value)
      },
      {
        name: t('fats'),
        type: 'line',
        data: newData.macros.fats.map(item => item.value)
      },
      {
        name: t('carbs'),
        type: 'line',
        data: newData.macros.carbs.map(item => item.value)
      }
    ]

    nutritionChartOptions.value = comboChartOptions
    nutritionChartKey.value++
  }

  // Update weight chart
  if (newData.calories.length > 0) {
    const dates = newData.calories.map(item => item.date)
    const newWeightOptions = getComboChartOptions() // Используем базовые настройки

    newWeightOptions.xaxis = {
      ...newWeightOptions.xaxis,
      categories: dates
    }

    newWeightOptions.series = [{
      name: t('weight'),
      type: 'line',
      data: dates.map(date => {
        const weightData = newData.weight.find(w => w.date === date)
        return weightData ? weightData.value : null
      })
    }]

    newWeightOptions.colors = ['#319A6E']
    newWeightOptions.stroke = {
      width: 3,
      curve: 'smooth'
    }

    newWeightOptions.yaxis = [{
      show: false,
      labels: {
        formatter: (value: number) => `${value} ${t('kg')}`
      }
    }]

    // Обновляем опции
    weightChartOptions.value = newWeightOptions
    weightChartKey.value++
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

// Initial fetch
fetchStatistics()
</script>