<template>
	<div class="flex items-between" />
</template>

<script setup lang="ts">
import { Plan } from 'entities/Plan/types'

const props = defineProps<{
	plan: Plan
}>()
</script>

<style lang="scss" scoped></style>
