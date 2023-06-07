<template>
	<el-collapse
		v-model="isListCollapsed"
		accordion
		class="saved-plans-list"
	>
		<el-collapse-item
			v-for="plan in savedPlans"
			:key="plan.id"
			:name="plan.id"
		>
			q
		</el-collapse-item>
	</el-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlansStore } from '../model'
import { storeToRefs } from 'pinia'

const store = usePlansStore()

const savedPlans = storeToRefs(store)

const isListCollapsed = ref<boolean>(false)
</script>

<style lang="scss" scoped></style>
