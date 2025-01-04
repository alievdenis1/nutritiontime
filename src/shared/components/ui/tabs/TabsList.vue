<template>
	<TabsList
		v-bind="delegatedProps"
		:class="cn(
			'w-[100%] inline-flex h-[44px] items-center gap-[5px] justify-center rounded-[16px] bg-lightGray p-1 dark:bg-slate-800',
			props.class,
		)"
	>
		<slot />
	</TabsList>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsList, type TabsListProps } from 'radix-vue'
import { cn } from '../../../lib/utils/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})
</script>

