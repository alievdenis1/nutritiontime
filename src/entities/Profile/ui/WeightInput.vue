<template>
	<div class="p-4 bg-white border border-gray-200 rounded-lg">
		<h3 class="text-xl font-semibold text-center">
			{{ t('currentWeight') }}
		</h3>
		<div
			v-if="props.profile?.ideal_weight"
			class="text-center mt-2 text-gray"
		>
			({{ t('target') }}: {{ props.profile.ideal_weight }} {{ t('kg') }})
		</div>

		<div class="flex items-center justify-center gap-8 text-emerald-700">
			<button
				type="button"
				class="h-16 w-16 text-2xl bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
				@click="decrementWeight"
			>
				—
			</button>

			<div class="text-4xl font-semibold text-center flex items-center gap-2 min-w-[160px] justify-center">
				{{ weightInput }}
				<span class="text-gray-500 text-2xl">{{ t('kg') }}</span>
			</div>

			<button
				type="button"
				class="h-16 w-16 text-2xl bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
				@click="incrementWeight"
			>
				+
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
// Скрипт остается без изменений за исключением удаления логики для visibleButton
import { ref, computed, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { logWeight } from '../api'
import localization from './ProfileStats.localization.json'
import type { Profile } from '../model'

const props = defineProps<{
  profile: Profile | null
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

const { t } = useTranslation(localization)

const weightInput = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
let debounceTimer: ReturnType<typeof setTimeout>

const debouncedEmit = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(async () => {
    if (!isValid.value || loading.value) return
    await handleSubmit()
  }, 1000)
}

const incrementWeight = () => {
  const current = Number(weightInput.value) || 0
  weightInput.value = (current + 0.1).toFixed(1)
  debouncedEmit()
}

const decrementWeight = () => {
  const current = Number(weightInput.value) || 0
  weightInput.value = (current - 0.1).toFixed(1)
  debouncedEmit()
}

watch(() => props.profile?.weight, (newWeight) => {
  if (newWeight) {
    weightInput.value = newWeight.toString()
  }
}, { immediate: true })

const isValid = computed(() => {
  const weight = Number(weightInput.value)
  return weight > 0 && weight < 300
})

const handleSubmit = async () => {
  if (!isValid.value || loading.value) return

  loading.value = true
  error.value = null

  const weight = Number(weightInput.value)

  try {
    const logApi = logWeight({ weight })
    await logApi.execute()
    emit('updated')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error saving weight'
  } finally {
    loading.value = false
  }
}
</script>