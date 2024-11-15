<template>
	<VModal
		:lifted="isModalLifted"
		:show="store.isModalOpen"
		@close="store.closeModal"
	>
		<div>
			<div class="flex justify-between mb-[12px] items-center">
				<h2 class="text-xl font-bold text-darkGray">
					{{ store.titleModal }}
				</h2>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="store.closeModal"
				>
					<IconClose icon-color="#9F9FA0" />
				</button>
			</div>
			<div class="space-y-4">
				<p
					v-if="store.descModal && store.descModal.length"
					class="w-[260px] inline text-slateGray text-sm"
				>
					{{ store.descModal }}
					<IconFavorites
						class="inline-block align-text-center w-[15px] h-[15px]"
						icon-color="#9F9FA0"
					/>
				</p>
				<VInput
					v-model="store.inputValue"
					:title="inputTitle"
					:error="inputError"
					:error-message="errorMessage"
					:autofocus="true"
					@update:value="validateInput"
					@focus="setModalLifted(true)"
					@blur="setModalLifted(false)"
				/>
				<VButton
					:disabled="!isInputValueChanged"
					:color="ButtonColors.Green"
					@click="handleSubmit"
				>
					{{ t(store.collectionId !== null ? 'saveButton' : 'createButton') }}
				</VButton>
			</div>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { VModal } from 'shared/components/Modal'
import { IconClose, IconFavorites } from 'shared/components/Icon'
import { useModalStore } from '../store/collections.store'
import { VInput } from 'shared/components/Input'
import { VButton, ButtonColors } from 'shared/components/Button'
import { useTranslation } from '@/shared/lib/i18n'
import localization from './ModalCollection.localization.json'

const store = useModalStore()
const { t } = useTranslation(localization)

const inputTitle = ref('Название коллекции')
const inputError = ref(false)
const errorMessage = ref('')
const isModalLifted = ref(false)
const isInputValueChanged = ref(false)

const validateInput = (value: string) => {
	if (value.trim() === '') {
		inputError.value = true
		errorMessage.value = 'Нужно придумать название для коллекции'
	} else {
		inputError.value = false
		errorMessage.value = ''
	}
}

const handleSubmit = () => {
	validateInput(store.inputValue)
	if (!inputError.value) {
		store.saveCollection()
	}
}

const setModalLifted = (isLifted: boolean) => {
	isModalLifted.value = isLifted
}

watch(() => store.isModalOpen, (isOpen) => {
	if (isOpen) {
		inputError.value = false
		errorMessage.value = ''
	}
})

watch(() => store.inputValue, (newVal) => {
	isInputValueChanged.value = newVal !== store.initialInputValue && newVal !== ''
})
</script>