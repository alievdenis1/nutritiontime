<template>
	<!-- Первая модалка -->
	<VModal
		:lifted="isModalLifted"
		:show="store.modalIsActive"
		@close="store.toggleModalClose"
	>
		<div>
			<div class="flex justify-between mb-[12px] items-center">
				<h2 class="text-xl font-darkGray">
					{{ t('saveToCollection') }}
				</h2>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="store.toggleModalClose"
				>
					<IconClose icon-color="#9F9FA0" />
				</button>
			</div>

			<div class="mb-[20px] mt-[20px] relative">
				<div class="relative">
					<span
						v-if="selectedCollection"
						class="absolute text-[12px] top-[6px] left-[12px] text-gray"
					>
						{{ t('collection') }}
					</span>
					<input
						v-model="selectedCollection"
						type="text"
						:placeholder="t('selectCollection')"
						class="border rounded text-base w-full pt-[26px] pl-[12px] pb-[10px] cursor-pointer"
						:class="{ 'padding-filled': selectedCollection, 'padding-empty': !selectedCollection }"
						readonly
						@click="toggleDropdown"
					>
					<IconArrow
						:class="['absolute right-[12px] top-1/2 transform -translate-y-1/2 transition-transform w-[24px] h-[24px] pointer-events-none', { 'rotate-180': isOpen }]"
						icon-color="#1C1C1C"
					/>
				</div>
				<div
					v-if="isOpen"
					class="mt-2 bg-white border rounded-md shadow-lg"
				>
					<div
						v-for="collection in collectionOptions"
						:key="collection.value"
						class="px-4 py-2 hover:bg-lightGray cursor-pointer"
						@click="selectCollection(collection.value)"
					>
						{{ collection.label }}
					</div>
				</div>
			</div>
			<VButton
				:color="ButtonColors.White"
				class="mt-[24px]"
				@click="openSecondModal"
			>
				{{ t('newCollection') }}
				<IconArrowRight
					icon-color="#319A6E"
					class="ml-[12px]"
				/>
			</VButton>
			<VButton
				:color="ButtonColors.Green"
				class="mt-[8px]"
				@click="onSaveRecipeToFavourite"
			>
				{{ t('save') }}
			</VButton>
		</div>
	</VModal>

	<!-- Вторая модалка -->
	<VModal
		:show="store.secondModalIsActive"
		@close="store.toggleSecondModalClose"
	>
		<div>
			<div class="flex justify-between mb-[12px] items-center">
				<h2 class="text-xl font-darkGray flex items-center">
					<IconArrowRight
						icon-color="#1C1C1C"
						class="rotate-180 mr-[12px] cursor-pointer"
						@click="backToFirstModal"
					/>
					{{ t('saveToCollection') }}
				</h2>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="store.toggleSecondModalClose"
				>
					<IconClose icon-color="#9F9FA0" />
				</button>
			</div>

			<VInput
				v-model="newSelectedCollection"
				type="text"
				:title="t('nameCollection')"
				:style="{ color: '#535353' }"
				@focus="setModalLifted(true)"
				@blur="setModalLifted(false)"
			/>
			<VButton
				:color="ButtonColors.Green"
				class="mt-[24px]"
				@click="backToFirstModal"
			>
				{{ t('createAndSaveRecipe') }}
			</VButton>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VModal } from 'shared/components/Modal'
import { IconClose, IconArrow, IconArrowRight } from 'shared/components/Icon'
import { useSearchStore } from '../store/search-store'
import { useRecipeStore } from '../../DetailedCardRecipe/stores/recipeStore'
import { useTranslation } from 'shared/lib/i18n'
import { VInput } from 'shared/components/Input'
import Localization from './CreateCollection.localization.json'
import { VButton, ButtonColors } from 'shared/components/Button'

const store = useSearchStore()
const recipeStore = useRecipeStore()
const isOpen = ref(false)

const { t } = useTranslation(Localization)

const collectionOptions = ref([
	{ label: 'Вкусняшки на завтра', value: 'Вкусняшки на завтра' },
	{ label: 'Ещё одна коллекция', value: 'Ещё одна коллекция' },
])

const isModalLifted = ref(false)

const selectedCollection = computed(() => {
	if (showSelectedCollection.value) {
		return showSelectedCollection.value
	}
	return collectionOptions.value.length > 0 ? collectionOptions.value[0].label : ''
})

const showSelectedCollection = ref('')
const newSelectedCollection = ref('Новая коллекция')

const toggleDropdown = () => {
	isOpen.value = !isOpen.value
}

const selectCollection = (collection: string) => {
	showSelectedCollection.value = collection
	isOpen.value = false
}

// Открыть вторую модалку
const openSecondModal = () => {
	store.toggleModalClose() // Закрываем первую модалку
	store.toggleSecondModalOpen() // Открываем вторую модалку
}

const onSaveRecipeToFavourite = () => {
	store.toggleModalClose()
	recipeStore.toggleRecipeFavourited(true)
}

// Вернуться к первой модалке
const backToFirstModal = () => {
	collectionOptions.value.unshift({
		label: newSelectedCollection.value,
		value: newSelectedCollection.value
	})

	store.toggleSecondModalClose() // Закрываем вторую модалку
	store.toggleModalOpen() // Открываем первую модалку
}

const setModalLifted= (isLifted: boolean) => {
	isModalLifted.value = isLifted
}
</script>

<style scoped lang="scss">
.border {
	border: 1px solid #319A6E33;
}
</style>@/entities/Recipe/Search