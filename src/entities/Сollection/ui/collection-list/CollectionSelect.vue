<script setup lang="ts">
import { IconArrow } from 'shared/components/Icon'
import { useCollectionList } from 'entities/Сollection/model/use-collection-list.ts'
import { computed, ref, watch } from 'vue'
import { softFilterBySearchQuery } from 'shared/lib/mapping/filtering.ts'
import type { Collection } from 'entities/Сollection/types/typesCollection.ts'
import Localization from './CollectionSelect.Localization.json'
import { useTranslation } from 'shared/lib/i18n'

const { t } = useTranslation(Localization)

const props = withDefaults(defineProps<{
	defaultFirstItem?: boolean
}>(), {
	defaultFirstItem: false
})

const {
	collections,
	isLoadingCollections
} = useCollectionList()

const searchQuery = ref('')

const selectedCollection = defineModel<number | null>({ required: true })

watch(collections, (newCollections) => {
	if (newCollections.length && props.defaultFirstItem) {
		selectedCollection.value = newCollections[0].id
	}
}, { immediate: true, deep: true })

const filteredCollectionList = computed(() => {
	return softFilterBySearchQuery({
		data: collections.value,
		query: searchQuery.value,
		key: 'name'
	})
})

const isDropdownVisible = ref(false)

function openDropdown() {
	isDropdownVisible.value = true
}

function closeDropdown() {
	isDropdownVisible.value = false
}

function selectCollection(collection: Collection) {
	searchQuery.value = collection.name
	selectedCollection.value = collection.id
	closeDropdown()
}

function toggleDropdown() {
	isDropdownVisible.value = !isDropdownVisible.value
}
</script>

<template>
	<div>
		<div class="relative">
			<span
				v-if="selectedCollection"
				class="absolute text-[12px] top-[6px] left-[12px] text-gray"
			>
				{{ t('title') }}
			</span>

			<input
				v-model="searchQuery"
				name="collection"
				type="text"
				:placeholder="t('placeholder')"
				class="border rounded text-base w-full pt-[26px] pl-[12px] pb-[10px] cursor-pointer"
				:class="{ 'padding-filled': selectedCollection, 'padding-empty': !selectedCollection }"
				@click="toggleDropdown"
			>

			<IconArrow
				:class="['absolute right-[12px] top-1/2 transform -translate-y-1/2 transition-transform w-[24px] h-[24px] pointer-events-none', { 'rotate-180': isOpen }]"
				icon-color="#1C1C1C"
			/>
		</div>

		<div
			v-if="isDropdownVisible"
			class="mt-2 bg-white border rounded-md shadow-lg"
		>
			<div
				v-for="collection in filteredCollectionList"
				:key="collection.id"
				v-loading="isLoadingCollections"
				class="px-4 py-2 hover:bg-lightGray cursor-pointer"
				@click="selectCollection(collection)"
			>
				{{ collection.name }}
			</div>
		</div>
	</div>
</template>

<style module>

</style>
