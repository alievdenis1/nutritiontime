<template>
	<div class="accordion">
		<button
			class="accordion-header"
			@click="toggle"
		>
			{{ title }}
			<IconArrow
				:class="{ 'rotate-180': isOpen }"
				icon-color="#000000"
				:icon-width="20"
				:icon-height="20"
			/>
		</button>
		<div
			ref="content"
			class="accordion-content"
			:style="contentStyle"
		>
			<div ref="contentContainer">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated } from 'vue'
import { IconArrow } from 'shared/components/Icon'
import { useElementSize } from '@vueuse/core'

const props = withDefaults(defineProps<{
	title: string;
	isOpen: boolean;
}>(), {
	title: '',
	isOpen: false,
})

const isOpen = ref(props.isOpen || false)
const content = ref<HTMLElement | null>(null)
const contentContainer = ref<HTMLElement>()

const { height } = useElementSize(contentContainer, undefined, { box: 'border-box' })

const contentStyle = computed(() => ({
	maxHeight: isOpen.value ? `${height.value}px` : '0',
}))

const toggle = () => {
	isOpen.value = !isOpen.value
}

// const updateHeight = () => {
// 	if (isOpen.value && content.value) {
// 		content.value.style.maxHeight = `${content.value.scrollHeight}px`
// 	}
// }
//
// onMounted(updateHeight)
//
// watch(isOpen, (newVal) => {
// 	if (newVal) {
// 		content.value?.style.setProperty('max-height', `${content.value.scrollHeight}px`)
// 	} else {
// 		content.value?.style.setProperty('max-height', '0')
// 	}
// })
</script>

<style scoped>
.accordion {
	border: 1px solid #1C1C1C0D;
	border-radius: 16px;
	padding: 20px 16px;
}

.accordion-header {
	font-size: 18px;
	line-height: 24px;
	cursor: pointer;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.accordion-content {
	overflow: hidden;
	transition: max-height 0.3s ease;
}

.rotate-180 {
	transform: rotate(180deg);
}
</style>
