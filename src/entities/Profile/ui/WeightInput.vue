<template>
	<div class="p-4 bg-white border border-gray-200 rounded-lg">
		<h3 class="text-lg font-semibold mb-4">
			{{ t('currentWeight') }}
		</h3>

		<form
			class="space-y-4"
			@submit.prevent="handleSubmit"
		>
			<div class="flex gap-4">
				<div class="flex-1">
					<div class="relative">
						<input
							v-model="weightInput"
							type="number"
							step="0.1"
							class="w-full p-2 border border-gray-300 rounded-lg pr-12"
							:placeholder="t('enterWeight')"
						>
						<span class="absolute right-3 top-2 text-gray-500">{{ t('kg') }}</span>
					</div>
				</div>

				<button
					type="submit"
					class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
					:disabled="loading || !isValid"
				>
					<span
						v-if="loading"
						class="inline-block animate-spin mr-2"
					>⌛</span>
					{{ currentLogId ? t('update') : t('add') }}
				</button>
			</div>

			<div
				v-if="error"
				class="text-red-500 text-sm"
			>
				{{ error }}
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { logWeight, updateWeight } from '../api'
import localization from './ProfileStats.localization.json'

const props = defineProps<{
  currentLogId?: number
  currentWeight?: number
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

// Translations
const { t } = useTranslation(localization)

const weightInput = ref(props.currentWeight?.toString() || '')
const loading = ref(false)
const error = ref<string | null>(null)

const isValid = computed(() => {
  const weight = Number(weightInput.value)
  return weight > 0 && weight < 300 // Базовая валидация
})

const handleSubmit = async () => {
  if (!isValid.value || loading.value) return

  loading.value = true
  error.value = null

  const weight = Number(weightInput.value)
  const today = new Date().toISOString().split('T')[0]

  try {
    if (props.currentLogId) {
      const updateApi = updateWeight(props.currentLogId, {
        weight,
        date: today
      })
      await updateApi.execute()
    } else {
      const logApi = logWeight({
        weight,
        date: today
      })
      await logApi.execute()
    }

    emit('updated')
    if (!props.currentLogId) {
      weightInput.value = '' // Очищаем поле только при добавлении
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error saving weight'
  } finally {
    loading.value = false
  }
}
</script>