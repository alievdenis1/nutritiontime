<template>
	<div class="p-4">
		<div class="flex items-center justify-between  mb-[22px] ">
			<button
				class="p-[12px] rotate-180 shadow-2xl bg-white rounded-[50%] shadow-custom cursor-pointer"
				@click="$router.go(-1)"
			>
				<IconArrowRight
					icon-color="#000000"
					class="w-6 h-6"
				/>
			</button>
			<h1 class="font-semibold text-lg">
				{{ t('recipeReviewTitle') }}
			</h1>
			<div />
		</div>
		<div class="mb-4">
			<h2 class="text-base font-semibold mb-[12px]">
				{{ t('howUsersWillSee') }}
			</h2>
			<p class="text-slateGray text-sm">
				{{ t('reviewDescription') }}
			</p>
		</div>
		<div class="bg-lightGray rounded-[16px] h-[450px] flex items-center justify-center flex-col">
			<div class="text-gray text-center text-xs">
				{{ t('recipeCardPlaceholderTop') }}
			</div>
			<div class="text-gray text-center text-xs">
				{{ t('recipeCardPlaceholderButton') }}
			</div>
		</div>
		<v-button
			:color="ButtonColors.Green"
			class="mt-6 mb-10"
		>
			<div class="flex gap-3  justify-center items-center w-full text-sm">
				<div>{{ t('createNftAndPublishRecipe') }}</div>
				<IconArrowRight icon-color="#FFFFFF" />
			</div>
		</v-button>
	</div>
</template>

<script setup lang="ts">
import { useTranslation } from '@/shared/lib/i18n'
import { IconArrowRight } from '@/shared/components/Icon'
import { ButtonColors } from '@/shared/components/Button'
import { VButton } from '@/shared/components/Button'
import localizations from './CheckRecipe.localization.json'

const { t } = useTranslation(localizations)
</script>

<style scoped>

</style>