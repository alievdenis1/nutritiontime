<template>
	<main class="layout py-9 px-8 bg-beige">
		<header-widget class="mb-[30px]" />

		<slot />
	</main>
	<footer-widget class="fixed bottom-0"/>
</template>

<script setup lang="ts">
import { HeaderWidget } from 'widgets/header'
import { FooterWidget } from 'widgets/footer'
</script>
