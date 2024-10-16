<template>
	<button
		aria-label="Settings"
		:aria-expanded="languageDropDownOpen"
		class="settings-button p-[12px]"
		role="button"
		@click="languageDropDownOpen = !languageDropDownOpen"
	>
		{{ t('lang') }}
		<IconArrow
			:icon-color="'#1C1C1C'"
			:icon-width="14"
			:icon-height="14"
			:class="{ 'rotate-180': languageDropDownOpen }"
		/>
		<div
			v-show="languageDropDownOpen"
			class="language-dropdown"
		>
			<button
				:class="{ 'active': isActiveLocale('ru') }"
				@click="localeStore.setLocale('ru')"
			>
				Rus
			</button>
			<button
				:class="{ 'active': isActiveLocale('en') }"
				@click="localeStore.setLocale('en')"
			>
				Eng
			</button>
		</div>
	</button>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useLocaleStore, useTranslation } from '@/shared/lib/i18n'
import { IconArrow } from '@/shared/components/Icon'
import Localization from './LanguageSwitcher.localization.json'

const localeStore = useLocaleStore()
const { t } = useTranslation(Localization)
const target = ref(null)

const languageDropDownOpen = ref(false)

onClickOutside(target, () => languageDropDownOpen.value = false)

const isActiveLocale = computed(() => (locale: string) => localeStore.currentLocale === locale)
</script>

<style lang="scss" scoped>
.settings-button {
	@apply cursor-pointer relative flex items-center gap-[2px] rounded-[16px];
	box-shadow: 0px 0px 34px 0px #00000014;
}

.language-dropdown {
	@apply absolute left-[-64px] top-[55px] z-20 flex flex-col border-[#1C1C1C0D] text-[#1C1C1C];

	button {
		padding: 14px 0px 14px 16px;
		border: 1px solid #1C1C1C0D;
		background: #FFFFFF;
		width: 129px;

		&:hover {
			background: #c5c4c4;
		}

		&:first-child {
			border-radius: 16px 16px 0px 0px;
		}

		&:nth-child(2) {
			border-radius: 0px 0px 16px 16px;
		}
	}
}
</style>