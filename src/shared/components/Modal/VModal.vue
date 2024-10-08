<template>
	<transition
		name="background"
		@before-enter="disableScroll"
		@after-leave="enableScroll"
		@click="closeModal"
	>
		<div
			v-show="isVisible"
			class="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-end justify-center"
		>
			<transition name="modal">
				<div
					v-show="isVisible"
					class="bg-white transition-all p-4 rounded-t-xl width-custom max-w-md relative z-50 modal-content"
					:class="{'rounded-b-xl': props.lifted}"
					:style="{ transform: `translateY(-${liftedHeight}px)`}"
					@click.stop
				>
					<button
						v-if="!props.hideCloseIcon"
						class="absolute z-10 right-4 top-4 cursor-pointer px-[13px] py-[13px] rounded-[100px] bg-lightGray ml-[8px]"
						@click="closeModal"
					>
						<IconClose :icon-color="'#000000'" />
					</button>
					<slot />
				</div>
			</transition>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { IconClose } from 'shared/components/Icon'

import { ref, watch } from 'vue'
const props = defineProps<{
	show: boolean;
	hideCloseIcon?: boolean
	lifted?: boolean
}>()
const emit = defineEmits(['close'])

const isVisible = ref(props.show)
const liftedHeight = ref(0)

watch(() => props.show, (newVal) => {
	isVisible.value = newVal
})

watch(() => props.lifted, () => {
	if (window.visualViewport) {
		liftedHeight.value = window.innerHeight - window.visualViewport.height
	}
})

const closeModal = () => {
	isVisible.value = false
	emit('close')
}

const disableScroll = () => {
	document.body.style.overflow = 'hidden'
}

const enableScroll = () => {
	document.body.style.overflow = ''
}
</script>

<style scoped>
.width-custom{
	max-width: 375px;
	width: 100%;
}
.modal-content {
	max-height: calc(100vh - 64px);
}
</style>