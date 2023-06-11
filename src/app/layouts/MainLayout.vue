<template>
	<main class="layout p-[50px]">
		<header-widget class="mb-[36px]" />

		<slot />
	</main>
</template>

<script setup lang="ts">
import { HeaderWidget } from 'widgets/header'
</script>

<style lang="scss" scoped></style>
