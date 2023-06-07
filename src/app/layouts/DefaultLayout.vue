<template>
	<main class="layout default-layout">
		<slot />
	</main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.default-layout {
	@apply bg-beige p-[50px];
	//background-color: variables.$color_beige;
	//padding: 50px;
}
</style>
