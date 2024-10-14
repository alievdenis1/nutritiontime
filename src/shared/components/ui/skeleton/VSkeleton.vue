<template>
	<div :class="cn('animate-pulse bg-[#e0e0e0] dark:bg-slate-800', props.class)" />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../../lib/utils/utils'

interface SkeletonProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<SkeletonProps>()
</script>
