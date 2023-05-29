<template>
	<main class="layout default-layout">
		<slot />
	</main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "shared/styles/variables";

.default-layout {
	background-color: variables.$color_beige;
	padding: 50px;
}
</style>
