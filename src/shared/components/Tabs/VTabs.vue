<template>
	<div
		class="tab"
		:class="{ 'active-tab': isActive }"
		@click="handleClick"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
	initialActive: Boolean
})

const emit  = defineEmits(['update:active'])

const isActive = ref(props.initialActive)

const handleClick = () => {
	isActive.value = true
	emit('update:active', { active: true })
}
</script>

<style scoped lang="scss">
.tab {
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	border-radius: 1rem;
	transition: all 0.3s ease;
}

.active-tab {
	background-color: white;
	box-shadow: 0px 0px 34px 0px rgba(0, 0, 0, 0.08);
}
</style>