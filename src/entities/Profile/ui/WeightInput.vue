<template>
	<div class="p-4 bg-white border border-gray-200 rounded-lg">
		<h3 class="text-lg font-semibold mb-4 text-center">
			{{ t('currentWeight') }}
		</h3>

		<form
			class="space-y-4"
			@submit.prevent="handleSubmit"
		>
			<div class="flex gap-4">
				<div class="flex-1">
					<VInput
						v-model="weightInput"
						type="number"
						:title="t('enterWeight')"
						name="weight"
						:max-length="5"
						digital
						:error="!!error"
						:error-message="error || ''"
					>
						<template #right-icon>
							<span class="text-gray-500">{{ t('kg') }}</span>
						</template>
					</VInput>
				</div>

				<button
					type="submit"
					class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 h-14"
					:disabled="loading || !isValid"
				>
					<span
						v-if="loading"
						class="inline-block animate-spin mr-2"
					>⌛</span>
					{{ todayWeight ? t('update') : t('add') }}
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { logWeight } from '../api'
import localization from './ProfileStats.localization.json'
import { VInput } from 'shared/components/Input'

interface WeightLog {
  weight: number
  date: string
}

const props = defineProps<{
  todayWeight?: WeightLog | null
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

// Translations
const { t } = useTranslation(localization)

const weightInput = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Следим за изменением todayWeight и обновляем input
watch(() => props.todayWeight, (newWeight) => {
  if (newWeight) {
    weightInput.value = newWeight.weight.toString()
  } else {
    weightInput.value = ''
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
  const today = new Date().toISOString().split('T')[0]

  try {
    const logApi = logWeight({
      weight,
      date: today
    })
    await logApi.execute()

    emit('updated')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error saving weight'
  } finally {
    loading.value = false
  }
}
</script>