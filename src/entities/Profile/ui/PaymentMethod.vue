<!-- components/PaymentMethod.vue -->
<template>
	<div class="flex flex-row gap-4">
		<div
			class="p-2 rounded-lg border transition-all duration-200 cursor-pointer w-full"
			:class="[
				selected
					? 'border-green-500 bg-green-900/20 shadow-lg shadow-green-900/10'
					: 'border-gray-700 hover:border-green-500/30 hover:bg-green-900/5'
			]"
			@click="$emit('select')"
		>
			<div class="flex items-center space-x-4">
				<div class="flex-shrink-0 bg-gray-800 rounded-lg p-2">
					<img
						:src="getIcon"
						:alt="title"
						class="w-10 h-10 object-contain"
					>
				</div>
				<div class="flex-grow">
					<h3 class="font-medium text-lg">
						{{ title }}
					</h3>
					<p
						v-if="description"
						class="text-sm text-gray-400 mt-1"
					>
						{{ description }}
					</p>
				</div>
				<div class="flex-shrink-0">
					<div
						class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
						:class="[
							selected
								? 'border-green-500 bg-green-500'
								: 'border-gray-600'
						]"
					>
						<svg
							v-if="selected"
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-white"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
 import { computed } from 'vue'
 import type { PaymentType } from '../model'

 const props = defineProps<{
  type: PaymentType
  title: string
  description?: string
  selected: boolean
 }>()

 const getIcon = computed(() => {
  const icons = {
   ton: `${import.meta.env.BASE_URL}image/ton_logo.png`,
   usdt: `${import.meta.env.BASE_URL}image/usdt_logo.png`,
   gram: `${import.meta.env.BASE_URL}image/gram_logo.png`,
   yummy: `${import.meta.env.BASE_URL}image/yummy_logo.png`,
   upay: `${import.meta.env.BASE_URL}image/upay_logo.png`,
  }

  return icons[props.type]
 })

 defineEmits<{
  (e: 'select'): void
 }>()
</script>