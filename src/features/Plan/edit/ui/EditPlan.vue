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

			Редактировать
		</div>
	</el-button>
</template>

<script setup lang="ts">
import { IconPen } from 'shared/components/Icon'

const onClicked = () => {
	// TODO: EDIT PLAN
}
</script>

<style lang="scss" scoped></style>
