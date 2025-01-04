import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

export type ConfirmCallback = (isConfirmed: boolean) => void
export interface ConfirmProps {
	title: string;
	description?: string;
	cancelButtonText?: string;
	confirmButtonText?: string;
}

export interface ConfirmData extends ConfirmProps {
	callback: ConfirmCallback
}
export interface State {
	isOpen: Ref<boolean>
	props: Ref<ConfirmData | null>
	openConfirm: (data: ConfirmData) => void
	onClose: (isSubmitted: boolean) => void
}

export const useConfirmStore = defineStore('confirm', (): State => {
	const isOpen = ref<boolean>(false)
	const props = ref<ConfirmData | null>(null)

	const openConfirm = (data: ConfirmData): void  => {
		props.value = data
		isOpen.value = true
	}

	const onClose = (isSubmitted: boolean): void => {
		if (props.value) {
			props.value.callback(isSubmitted)

			const timerId = setTimeout(() => {
				props.value = null
				clearTimeout(timerId)
			}, 200)
		}
		isOpen.value = false
	}

	return {
		isOpen,
		props,
		openConfirm,
		onClose
	}
})

export const openConfirm = (props: ConfirmProps): Promise<boolean> => {
	return new Promise((resolve) => {
		const callback: ConfirmCallback = (isConfirmed) => {
			return resolve(isConfirmed)
		}

		useConfirmStore().openConfirm({ ...props, callback })
	})
}
