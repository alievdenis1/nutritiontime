<template>
	<div class="recipe-card">
		<div class="flex items-center">
			<VSkeleton class="w-[32px] h-[32px] mr-[8px]  rounded-[50%]" />
			<VSkeleton class="w-[80px] h-[15px] rounded-[8px]" />
		</div>
		<VSkeleton class="w-full h-[343px] mt-[12px] rounded-[12px]" />
		<div class="flex">
			<VSkeleton class="w-[90px] h-[28px] mt-[12px] rounded-[8px] mr-[8px]" />
			<VSkeleton class="w-[90px] h-[28px] mt-[12px] rounded-[8px]" />
		</div>
		<VSkeleton class="w-[250px] h-[18px] mt-[12px] rounded-[8px]" />
		<div class="flex justify-between mt-[12px]">
			<VSkeleton class="w-[32px] h-[24px]  rounded-[8px]" />
			<div class="flex">
				<VSkeleton class="w-[24px] h-[24px] mr-[8px] rounded-[8px]" />
				<VSkeleton class="w-[36px] h-[24px]  rounded-[8px]" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import VSkeleton  from './VSkeleton.vue'
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
}
</style>