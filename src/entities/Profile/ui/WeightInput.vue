<template>
	<div class="p-4 bg-white border border-gray-200 rounded-lg">
		<h3 class="text-lg font-semibold mb-4 text-center">
			{{ t('currentWeight') }}
		</h3>

		<form
			class="space-y-4"
			@submit.prevent="handleSubmit"
		>
			<div class="flex gap-2 items-center">
				<button
					type="button"
					class="h-14 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
					@click="decrementWeight"
				>
					-
				</button>
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
					type="button"
					class="h-14 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
					@click="incrementWeight"
				>
					+
				</button>
			</div>

			<div class="w-full flex justify-center  items-center">
				<button
					type="submit"
					class="w-[70%] px-4 py-2 bg-emerald-600 text-white text-center
				rounded-lg hover:bg-emerald-700 disabled:opacity-50"
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

interface ChartWeight {
  date: string
  value: number
}

const props = defineProps<{
  todayWeight?: WeightLog | null
  weightHistory?: ChartWeight[]
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

const { t } = useTranslation(localization)

const weightInput = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const incrementWeight = () => {
  const current = Number(weightInput.value) || 0
  weightInput.value = (current + 0.1).toFixed(1)
}

const decrementWeight = () => {
  const current = Number(weightInput.value) || 0
  weightInput.value = (current - 0.1).toFixed(1)
}

watch(() => props.todayWeight, (newWeight) => {
  if (newWeight) {
    weightInput.value = newWeight.weight.toString()
  } else if (props.weightHistory?.length) {
    const lastWeight = [...props.weightHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    weightInput.value = lastWeight.value.toString()
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