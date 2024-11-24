<template>
	<div class="profile-stats space-y-4 p-4">
		<div
			v-if="profile?.user?.referrer"
			class="bg-emerald-100 p-5 rounded-2xl text-green text-center"
		>
			Вас пригласил:
			<span
				class="text-amber-600 underline cursor-pointer"
				@click="showUserStats(profile.user.referrer)"
			>
				{{ profile.user.referrer.name }}
			</span>
		</div>

		<TabsMain :default-value="activeTab">
			<TabsList>
				<TabsTrigger value="profile">
					Я
				</TabsTrigger>
				<TabsTrigger value="friends">
					Друзья
				</TabsTrigger>
			</TabsList>

			<TabsContent value="profile">
				<div class="p-6 bg-white rounded-lg shadow-sm mt-3 space-y-6 text-center">
					<template v-if="profile?.profile">
						<img
							src="/public/image/avatar.png"
							alt="Avatar"
							class="w-[200px] m-auto"
						>
						<div
							class="cursor-pointer relative flex items-center gap-[2px] rounded-[16px] shadow-lg font-bold p-5
              justify-center"
							@click="navigateToWallet"
						>
							<IconGold />
							<span class="ml-2">$RECIPETON</span>
						</div>

						<div class="mb-6 text-center">
							<VButton
								:color="ButtonColors.Green"
								class="w-full flex items-center justify-center gap-2"
								@click="copyShareLink"
							>
								Поделиться реферальной ссылкой {{ userInfo?.referral_code }}
							</VButton>
							<!-- Уведомление о копировании -->
							<div
								v-if="showCopyNotification"
								class="fixed top-4 right-4 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300"
								:class="{ 'opacity-0': fadeOutNotification }"
							>
								Ссылка скопирована в буфер обмена
							</div>
						</div>

						<!-- Основные параметры -->
						<div class="space-y-2">
							<h3 class="font-semibold text-lg">
								📊 Основные параметры:
							</h3>
							<div class="grid grid-cols-2 gap-2">
								<div>Пол: {{ formatGender(profile.profile.gender) }}</div>
								<div>Возраст: {{ profile.profile.age }} лет</div>
								<div>Вес: {{ profile.profile.weight }} кг</div>
								<div>Рост: {{ profile.profile.height }} см</div>
							</div>
						</div>

						<!-- Физическая активность -->
						<div class="space-y-2">
							<h3 class="font-semibold text-lg">
								💪 Физическая активность:
							</h3>
							<div>{{ profile.profile.activity_type }}</div>
							<div>👣 Рекомендуемые шаги: {{ profile.profile.recommended_steps }}</div>
						</div>

						<!-- Энергетический баланс -->
						<div class="space-y-2">
							<h3 class="font-semibold text-lg">
								🎯 Энергетический баланс:
							</h3>
							<div>Норма калорий: {{ profile.profile.base_calories }} ккал/день</div>
							<div>Целевые калории: {{ profile.profile.target_calories }} ккал/день</div>
							<div>Цель: {{ formatGoal(profile.profile.goal) }}</div>
						</div>

						<!-- БЖУ -->
						<div class="space-y-2">
							<h3 class="font-semibold text-lg">
								🥩 Целевые БЖУ/день:
							</h3>
							<div>Белки: {{ profile.profile.macro_proteins }}г ({{ Math.round(Number(profile.profile.macro_proteins) * 4) }} ккал)</div>
							<div>Жиры: {{ profile.profile.macro_fats }}г ({{ Math.round(Number(profile.profile.macro_fats) * 9) }} ккал)</div>
							<div>Углеводы: {{ profile.profile.macro_carbs }}г ({{ Math.round(Number(profile.profile.macro_carbs) * 4) }} ккал)</div>
						</div>

						<!-- Дополнительная информация -->
						<div class="space-y-2">
							<div>💧 Рекомендуемое потребление воды: {{ (Number(profile.profile.water_intake) / 1000).toFixed(1) }} л/день</div>
							<div>⚡️ Формула расчёта: {{ profile.profile.bmr_formula }}</div>
							<div>⏰ Обновлено: {{ formatDate(profile.profile.last_updated) }}</div>
						</div>

						<VButton
							:color="ButtonColors.Green"
							class="mt-5"
							@click="handleToProfile()"
						>
							{{ t('editProfile') }}
						</VButton>
					</template>
				</div>
			</TabsContent>

			<TabsContent value="friends">
				<div class="p-6 bg-white rounded-lg shadow-sm mt-3">
					<div v-if="profile?.user">
						<!-- Список рефералов -->
						<div class="space-y-4">
							<h3 class="font-semibold text-lg mb-4">
								Приглашенные пользователи:
							</h3>
							<div v-if="profile.user.referrals.length > 0">
								<div
									v-for="referral in profile.user.referrals"
									:key="referral.id"
									class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 mb-3"
									@click="showUserStats(referral)"
								>
									<div class="flex justify-between items-center">
										<div>
											<div class="font-medium">
												{{ referral.name }}
											</div>
											<div class="text-sm text-gray-500">
												@{{ referral.telegram_username }}
											</div>
										</div>
										<div class="text-right">
											<div class="text-sm">
												Дней подряд: {{ referral.current_streak }}
											</div>
											<div class="text-sm">
												{{ referral.has_active_subscription ? '✅ Активная подписка' :
													referral.has_trial ? '🎁 Пробный период' : '❌ Нет подписки' }}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								v-else
								class="text-center text-gray-500"
							>
								У вас пока нет приглашенных пользователей
							</div>
						</div>
					</div>
					<div v-else>
						{{ t('needFeelProfile') }}
						<VButton
							:color="ButtonColors.Green"
							class="mt-5"
							@click="handleToProfile()"
						>
							{{ t('fillProfile') }}
						</VButton>
					</div>
				</div>
			</TabsContent>
		</TabsMain>

		<VModal
			:show="showModal"
			@close="closeModal"
		>
			<div class="flex justify-between mb-[12px] items-center">
				<h2 class="text-xl font-bold">
					{{ selectedUser?.name }}
				</h2>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="closeModal"
				>
					<IconClose />
				</button>
			</div>
			<div class="flex flex-col gap-[20px] text-sm mb-[20px]">
				<div class="space-y-2">
					<div>Имя пользователя: @{{ selectedUser?.telegram_username }}</div>
					<div>Дней подряд ведет дневник: {{ selectedUser?.current_streak }}</div>
					<div>Количество приглашенных: {{ selectedUser?.referrals_count }}</div>
					<div>
						Статус подписки:
						{{ selectedUser?.has_active_subscription ? 'Активная подписка' :
							selectedUser?.has_trial ? 'Пробный период' : 'Нет подписки' }}
					</div>
				</div>
			</div>
			<VButton
				:color="ButtonColors.Green"
				@click="closeModal"
			>
				{{ t('buttonClose') }}
			</VButton>
		</VModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getProfile, sendToProfile } from '../api'
import { TabsContent, TabsList, TabsMain, TabsTrigger } from 'shared/components/ui/tabs'
import localization from './ProfileStats.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { ButtonColors, VButton } from 'shared/components/Button'
import { VModal } from '@/shared/components/Modal'
import { IconClose, IconGold } from '@/shared/components/Icon'
import WebApp from '@twa-dev/sdk'
import type { ReferralUser } from '../model'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/Session'

const router = useRouter()

const navigateToWallet = () => {
  router.push('/wallet')
}

const { t } = useTranslation(localization)

const showCopyNotification = ref(false)
const fadeOutNotification = ref(false)

const sessionStore = useSessionStore()
const { userInfo } = sessionStore

// Функция копирования реферальной ссылки
const copyShareLink = async () => {
  const referralCode = userInfo?.referral_code || ''
  const textToCopy = `https://t.me/nutritiontime_bot?start=${referralCode}`

  try {
    await navigator.clipboard.writeText(textToCopy)

    // Показываем уведомление
    showCopyNotification.value = true
    fadeOutNotification.value = false

    // Начинаем анимацию исчезновения через 2 секунды
    setTimeout(() => {
      fadeOutNotification.value = true
    }, 2000)

    // Скрываем уведомление полностью через 2.3 секунды
    setTimeout(() => {
      showCopyNotification.value = false
      fadeOutNotification.value = false
    }, 2300)
  } catch (error) {
    console.error('Ошибка при копировании текста:', error)
  }
}

// Состояние
const activeTab = ref('profile')
const showModal = ref(false)
const selectedUser = ref<ReferralUser | null>(null)

// API запросы
const profileApi = getProfile()

const profile = computed(() => profileApi.data.value ?? null)

// Методы
const handleToProfile = async () => {
  await sendToProfile().execute()
  WebApp.close()
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatGender = (gender: string): string => {
  return gender === 'male' ? 'Мужской' : 'Женский'
}

const formatGoal = (goal: string): string => {
  const goals: Record<string, string> = {
    'muscle_gain_aggressive': 'Интенсивный набор массы',
    'muscle_gain': 'Набор массы',
    'fat_loss': 'Снижение веса',
    'maintenance': 'Поддержание веса'
  }
  return goals[goal] || goal
}

const showUserStats = (user: ReferralUser) => {
  selectedUser.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

// Инициализация
onMounted(() => {
  profileApi.execute()
})
</script>

<style scoped>
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.opacity-0 {
  opacity: 0;
}
</style>