<template>
	<div class="grid w-full px-4 mb-2.5">
		<footer class="flex py-2 px-4 items-center gap-4 justify-between rounded-full bg-white shadow-custom">
			<v-button
				:class="{ 'active': isCurrentRoute('/') }"
				class="cursor-pointer flex-grow rounded-full"
				@click="navigateToHome"
			>
				<icon-home :icon-color="homeIconColor" />
				{{ t('home') }}
			</v-button>
			<v-button
				class="cursor-pointer p-3.5 bg-orange rounded-full"
				@click="openCreationModal"
			>
				<icon-plus :icon-color="'#FFFFFF'" />
			</v-button>
			<v-button
				:class="{ 'active': isCurrentRoute('/recipes') }"
				class="cursor-pointer flex-grow rounded-full"
				@click="navigateToRecipes"
			>
				<icon-search :icon-color="searchIconColor" />
				{{ t('recipes') }}
			</v-button>
		</footer>
		<ModalRecipeCreation />
	</div>
</template>

<script setup lang="ts">
import { IconHome, IconPlus, IconSearch } from '@/shared/components/Icon'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './FooterWidget.localization.json'
const { t } = useTranslation(Localization)
import { ModalRecipeCreation } from '../../entities/Modal/ui'
import { useModalStore } from 'entities/Modal/model/model.ts'
const store = useModalStore()
const router = useRouter()

const openCreationModal = () => {
	store.isModalCreateOpen = true
}

const isCurrentRoute = (route: string) => {
	return router.currentRoute.value.path === route
}

const navigateToHome = () => {
	router.push('/')
}

const navigateToRecipes = () => {
	router.push('/recipes')
}

const homeIconColor = computed(() => {
	return isCurrentRoute('/') ? '#319A6E' : '#9F9FA0'
})

const searchIconColor = computed(() => {
	return isCurrentRoute('/recipes') ? '#319A6E' : '#9F9FA0'
})
</script>

<style lang="scss" scoped>
.shadow-custom {
	box-shadow: 0px 0px 34px 0px #00000014;
}

.active {
	background: #1C1C1C0D;
	color: #319A6E;
}

.flex-grow {
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	display: flex;
	padding: 7px 0;
	flex-direction: column;
}
</style>