<template>
	<v-collapse
		v-loading="isLoadingSavedPlans"
		:data="savedPlans"
		title-key="name"
		title="Сохраненные планы"
		name-key="id"
	>
		<template #item="{ item }">
			<div class="flex row items-center justify-between">
				<plan-info
					:plan="item"
				/>

				<el-icon
					size="16"
					class="cursor-pointer"
					@click="onActionButtonClicked(item)"
				>
					<el-icon-more-filled class="text-green" />
				</el-icon>
			</div>
		</template>
	</v-collapse>
</template>

<script setup lang="ts">
import { usePlansStore } from '../model'
import { storeToRefs } from 'pinia'
import PlanInfo from './PlanInfo.vue'
import { VCollapse } from 'shared/components/Collapse'
import { Plan } from '../types'

const emit = defineEmits<{
	(event: 'action', value: Plan)
}>()

const store = usePlansStore()
const { savedPlans, isLoadingSavedPlans } = storeToRefs(store)

const onActionButtonClicked = (plan: Plan) => {
	emit('action', plan)
}
</script>
