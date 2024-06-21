<template>
	<div class="tabs-container">
		<div
			v-for="tab in tabs"
			:key="tab.name"
			:class="['tab', { 'active-tab': tab.isActiveTab }]"
			class="cursor-pointer flex-1 text-center px-4 py-2 rounded-lg transition-all"
			@click="selectTab(tab)"
		>
			{{ tab.label }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tab } from './config'

const tabs = ref<Tab[]>([
	{ name: 'collections', label: 'Коллекции', isActiveTab: true },
	{ name: 'my-recipes', label: 'Мои рецепты', isActiveTab: false }
])

const emit = defineEmits(['update:label'])

const selectTab = (tab: Tab) => {
	tabs.value.forEach(t => t.isActiveTab = false)
	tab.isActiveTab = true
	emit('update:label', tab.label)
}
</script>

<style scoped lang="scss">
.tabs-container {
	display: flex;
	justify-content: space-around;
	background-color: #f3f3f3;
	border-radius: 28px;
	padding: 8px;
	gap: 5px;
}

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