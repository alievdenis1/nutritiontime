<template>
	<main class="layout p-[25px] bg-[#FEF6DF] mb-[30px]">
		<header-widget class="mb-[30px]" />

		<slot />
	</main>
	<footer-widget class="fixed bottom-0"/>
</template>

<script setup lang="ts">
import { HeaderWidget } from 'widgets/header'
import { FooterWidget } from 'widgets/footer'
</script>
