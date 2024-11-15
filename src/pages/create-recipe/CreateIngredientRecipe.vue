<template>
	<div class="flex flex-col gap-[20px] p-[16px] pb-[78px]">
		<div class="flex justify-center items-center min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('addRecipe') }}
			</h2>
		</div>
		<CreateRecipeIngredients
			:title="t('ingredientsTitle')"
			:desc="t('ingredientsDesc')"
		>
			<div class="bg-lightGray p-4 rounded-lg shadow-sm">
				<h2 class="text-sm text-darkGray font-semibold mb-2">
					{{ t('identifyByPhotoTitle') }}
				</h2>
				<p class="text-xs text-slateGray mb-4">
					{{ t('identifyByPhotoDesc') }}
				</p>
				<VButton
					:color="ButtonColors.White"
					class="border-img-add"
					@click="handleButtonClick"
				>
					<VAddPhoto
						ref="addPhotoRef"
						icon-color="#319A6E"
						text-color="#319A6E"
						:title="t('identifyByPhotoButton')"
						:width-image="32"
						:height-image="32"
						:height-main="40"
						:icon="IconCamera"
					/>
				</VButton>
			</div>
			<div class="mt-4 flex items-center bg-lightGray p-[12px] rounded-lg">
				<input
					id="useOnly"
					v-model="useOnlyTheseIngredients"
					type="checkbox"
					class="form-checkbox h-4 w-4 border-check cursor-pointer"
				>
				<label
					for="useOnly"
					class="ml-2 text-sm text-gray-700 cursor-pointer"
				>
					{{ t('useOnlyTheseIngredients') }}
				</label>
			</div>
		</CreateRecipeIngredients>

		<CreateRecipeIngredients
			:is-exclusion-mode="true"
			:title="t('excludeIngredientsTitle')"
			:desc="t('excludeIngredientsDesc')"
		/>

		<div class="fixed bottom-[110px] left-[16px] right-[16px] flex justify-between flex-col gap-[12px]">
			<VButton
				:color="ButtonColors.Green"
				class="flex-grow"
				:class="['flex items-center justify-center block w-full px-[20px] h-[50px] rounded-xl text-white text-sm text-center cursor-pointer']"
				@click="TagChangedRoute"
			>
				<div class="flex items-center gap-[4px] text-sm">
					<div>
						{{ t('generateRecipeButton') }}
					</div>
					<IconAi icon-color="#FFFFFF" />
				</div>
			</VButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CreateRecipeIngredients } from 'entities/Recipe/CreateRecipe/recipe-models'
import { IconCamera, IconAi } from 'shared/components/Icon'
import { VAddPhoto } from 'shared/components/AddPhoto'
import { VButton, ButtonColors } from 'shared/components/Button'
const useOnlyTheseIngredients = ref(false)
import { useRouter } from 'vue-router'

const router = useRouter()
import { useTranslation } from '@/shared/lib/i18n'
import localizations from './CreateIngredientRecipe.localization.json'

const { t } = useTranslation(localizations)

const TagChangedRoute = () => {
	router.push('/tag-recipe')
}

const addPhotoRef = ref()

const handleButtonClick = () => {
	addPhotoRef.value.openFileDialog()
}
</script>

<style scoped>
.border-img-add {
	border: 1px solid #319A6E;
	cursor: pointer;
}

.border-check {
	border: 1px solid #E1E1E1;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	width: 16px;
	height: 16px;
	border-radius: 3px;
	outline: none;
	cursor: pointer;
	background-color: white;
	/* Оставляем белый фон */
}

.border-check:checked {
	/* Зеленая рамка для активного состояния */
	background-color: white;
	/* Оставляем белый фон при активном состоянии */
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23319A6E'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
	background-size: 100% 100%;
	background-position: center;
	background-repeat: no-repeat;
}
</style>