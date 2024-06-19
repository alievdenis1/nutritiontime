<template>
	<transition name="fade">
		<div
			v-if="visible"
			class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 w-342 p-[25px]"
			@click="close"
		>
			<div
				class="bg-[#F5F5F5] rounded-[16px] shadow-lg max-w-md w-full "
				style="width: 342px;"
				@click.stop
			>
				<header
					class="w-full relative pt-[16px] pl-[16px] pr-[16px]"
				>
					<h2
						v-if="currentConfig.headerType === 'text'"
						class="border-b-4 border-black pb-2"
					>
						{{ currentConfig.headerContent }}
						<VDivider class="absolute -bottom-3 left-0 right-0" />
					</h2>
					<div
						v-if="currentConfig.headerType === 'image'"
						class="flex justify-center"
					>
						<icon-bin />
					</div>
				</header>
				<main class="pt-[12px] pl-[16px] pr-[16px]">
					<textarea
						v-if="currentConfig.mainContentType === 'input'"
						:v-model="inputValue"
						:placeholder="currentConfig.inputContent"
						class="w-full p-4 text-base text-gray-700 bg-white border border-gray-300 rounded-[16px] focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
						style="height: 90px; resize: none;"
					/>
					<p
						v-else-if="currentConfig.mainContentType === 'text'"
						class="text-red text-lg text-center"
					>
						{{ currentConfig.inputContent }}
					</p>
				</main>
				<footer class="mt-4 flex justify-end gap-3 pb-[14px] pl-[16px] pr-[16px]">
					<VButton
						:color="currentConfig.buttonColor"
						:border-radius="40"
						@click="confirm"
					>
						{{ currentConfig.buttonText }}
					</VButton>
					<VButton
						:color="ButtonColors.White"
						:border-radius="40"
						@click="close"
					>
						Отмена
					</VButton>
				</footer>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { computed,toRefs } from 'vue'
import VButton from '../Button/VButton.vue'
import { ButtonColors } from '../Button/config'
import VDivider from '../Divider/VDivider.vue'
import IconBin from '../Icon/IconBin.vue'
import { ModalOption } from './config'
import { modalConfig  } from './index'

const props = withDefaults(defineProps<{
	visible?: boolean,
	modalOption: ModalOption,
	inputValue: string
}>(), {
	visible: false,
	modalOption: ModalOption.EDIT,
	inputValue: ''
})

const { visible, modalOption, inputValue } = toRefs(props)

const currentConfig = computed(() => modalConfig[modalOption.value])

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'confirm'): void;
}>()

const close = () => {
  emit('update:visible',  false)
}

const confirm = () => {
  emit('confirm')
  close()
}
</script>

<style lang="scss" scoped>
</style>