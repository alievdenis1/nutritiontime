<template>
	<div
		class="sensitivity-cell"
		:class="{ active: active }"
		@click="$emit('click')"
	>
		<div class="sensitivity-label">
			{{ label }}
		</div>
		<div class="sensitivity-value">
			{{ value }}
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    value: string
    active: boolean
}>()

defineEmits<{
    (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
.sensitivity-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
        background-color: #319A6E;
        color: white;
    }

    &:hover {
        background-color: #f0f0f0;
    }

    .sensitivity-label {
        font-size: 14px;
        margin-bottom: 5px;
    }

    .sensitivity-value {
        font-size: 12px;
        opacity: 0.7;
    }
}
</style>