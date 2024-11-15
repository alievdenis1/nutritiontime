<template>
	<main class="layout pb-[100px] bg-mainBg">
		<slot />
	</main>
	<footer-widget
		class="sticky bottom-[20px]"
	/>
</template>

<script setup lang="ts">
import { FooterWidget } from 'widgets/footer'
</script>

<style lang="scss" scoped>
</style>
