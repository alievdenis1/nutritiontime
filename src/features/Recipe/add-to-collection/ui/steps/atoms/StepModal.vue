<script setup lang="ts">
import { VModal } from 'shared/components/Modal'
import { IconArrowRight, IconClose } from 'shared/components/Icon'
import Localization from '../../AddRecipeToCollection.localization.json'
import { useTranslation } from 'shared/lib/i18n'

const { t } = useTranslation(Localization)

withDefaults(defineProps<{
	withBackAction?: boolean
	lifted?: boolean
}>(), {
	withBackAction: false,
	lifted: false
})

const isVisible = defineModel<boolean>({ required: true })

const emit = defineEmits<{
	back: [],
	close: []
}>()

function close() {
	isVisible.value = false
	emit('close')
}

function back() {
	emit('back')
}
</script>

<template>
	<VModal
		:show="isVisible"
		:lifted="lifted"
		@close="close"
	>
		<div>
			<div class="flex justify-between mb-[12px] items-center">
				<h2 class="text-xl font-darkGray flex items-center">
					<IconArrowRight
						v-if="withBackAction"
						icon-color="#1C1C1C"
						class="rotate-180 mr-[12px] cursor-pointer"
						@click="back"
					/>
					{{ t('saveToCollection') }}
				</h2>

				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="close"
				>
					<IconClose icon-color="#9F9FA0" />
				</button>
			</div>

			<slot />
		</div>
	</VModal>
</template>

<style module>

</style>
