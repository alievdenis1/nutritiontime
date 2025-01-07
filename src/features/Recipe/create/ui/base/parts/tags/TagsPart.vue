<template>
	<div class="pt-5">
		<div
			class="border custom-border cursor-pointer flex items-center rounded-md px-4 py-5 tag-wrapper"
			@click="openAddTagModal"
		>
			<div class="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar">
				<div
					v-if="model.tags.length === 0"
					class="flex items-center text-gray"
				>
					<span class="mr-1">{{ t('selectTag') }}</span>
				</div>

				<div
					v-for="(tag, index) in model.tags"
					:key="tag"
					class="flex items-center gap-3.5 bg-lightGray rounded-full p-1 whitespace-nowrap px-3.5 py-2.5 tag"
					@click.stop
				>
					<span>{{ tagTitles.get(tag) }}</span>

					<button
						class="bg-transparent border-none cursor-pointer text-lg"
						@click="removeTag(index)"
					>
						<IconClose
							icon-color="#9F9FA0"
							class="w-5 h-5"
						/>
					</button>
				</div>
			</div>

			<button
				class="bg-transparent border-none text-2xl cursor-pointer ml-auto px-1"
			>
				<IconArrowRight
					icon-color="#1C1C1C"
					class="w-6 h-6"
				/>
			</button>
		</div>
	</div>

	<AddTagModal
		v-model="isAddTagModalVisible"
		v-model:selected-tags="model.tags"
	/>
</template>

<script setup lang="ts">
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './TagsPart.localization.json'
import { IconArrowRight, IconClose } from 'shared/components/Icon'
import AddTagModal from './AddTagModal.vue'
import { computed, ref } from 'vue'
import { useBaseRecipeCreationContext } from 'features/Recipe/create/model/base/use-base-recipe-creation-context.ts'
import { Tag, useTagList } from 'entities/Tag'

const { t } = useTranslation(localizations)

const { tagList } = useTagList()

const tagTitles = computed(() => {
	const map = new Map<Tag['id'], Tag['name']>()
	for (const tag of tagList.value) {
		map.set(tag.id, tag.name)
	}
	return map
})

const {
	model
} = useBaseRecipeCreationContext()

function removeTag(index: number) {
	model.tags.splice(index, 1)
}

const isAddTagModalVisible = ref(false)

const openAddTagModal = () => {
	isAddTagModalVisible.value = true
}
</script>

<style scoped>
.border {
	border: 1px solid #E1E1E1;
}

.overflow-x-auto {
	overflow-x: auto;
	display: flex;
	white-space: nowrap;
}

.no-scrollbar {
	-ms-overflow-style: none;
	/* IE and Edge */
	scrollbar-width: none;
	/* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
	display: none;
	/* Safari and Chrome */
}

.custom-scrollbar {
	overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	@apply bg-lightGray;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	@apply bg-forestGreen rounded;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	@apply bg-darkGray;
}

.tag-wrapper:hover:not(:has(.tag:hover)) {
  @apply border-darkGray transition-colors;
}
</style>
