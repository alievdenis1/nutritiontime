<template>
	<div class="grid w-full px-[26px] mb-[10px]">
		<footer
			class="flex py-[8px] px-[16px] items-center gap-[16px] justify-between  rounded-[100px] bg-white shadow-custom"
		>
			<v-button
				:class="{ 'active': isActive('/') }"
				class="cursor-pointer flex-grow rounded-[100px]"
				@click="router.push('/')"
			>
				<icon-home :icon-color="homeIconColor" />
				{{ t('home') }}
			</v-button>
			<v-button
				class="cursor-pointer p-[14.5px] bg-orange rounded-[50%]"
				@click="router.push('/create-recipe')"
			>
				<icon-plus :icon-color="'#FFFFFF'" />
			</v-button>
			<v-button
				:class="{ 'active': isActive('/:id') }"
				class="cursor-pointer flex-grow rounded-[100px]"
				@click="router.push('/:id')"
			>
				<icon-search :icon-color="searchIconColor" />
				{{ t('recipes') }}
			</v-button>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { IconHome, IconPlus, IconSearch } from '@/shared/components/Icon'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './FooterWidget.localization.json'
const { t } = useTranslation(Localization)

const router = useRouter()

const isActive = (route: string) => {
	return router.currentRoute.value.path === route
}

const homeIconColor = computed(() => {
	return isActive('/') ? '#319A6E' : '#9F9FA0'
})

const searchIconColor = computed(() => {
	return isActive('/:id') ? '#319A6E' : '#9F9FA0'
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
	padding: 7px 33px;
	flex-direction: column;
}
</style>