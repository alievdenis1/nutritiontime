<template>
	<DropdownMenuPortal>
		<DropdownMenuContent
			v-bind="forwarded"
			:class="cn('z-50 min-w-32 overflow-hidden  rounded-[16px] border border-slate-200 bg-white p-1 text-slate-950 shadow-md data-[state=open]:animate-in dat', props.class)"
		>
			<slot />
		</DropdownMenuContent>
	</DropdownMenuPortal>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
	DropdownMenuContent,
	type DropdownMenuContentEmits,
	type DropdownMenuContentProps,
	DropdownMenuPortal,
	useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '../../../lib/utils/utils'

const props = withDefaults(
	defineProps<DropdownMenuContentProps & { class?: HTMLAttributes['class'] }>(),
	{
		sideOffset: 4,
	},
)
const emits = defineEmits<DropdownMenuContentEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>