<script setup lang="ts">
import { VModal } from 'shared/components/Modal'
import { IconClose } from 'shared/components/Icon'
import { TagSelect } from 'entities/Tag'
import { useTranslation } from 'shared/lib/i18n'
import Localization from './TagsPart.localization.json'
import { computed, ref, watch } from 'vue'

const { t } = useTranslation(Localization)

const isVisible = defineModel<boolean>({ required: true })

function close() {
	isVisible.value = false
}

const selectedTags = defineModel<number[]>('selectedTags',{
	required: true
})

const tagsToAdd = ref([...selectedTags.value])

watch(selectedTags, (tags) => {
	tagsToAdd.value = [...tags]
})

const isButtonDisabled = computed(() => tagsToAdd.value.length === 0)

const buttonClass = computed(() => {
	return tagsToAdd.value.length > 0
		? 'bg-forestGreen'
		: 'bg-disabled cursor-not-allowed'
})

function onSave() {
	selectedTags.value = [...tagsToAdd.value]
	close()
}
</script>

<template>
	<VModal
		:show="isVisible"
		@close="close"
	>
		<div class="h-[90vh] flex flex-col">
			<div class="flex justify-between mb-5">
				<h2 class="text-xl flex items-center">
					{{ t('addTagTitle') }}
				</h2>
				<div class="w-12 h-12 flex items-center justify-center bg-lightGray rounded-full">
					<IconClose
						class="w-6 h-6 cursor-pointer"
						icon-color="#9F9FA0"
						@click="close"
					/>
				</div>
			</div>
			<div class="flex-grow overflow-y-auto custom-scrollbar">
				<TagSelect
					v-model="tagsToAdd"
					:chunk-amount="100"
					is-subtitle
				/>
			</div>

			<button
				:class="['block w-full mt-4 py-2 rounded-xl text-white text-center cursor-pointer', buttonClass]"
				:disabled="isButtonDisabled"
				@click="onSave"
			>
				{{ t('addSelectedTag') }}
			</button>
		</div>
	</VModal>
</template>

<style module>

</style>
