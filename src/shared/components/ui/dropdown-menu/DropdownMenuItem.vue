<template>
	<DropdownMenuItem
		v-bind="forwardedProps"
		:class="cn(
			'flex gap-[10px] cursor-default select-none items-center rounded-sm px-[16px] py-[14px] cursor-pointer',
			inset && 'pl-8',
			props.class,
		)"
	>
		<slot />
	</DropdownMenuItem>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from 'radix-vue'
import { cn } from '../../../lib/utils/utils'

const props = defineProps<DropdownMenuItemProps & { class?: HTMLAttributes['class'], inset?: boolean }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>
