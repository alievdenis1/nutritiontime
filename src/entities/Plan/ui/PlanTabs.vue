<template>
	<VTabs @update:label="handleLabelUpdate" />
	<DragAndDrop
		v-if="selectedLabel == 'Коллекции'"
		class="mt-[16px] mb-[24px]"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VTabs } from 'shared/components/Tabs'
import { DragAndDrop } from 'shared/components/DragAndDrop'
const emit = defineEmits(['update:label'])
const selectedLabel = ref('Коллекции')

const handleLabelUpdate = (label: string) => {
	selectedLabel.value = label
	emit('update:label', label)
}
</script>

<style scoped></style>