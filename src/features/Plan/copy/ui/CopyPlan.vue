<template>
	<el-button
		text
		class="p-[5px]"
		@click="onClicked"
	>
		<div class="flex row text-default text-green w-full items-center">
			<el-icon
				size="17"
				class="mr-[12px]"
			>
				<icon-copy />
			</el-icon>

			{{ t('copy') }}
		</div>
	</el-button>
</template>

<script setup lang="ts">
import { Plan } from 'entities/Plan/types'
import { toRefs } from 'vue'
import { useCopyPlanStore } from '../model'
import { IconCopy } from 'shared/components/Icon'
import Localization from './CopyPlan.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const emit = defineEmits<{
<<<<<<< HEAD
  (event: 'success'): void;
  (event: 'error'): void;
=======
	(event: 'success'),
	(event: 'error')
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
}>()

const props = defineProps<{
	planId: Plan['id']
}>()

const { planId } = toRefs(props)

const store = useCopyPlanStore()

const onClicked = () => {
	store.copyPlan(planId.value)
		.then(() => {
			emit('success')
		}).catch(() => {
			emit('error')
		})
}
</script>

<style lang="scss" scoped></style>
