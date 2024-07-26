<template>
	<div>
		<div class="flex justify-between items-center mb-[16px]">
			<button
				class="p-[12px] rotate-180 shadow-2xl bg-white rounded-[50%] shadow-custom cursor-pointer"
				@click="$router.go(-1)"
			>
				<IconArrowRight icon-color="#1C1C1C" />
			</button>
			<h2 class="text-center text-lg text-darkGray">
				{{ t('addRecipe') }}
			</h2>
			<div />
		</div>
		<div
			v-for="(item, index) in items"
			:key="index"
			class="border-default rounded-lg p-4 mb-4 flex items-start cursor-pointer h-[100px]"
			:class="{ 'border-active': selected === index, 'border-gray': selected !== index }"
			@click="selectItem(index)"
		>
			<input
				v-model="selected"
				type="radio"
				:value="index"
				class="mr-4 mt-1"
			>
			<div>
				<div class="flex items-center gap-[8px] ">
					<div
						class="border-select rounded-[50%] w-[20px] h-[20px] flex items-center justify-center"
						:class="{ 'border-select-active': selected === index }"
					>
						<div
							v-if="selected === index"
							class="bg-forestGreen rounded-[50%] w-[8px] h-[8px]"
						/>
					</div>
					<h3 class="text-darkGray text-lg mb-[4px]">
						{{ item.title }}
					</h3>
				</div>
				<p class="text-slateGray text-sm ml-[28px] truncate-multiline">
					{{ item.description }}
				</p>
			</div>
		</div>
		<div class="fixed bottom-[100px] left-[16px] right-[16px] flex justify-between flex-col gap-[12px]">
			<VButton
				:color="ButtonColors.Green"
				class="flex-grow"
				:class="['flex items-center justify-center block w-full mt-4 px-[20px] h-[50px] rounded-xl text-white text-sm text-center cursor-pointer']"
				@click="TagChangedRoute"
			>
				<div class="flex items-center gap-[4px] text-sm">
					<div>
						{{ t('generateWithSelected') }}
					</div>
					<IconAi
						v-if="!isSmallScreen"
						icon-color="#FFFFFF"
					/>
				</div>
			</VButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IconArrowRight, IconAi } from 'shared/components/Icon'
import { VButton, ButtonColors } from 'shared/components/Button'
import { useRouter } from 'vue-router'
const router = useRouter()

interface Item {
	title: string;
	description: string;
}

const isSmallScreen = ref(window.innerWidth <= 350)

const TagChangedRoute = () => {
	router.push('/tag-recipe')
}

import { useTranslation } from '@/shared/lib/i18n'
import localizations from './ReadyIdeasRecipe.localization.json'

const { t } = useTranslation(localizations)

const items = ref<Item[]>([
	{ title: 'Яблочный пирог', description: 'Яблочный пирог из слоённого теста с добавлением корицы, ванили и перца' },
	{ title: 'Яблочный пирог', description: 'Яблочный пирог из слоённого теста с добавлением корицы, ванили и перца' },
	{ title: 'Яблочный пирог', description: 'Яблочный пирог из слоённого теста с добавлением корицы, ванили и перца' },
	{ title: 'Яблочный пирог', description: 'Яблочный пирог из слоённого теста с добавлением корицы, ванили и перца' }
])

const selected = ref<number | null>(null)

const selectItem = (index: number) => {
	selected.value = index
}
</script>

<style scoped>
.border-default {
	border: 1px solid #1C1C1C0D
}

.border-active {
	border: 1px solid #319A6E33
}

.border-select {
	border: 1px solid #E1E1E1
}

.border-select-active {
	border: 1px solid #319A6E33
}

.truncate-multiline {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>