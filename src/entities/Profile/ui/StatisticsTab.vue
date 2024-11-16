<template>
	<div class="w-full max-w-4xl p-4 bg-white rounded-lg shadow">
		<div class="space-y-6">
			<!-- Селектор периода -->
			<div class="flex items-center justify-between">
				<label class="text-sm font-medium">{{ t('selectPeriod') }}</label>
				<select
					v-model="selectedPeriod"
					class="p-2 border rounded-md bg-white text-sm"
					@change="fetchStatistics"
				>
					<option value="week">
						{{ t('week') }}
					</option>
					<option value="month">
						{{ t('month') }}
					</option>
					<option value="3months">
						{{ t('3months') }}
					</option>
				</select>
			</div>

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
				class="space-y-8"
			>
				<!-- Суммарная статистика -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="p-4 bg-emerald-50 rounded-lg">
						<div class="text-sm text-gray-500">
							{{ t('totalMeals') }}
						</div>
						<div class="text-2xl font-semibold text-gray-900">
							{{ statisticsData.summary.total_meals }}
						</div>
					</div>
					<div class="p-4 bg-emerald-50 rounded-lg">
						<div class="text-sm text-gray-500">
							{{ t('daysTracked') }}
						</div>
						<div class="text-2xl font-semibold text-gray-900">
							{{ statisticsData.summary.days_tracked }}
						</div>
					</div>
					<div class="p-4 bg-emerald-50 rounded-lg">
						<div class="text-sm text-gray-500">
							{{ t('averageMealsPerDay') }}
						</div>
						<div class="text-2xl font-semibold text-gray-900">
							{{ statisticsData.summary.average_meals_per_day }}
						</div>
					</div>
				</div>

				<!-- Средние значения -->
				<div class="p-4 bg-white border border-gray-200 rounded-lg">
					<h3 class="text-lg font-semibold mb-4">
						{{ t('averageValues') }}
					</h3>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<div class="text-sm text-gray-500">
								{{ t('calories') }}
							</div>
							<div class="font-medium">
								{{ Math.round(statisticsData.averages.calories) }} {{ t('kcal') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('proteins') }}
							</div>
							<div class="font-medium text-[#319A6E]">
								{{ Math.round(statisticsData.averages.proteins) }} {{ t('g') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('fats') }}
							</div>
							<div class="font-medium text-[#FDC755]">
								{{ Math.round(statisticsData.averages.fats) }} {{ t('g') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('carbs') }}
							</div>
							<div class="font-medium text-[#FFA767]">
								{{ Math.round(statisticsData.averages.carbs) }} {{ t('g') }}
							</div>
						</div>
					</div>
				</div>

				<!-- Комбинированный график калорий и БЖУ -->
				<div
					v-if="chartsData.calories.length > 0 && chartsData.macros.proteins.length > 0"
					class="p-4 bg-white border border-gray-200 rounded-lg space-y-2"
				>
					<h3 class="text-lg font-semibold">
						{{ t('nutritionChartTitle') }}
					</h3>
					<div class="h-[350px]">
						<apexchart
							:key="nutritionChartKey"
							:options="nutritionChartOptions"
							:series="nutritionChartOptions.series"
							height="100%"
						/>
					</div>
				</div>

				<!-- График веса -->
				<div
					v-if="chartsData.weight.length > 0"
					class="p-4 bg-white border border-gray-200 rounded-lg space-y-2"
				>
					<h3 class="text-lg font-semibold">
						{{ t('weightChartTitle') }}
					</h3>
					<!-- Прогресс веса -->
					<div
						v-if="statisticsData.weight_progress"
						class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4"
					>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('startWeight') }}
							</div>
							<div class="font-medium">
								{{ statisticsData.weight_progress.start }} {{ t('kg') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('currentWeight') }}
							</div>
							<div class="font-medium">
								{{ statisticsData.weight_progress.current }} {{ t('kg') }}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('weightChange') }}
							</div>
							<div
								class="font-medium"
								:class="{
									'text-red-500': statisticsData.weight_progress.change > 0,
									'text-emerald-500': statisticsData.weight_progress.change < 0
								}"
							>
								{{ statisticsData.weight_progress.change > 0 ? '+' : '' }}
								{{ statisticsData.weight_progress.change }} {{ t('kg') }}
							</div>
						</div>
					</div>
					<div class="h-[350px]">
						<apexchart
							:key="weightChartKey"
							:options="weightChartOptions"
							:series="weightChartOptions.series"
							height="100%"
						/>
					</div>
				</div>

				<!-- Достижение целей -->
				<div
					v-if="statisticsData.goals_achievement"
					class="p-4 bg-white border border-gray-200 rounded-lg"
				>
					<h3 class="text-lg font-semibold mb-4">
						{{ t('goalsAchievement') }}
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<div class="text-sm text-gray-500">
								{{ t('loggingConsistency') }}
							</div>
							<div class="font-medium">
								{{ Math.round(statisticsData.goals_achievement.logging_consistency) }}%
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('caloriesTargetHit') }}
							</div>
							<div class="font-medium">
								{{ Math.round(statisticsData.goals_achievement.calories_target_hit) }}%
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-500">
								{{ t('proteinsTargetHit') }}
							</div>
							<div class="font-medium">
								{{ Math.round(statisticsData.goals_achievement.proteins_target_hit) }}%
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
    data: number[]
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
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    },
    stacked: false
  },
  series: [],
  stroke: {
    width: [0, 3, 3, 3], // [calories, proteins, fats, carbs]
    curve: 'smooth'
  },
  colors: ['#FBF3E6', '#319A6E', '#FDC755', '#FFA767'],
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 5
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
    position: 'back'
  },
  xaxis: {
    type: 'category',
    categories: [],
    title: {
      text: t('date'),
      style: {
        fontSize: '12px',
        fontWeight: 500,
        cssClass: 'text-gray-500'
      }
    },
    labels: {
      formatter: function(value: string) {
        return formatDate(value, selectedPeriod.value)
      },
      style: {
        fontSize: '12px',
        cssClass: 'text-gray-500'
      }
    },
    axisBorder: {
      show: true,
      color: '#E5E7EB'
    },
    axisTicks: {
      show: true,
      color: '#E5E7EB'
    }
  },
  yaxis: [
    {
      title: {
        text: t('calories'),
        style: {
          fontSize: '12px',
          fontWeight: 500,
          cssClass: 'text-gray-500'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          cssClass: 'text-gray-500'
        }
      }
    },
    {
      title: {
        text: t('grams'),
        style: {
          fontSize: '12px',
          fontWeight: 500,
          cssClass: 'text-gray-500'
        }
      },
      opposite: true,
      labels: {
        style: {
          fontSize: '12px',
          cssClass: 'text-gray-500'
        }
      }
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
      formatter: (value: number) => value.toFixed(1)
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '12px',
    markers: {
      size: 12,
      strokeWidth: 0,
      shape: 'circle',
      offsetX: 0,
      offsetY: 0
    }
  }
})

const getWeightChartOptions = (title: string): CustomApexOptions => ({
  chart: {
    type: 'line',
    height: '100%',
    fontFamily: 'inherit',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    },
    zoom: {
      enabled: true
    }
  },
  series: [],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  colors: ['#319A6E'],
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 5
  },
  grid: {
    show: true,
    borderColor: '#E5E7EB',
    strokeDashArray: 0,
    position: 'back'
  },
  xaxis: {
    type: 'category',
    categories: [],
    title: {
      text: t('date'),
      style: {
        fontSize: '12px',
        fontWeight: 500,
        cssClass: 'text-gray-500'
      }
    },
    labels: {
      formatter: function(value: string) {
        return formatDate(value, selectedPeriod.value)
      },
      style: {
        fontSize: '12px',
        cssClass: 'text-gray-500'
      }
    },
    axisBorder: {
      show: true,
      color: '#E5E7EB'
    },
    axisTicks: {
      show: true,
      color: '#E5E7EB'
    }
  },
  yaxis: {
    title: {
      text: title,
      style: {
        fontSize: '12px',
        fontWeight: 500,
        cssClass: 'text-gray-500'
      }
    },
    labels: {
      style: {
        fontSize: '12px',
        cssClass: 'text-gray-500'
      }
    }
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    theme: 'light',
    style: {
      fontSize: '12px'
    },
    y: {
      formatter: (value: number) => value.toFixed(1)
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '12px',
    markers: {
      size: 12,
      strokeWidth: 0,
      shape: 'circle',
      offsetX: 0,
      offsetY: 0
    }
  }
})

// Initialize chart options
const nutritionChartOptions = ref<CustomApexOptions>(getComboChartOptions())
const weightChartOptions = ref<CustomApexOptions>(getWeightChartOptions(t('weight')))

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
  if (newData.weight.length > 0) {
    const dates = newData.weight.map(item => item.date)
    const weightOptions = getWeightChartOptions(t('weight'))

    weightOptions.xaxis = {
      ...weightOptions.xaxis,
      categories: dates
    }

    weightOptions.series = [{
      name: t('weight'),
      data: newData.weight.map(item => item.value)
    }]

    weightChartOptions.value = weightOptions
    weightChartKey.value++
  }
})

watch(selectedPeriod, () => {
  fetchStatistics()
})

// Initial fetch
fetchStatistics()
</script>