<template>
	<el-button
		text
		@click="onClicked"
	>
		<div class="flex row text-default text-[#735F2B] w-full items-center gap-3 font-normal">
			<img
				src="/image/icons/icon-pen.svg"
				width="15"
			>

			{{ t('rename') }}
		</div>
	</el-button>
</template>

<script setup lang="ts">
import Localization from './EditPlan.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const onClicked = () => {
	// TODO: EDIT PLAN
}
</script>

<style lang="scss" scoped></style>
