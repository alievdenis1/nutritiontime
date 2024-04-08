<template>
	<el-button
		text
		class="p-[5px]"
		@click="onClicked"
	>
		<div class="flex row text-default text-red w-full items-center">
			<el-icon
				size="17"
				class="mr-[12px]"
			>
				<el-icon-delete />
			</el-icon>

			{{ t('delete') }}
		</div>
	</el-button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useDeletePlanStore } from '../model'
import { Plan } from 'entities/Plan/types'
import Localization from './DeletePlan.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const store = useDeletePlanStore()

const props = defineProps<{
	planId: Plan['id']
}>()

const { planId } = toRefs(props)

const onClicked = () => {
	store.deletePlan(planId.value)
}

</script>
