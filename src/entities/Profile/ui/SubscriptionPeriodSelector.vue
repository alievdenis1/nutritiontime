// components/SubscriptionPeriodSelector.vue
<template>
	<div class="space-y-4">
		<h3 class="text-yellow-400 font-bold text-lg">
			Select Subscription Period
		</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<button
				v-for="period in SUBSCRIPTION_PERIODS"
				:key="period.months"
				:class="[
					'p-4 rounded-xl transition-all duration-300',
					modelValue?.months === period.months
						? 'bg-yellow-500 text-black'
						: 'bg-gray-700 hover:bg-gray-600'
				]"
				@click="selectPeriod(period)"
			>
				<div class="font-bold">
					{{ period.months }} {{ period.months === 1 ? 'Month' : 'Months' }}
				</div>
				<div class="text-sm opacity-75">
					${{ period.price_rub / 100 }}
				</div>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
 import { defineComponent, PropType } from 'vue'
 import { SubscriptionPeriod, SUBSCRIPTION_PERIODS } from '../model'

 export default defineComponent({
  name: 'SubscriptionPeriodSelector',
  props: {
   modelValue: {
    type: Object as PropType<SubscriptionPeriod>,
    required: true
   }
  },
  emits: ['update:modelValue'],
  setup(_, { emit }) {
   const selectPeriod = (period: SubscriptionPeriod) => {
    emit('update:modelValue', period)
   }

   return {
    SUBSCRIPTION_PERIODS,
    selectPeriod
   }
  }
 })
</script>