<template>
	<div>
		<VSkeleton class="w-full h-[67px] mr-[8px] rounded-[16px] " />
		<VSkeleton class="w-full h-[367px] mt-[12px] rounded-[12px]" />
		<VSkeleton class="w-full h-[67px] mt-[12px] rounded-[16px]" />
		<VSkeleton class="w-full h-[67px] mt-[12px] rounded-[16px]" />
		<VSkeleton class="fixed bottom-0 left-0 right-[16px] z-10  w-full h-[78px] rounded-[16px]" />
	</div>
</template>

<script setup lang="ts">
import VSkeleton from './VSkeleton.vue'
</script>

<style scoped>
.recipe-card {
	width: 100vw;
	margin-left: calc(-50vw + 50%);
	background-color: white;
	border-top: 1px solid #1C1C1C0D;
	border-bottom: 1px solid #1C1C1C0D;
	padding: 12px 16px;
	margin-top: 24px;
	background: red;
}
</style>