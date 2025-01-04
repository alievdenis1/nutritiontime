<template>
	<div class="icons-gallery">
		<div
			v-for="(icon, name) in icons"
			:key="name"
			class="icon-item"
		>
			<component
				:is="icon"
				:icon-color="color"
				:icon-width="size"
				:icon-height="size"
			/>
			<span>{{ name }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import * as Icons from './index'

defineProps<{
	color: string;
	size: number;
}>()

const icons = Icons
</script>

<style scoped>
.icons-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    text-align: center;
}

.icon-item span {
    margin-top: 5px;
    font-size: 12px;
}
</style>