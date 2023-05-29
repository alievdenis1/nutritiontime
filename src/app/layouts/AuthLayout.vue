<template>
	<main class="layout auth-layout">
		<slot />
	</main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "shared/styles/variables";

.auth-layout {
	background-color: variables.$color_beige;
}
</style>
