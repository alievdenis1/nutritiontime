<script setup lang="ts">
import { ButtonColors, VButton } from 'shared/components/Button'

withDefaults(defineProps<{
	disabled?: boolean
}>(), {
	disabled: false
})

defineEmits<{
	click: []
}>()

</script>

<template>
	<VButton
		:disabled="disabled"
		:color="ButtonColors.Green"
		@click="$emit('click')"
	>
		<slot />
	</VButton>
</template>

<style module>

</style>
