<template>
	<div
		class="relative w-full flex items-center mb-2"
	>
		<input
			:value="modelValue"
			:placeholder="inputText"
			class="input flex-grow pl-8 bg-white border-solid border-[#3636361A] rounded-[30] border-slate-500 mr-20 z-20  w-14"
			@input="updateValue"
		>

		<div
			class="absolute right-0 top-0 bg-[#319A6E] py-[18px] flex justify-end rounded-[30px] w-40 cursor-pointer z-10 pr-10"
			@click="onSearchClick"
		>
			<IconSearch />
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconSearch } from '../Icon'

const props = defineProps<{
   inputText: string,
   modelValue: string,
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const onSearchClick = () => {
	console.log('Search icon clicked, current input: ', props.modelValue)
}

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.input {
	@apply pl-8 pr-4 py-[16px] rounded-[30px] flex
}

</style>