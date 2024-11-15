<!--// components/PaymentMethodSelector.vue-->
<!--<template>-->
<!--	<div class="space-y-4">-->
<!--		<h3 class="text-yellow-400 font-bold text-lg">-->
<!--			Select Payment Method-->
<!--		</h3>-->
<!--		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">-->
<!--			<button-->
<!--				v-for="method in AVAILABLE_PAYMENT_METHODS"-->
<!--				:key="method.symbol"-->
<!--				:class="[-->
<!--					'p-4 rounded-xl transition-all duration-300',-->
<!--					modelValue?.symbol === method.symbol-->
<!--						? 'bg-yellow-500 text-black'-->
<!--						: 'bg-gray-700 hover:bg-gray-600'-->
<!--				]"-->
<!--				@click="selectMethod(method)"-->
<!--			>-->
<!--				<div class="font-bold">-->
<!--					{{ method.displayName }}-->
<!--				</div>-->
<!--				<div class="text-sm opacity-75">-->
<!--					{{ method.symbol }}-->
<!--				</div>-->
<!--			</button>-->
<!--		</div>-->
<!--	</div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!-- import { defineComponent, PropType } from 'vue'-->
<!-- import { PaymentMethod, AVAILABLE_PAYMENT_METHODS } from '../model'-->

<!-- export default defineComponent({-->
<!--  name: 'PaymentMethodSelector',-->
<!--  props: {-->
<!--   modelValue: {-->
<!--    type: Object as PropType<PaymentMethod>,-->
<!--    required: true-->
<!--   }-->
<!--  },-->
<!--  emits: ['update:modelValue'],-->
<!--  setup(_, { emit }) {-->
<!--   const selectMethod = (method: PaymentMethod) => {-->
<!--    emit('update:modelValue', method)-->
<!--   }-->

<!--   return {-->
<!--    AVAILABLE_PAYMENT_METHODS,-->
<!--    selectMethod-->
<!--   }-->
<!--  }-->
<!-- })-->
<!--</script>-->
