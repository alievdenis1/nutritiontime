<template>
	<div class="flex justify-start items-start flex-col z-40 border w-full rounded input-list">
		<span
			v-for="item of props.list"
			:key="item.id"
			class="p-3 text-[#1C1C1C] text-description font-normal text-left w-full"
			@mousedown="onSelect(item)"
		>
			{{ item.title }}
		</span>
		<p
			v-if="noResults"
			class="p-3 text-[#1C1C1C] text-description font-normal text-left pointer-events-none"
		>
			{{ t('noResults') }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InputListItem } from '../types'
import Localization from './InputList.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

interface InputListProps {
    list: InputListItem[]
}
type InputListEmits = {
    select: [value: InputListItem]
}

const { t } = useTranslation(Localization)

const props = defineProps<InputListProps>()
const emits = defineEmits<InputListEmits>()

const noResults = computed((): boolean => !props.list.length)

const onSelect = (item: InputListItem): void => {
    emits('select', item)
}
</script>

<style lang="scss" scoped>
.input-list {
	@apply border-1 border-solid border;
	border-top-color: transparent;
	border-top-left-radius: 0px;
	border-top-right-radius: 0px;
}
</style>