// ProfileStats.vue
<template>
	<div
		v-if="profile"
		class="profile-stats space-y-4 p-4"
	>
		<div class="bg-emerald-100 p-5 rounded-2xl text-green text-center">
			{{ t('diaryStreakPrefix') }}: {{ getPluralForm(user?.diary_streak, 'diaryStreak') }}! <br>
			{{ getPluralForm(user?.subscription_days_left, user?.is_trial ? 'trialDaysLeft' : 'subscriptionDaysLeft') }}:
			<span
				class="text-amber-600 underline cursor-pointer"
				@click="router.push(`/payment/`)"
			>{{ t('extend') }}</span>
		</div>
		<TabsMain
			:default-value="defaultTab"
		>
			<TabsList>
				<TabsTrigger value="report">
					{{ t('report') }}
				</TabsTrigger>
				<TabsTrigger value="statistic">
					{{ t('statistics') }}
				</TabsTrigger>
			</tabslist>

			<TabsContent value="report">
				<DailyNutritionStats
					v-model="selectedDate"
					:profile="profile"
					:meal-stats="mealStats"
					:loading="loading"
					:error="error"
					class="mt-4"
					@set-goals="handleSetGoals"
					@retry="fetchMealStats"
					@meal-deleted="fetchMealStats"
				/>
			</TabsContent>
			<TabsContent value="statistic">
				<StatisticsTab
					:profile="profile"
				/>
			</TabsContent>
		</TabsMain>
	</div>
	<div
		v-else
		class="p-5 text-center"
	>
		{{ t('needFeelProfile') }}
		<VButton
			:color="ButtonColors.Green"
			class="mt-5"
			@click="handleToProfile()"
		>
			{{ t('fillProfile') }}
		</VButton>
		<VButton
			:color="ButtonColors.Green"
			class="mt-5"
			@click="router.push(`/payment/`)"
		>
			{{ t('to_subscribe') }}
		</VButton>
		<div
			class="mt-5 cursor-pointer relative flex items-center gap-[2px] rounded-[16px] shadow-lg font-bold p-5 justify-center"
			@click="navigateToWallet"
		>
			<IconGold />
			<span class="ml-2">$RECIPETON</span>
		</div>
	</div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted, watch } from 'vue'
 import { DailyNutritionStats, StatisticsTab } from './index'
 import { getProfile, getMealStats, sendToProfile } from '../api'
 import { TabsContent, TabsList, TabsMain, TabsTrigger } from 'shared/components/ui/tabs'
 import { useRouter } from 'vue-router'
 import localization from './ProfileStats.localization.json'
 import { useTranslation } from '@/shared/lib/i18n'
 import { ButtonColors, VButton } from 'shared/components/Button'
 import WebApp from '@twa-dev/sdk'
 import { useRoute } from 'vue-router'
 import { IconGold } from 'shared/components/Icon'

 const route = useRoute()

 // Определяем начальную вкладку на основе параметра URL
 const defaultTab = computed(() => {
   return route.query.tab === 'statistics' ? 'statistic' : 'report'
 })

 const { t } = useTranslation(localization)

 const getPluralForm = (count: number | undefined, baseKey: string): string => {
  if (count === undefined) return ''

  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  let form = 'Many'

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
   form = 'Many'
  } else if (lastDigit === 1) {
   form = 'One'
  } else if (lastDigit >= 2 && lastDigit <= 4) {
   form = 'Few'
  }

  return t(`${baseKey}${form}`).replace('{count}', count.toString())
 }

 const router = useRouter()

 const navigateToWallet = () => {
   route
 }

 // Состояние
 const selectedDate = ref('')
 const serverDate = computed(() => {
   if (!profile.value?.server_datetime) return ''
   return new Date(profile.value.server_datetime).toISOString().split('T')[0]
 })

 // API запросы
 const profileApi = getProfile()
 const mealStatsApi = getMealStats({
  start_date: selectedDate.value,
  end_date: selectedDate.value
 })

 const handleToProfile = async () => {
   await sendToProfile().execute()
   WebApp.close()
 }

 // Вычисляемые свойства
 const loading = computed(() => profileApi.loading.value || mealStatsApi.loading.value)
 const error = computed(() => {
  if (profileApi.error.value) return profileApi.error.value
  if (mealStatsApi.error.value) return mealStatsApi.error.value
  return null
 })
 const profile = computed(() => profileApi.data.value?.profile ?? null)
 const user = computed(() => profileApi.data.value?.user ?? null)
 const mealStats = computed(() => mealStatsApi.data.value)

 // Методы
 const fetchMealStats = async () => {
  const newApi = getMealStats({
   start_date: selectedDate.value,
   end_date: selectedDate.value
  })
  await newApi.execute()
  if (!newApi.error.value) {
   mealStatsApi.data.value = newApi.data.value
  }
 }

 const fetchData = async () => {
  await Promise.all([
   profileApi.execute(),
   fetchMealStats()
  ])
 }

 const handleSetGoals = () => {
  // TODO: Реализовать логику установки целей
  console.log('Setting goals...')
 }

 // Обработчики
 watch(selectedDate, () => {
  fetchMealStats()
 })

 // Инициализация
 onMounted(() => {
   // Инициализируем дату только после получения данных с сервера
   watch(serverDate, (newDate) => {
     if (newDate && !selectedDate.value) {
       selectedDate.value = newDate
     }
   }, { immediate: true })

   fetchData()
 })
</script>