<template>
	<div class="grid w-full px-[26px]">
		<footer class="flex py-3 px-14 items-center justify-between bg-[#6BA78E] rounded-[100px]">
			<v-button class="cursor-pointer">
				<icon-home />
			</v-button>
			<v-button
				class="cursor-pointer p-[14.5px] border-solid border border-white rounded-[50%]"
				@click="router.push('/create-recipe')"
			>
				<icon-plus />
			</v-button>
			<v-button class="cursor-pointer">
				<icon-search />
			</v-button>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { IconHome, IconPlus, IconSearch } from '@/shared/components/Icon'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped></style>