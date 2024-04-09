<template>
	<el-button
		text
		class="p-[5px]"
		disabled
		@click="onClicked"
	>
		<div class="flex row text-default text-green w-full items-center">
			<el-icon
				size="15"
				class="mr-[12px]"
			>
				<icon-pen />
			</el-icon>

			{{ t('edit') }}
		</div>
	</el-button>
</template>

<script setup lang="ts">
import { IconPen } from 'shared/components/Icon'
import Localization from './EditPlan.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const onClicked = () => {
	// TODO: EDIT PLAN
}
</script>

<style lang="scss" scoped></style>
