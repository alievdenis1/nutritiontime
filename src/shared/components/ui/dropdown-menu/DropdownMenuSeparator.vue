<template>
	<DropdownMenuSeparator
		v-bind="delegatedProps"
		:class="cn('-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800', props.class)"
	/>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
	DropdownMenuSeparator,
	type DropdownMenuSeparatorProps,
} from 'radix-vue'
import { cn } from '../../../lib/utils/utils'

const props = defineProps<DropdownMenuSeparatorProps & {
	class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})
</script>

