<template>
	<main :class="`layout p-[25px] pb-[50px] bg-mainBg`">
		<header-widget class="mb-[30px]" />

		<slot />
	</main>
	<footer-widget class="fixed bottom-0" />
</template>

<script setup lang="ts">
import { HeaderWidget } from 'widgets/header'
import { FooterWidget } from 'widgets/footer'

</script>
