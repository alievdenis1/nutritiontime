<template>
	<SliderRoot
		:class="cn(
			'relative flex w-full touch-none select-none items-center',
			props.class,
		)"
		v-bind="forwarded"
	>
		<SliderTrack class="relative h-[2px] w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
			<SliderRange class="absolute h-full bg-forestGreen" />
		</SliderTrack>
		<SliderThumb
			v-for="(_, key) in modelValue"
			:key="key"
			class="slider-thumb block h-[28px] w-[28px] rounded-full border-2 border-slate-900 bg-white border ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
		/>
	</SliderRoot>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { SliderRootEmits, SliderRootProps } from 'radix-vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'radix-vue'
import { cn } from '../../../lib/utils/utils'

const props = defineProps<SliderRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<style scoped>
.border{
	border: 1px solid #1C1C1C66
}
</style>