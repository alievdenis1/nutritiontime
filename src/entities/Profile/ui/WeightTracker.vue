<!-- src/components/WeightTracker.vue -->
<template>
	<div class="weight-tracker">
		<h2>{{ t('weightTracker') }}</h2>
		<form @submit.prevent="submitWeight">
			<input
				v-model="weight"
				type="number"
				placeholder="Weight"
				required
			>
			<input
				v-model="notes"
				type="text"
				placeholder="Notes"
			>
			<button type="submit">
				{{ t('logWeight') }}
			</button>
		</form>
		<div v-if="weightLogs.length">
			<h3>{{ t('weightLogs') }}</h3>
			<ul>
				<li
					v-for="log in weightLogs"
					:key="log.id"
				>
					{{ log.date_added }}: {{ log.weight }}kg - {{ log.notes }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/shared/lib/api/use-api'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation()

const weight = ref(null)
const notes = ref('')
const weightLogs = ref([])

const submitWeight = async () => {
  const logWeightApi = useApi('post', '/weight/log', {
    weight: weight.value,
    notes: notes.value,
  })
  await logWeightApi.execute()
  if (!logWeightApi.error.value) {
    fetchWeightLogs()
  }
}

const fetchWeightLogs = async () => {
  const weightLogsApi = useApi('get', '/weight/logs')
  await weightLogsApi.execute()
  if (!weightLogsApi.error.value) {
    weightLogs.value = weightLogsApi.data.value
  }
}

onMounted(() => {
  fetchWeightLogs()
})
</script>

<style scoped>
.weight-tracker {
  /* Add your styles here */
}
</style>
