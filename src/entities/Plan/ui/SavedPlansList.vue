<template>
	<v-collapse
		v-loading="isLoadingSavedPlans"
		:data="savedPlans"
		title-key="name"
		:title="t('myCollection')"
		name-key="id"
		@generate="onGenerateNewPlan"
	>
		<template #item="{ item }">
			<div class="flex row items-center justify-between">
				<plan-info
					:plan="item"
				/>

				<div
					class="
						h-[30px] w-[50px] flex items-center justify-center
						cursor-pointer rounded-[90px]
						hover:outline-green hover:outline-1 hover:outline
					"
					@click="onActionButtonClicked(item)"
				>
					<el-icon size="16">
						<el-icon-more-filled class="text-green" />
					</el-icon>
				</div>
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
import Localization from './SavedPlansList.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const emit = defineEmits<{
	(event: 'action', value: Plan)
}>()

const store = usePlansStore()
const { savedPlans, isLoadingSavedPlans } = storeToRefs(store)

const onGenerateNewPlan = () => {
	console.log('new plan created')
}

const onActionButtonClicked = (plan: Plan) => {
	emit('action', plan)
}
</script>
