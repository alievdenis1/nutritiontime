<script setup lang="ts">
import { ButtonColors, VButton } from 'shared/components/Button'

defineEmits<{
	click: []
}>()
</script>

<template>
	<VButton
		:color="ButtonColors.Green"
		@click="$emit('click')"
	>
		<slot />
	</VButton>
</template>

<style module>

</style>
