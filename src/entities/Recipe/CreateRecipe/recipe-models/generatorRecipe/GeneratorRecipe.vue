<template>
	<h2 class="text-lg text-darkGray font-semibold mb-4">
		{{ t('generateRecipeTitle') }}
	</h2>

	<div class="mb-[32px] relative">
		<span
			v-if="recipeIdea.length > 0"
			class="absolute text-[12px] top-[8px] left-[12px] text-gray z-10 bg-mainBg px-1"
		>
			{{ t('describeIdeaPlaceholderActive') }}
		</span>
		<textarea
			v-model="recipeIdea"
			:class="{
				'border-custom-red': isTextareaActive,
				'padding-filled': recipeIdea.length > 0,
				'padding-empty': recipeIdea.length === 0
			}"
			:placeholder="t('describeIdeaPlaceholderDefault')"
			class="w-full h-[120px] border-custom rounded-[4px] mb-[4px] px-[12px] resize-none overflow-y-auto"
			@input="validateInput"
		/>
		<p class="text-sm text-gray">
			{{ t('exampleIdea') }}
		</p>
	</div>

	<div class="space-y-4 mb-[62px]">
		<div
			class="flex justify-between gap-[8px] items-center p-3 border-custom rounded-[8px] cursor-pointer p-[16px] h-[100px]"
			@click="GenerateReadyIdeas"
		>
			<div>
				<h3 class="text-lg text-darkGray mb-[4px]">
					{{ t('readyIdeasTitle') }}
				</h3>
				<p class="text-sm text-slateGray">
					{{ t('readyIdeasDescription') }}
				</p>
			</div>
			<IconArrowRight
				icon-color="#1C1C1C"
				class="icon-fixed-size bg-lightGray"
			/>
		</div>

		<div
			class="flex justify-between gap-[8px] items-center p-3 border-custom rounded-[8px] cursor-pointer p-[16px] h-[100px]"
			@click="GenerateIngredient"
		>
			<div>
				<h3 class="text-lg  text-darkGray mb-[4px]">
					{{ t('generateByIngredientsTitle') }}
				</h3>
				<p class="text-sm text-slateGray">
					{{ t('generateByIngredientsDescription') }}
				</p>
			</div>
			<IconArrowRight
				icon-color="#1C1C1C"
				class="icon-fixed-size bg-lightGray"
			/>
		</div>
	</div>
	<div class="fixed bottom-[112px] left-[16px] right-[16px] flex justify-between flex-col gap-[12px]">
		<VButton
			:color="ButtonColors.Green"
			class="flex-grow"
			:class="['flex items-center justify-center block w-full mt-4 px-[20px] h-[50px] rounded-xl text-white text-sm text-center cursor-pointer']"
			@click="GenerateYourIdeas"
		>
			<div class="flex items-center gap-[4px] text-sm">
				<div>
					{{ t('generateButtonText') }}
				</div>
				<IconAi
					v-if="!isSmallScreen"
					icon-color="#FFFFFF"
				/>
			</div>
		</VButton>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { IconArrowRight, IconAi } from 'shared/components/Icon'
import { VButton, ButtonColors } from 'shared/components/Button'
import localization from './GeneratorRecipe.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { useRouter } from 'vue-router'

const { t } = useTranslation(localization)
const router = useRouter()
const recipeIdea = ref('')
const isTextareaActive = ref(false)

const generateRecipe = () => {
	if (!recipeIdea.value.trim()) isTextareaActive.value = true
	else isTextareaActive.value = false
}
const isSmallScreen = ref(window.innerWidth <= 370)

const GenerateYourIdeas = () => {
	generateRecipe()
	if (recipeIdea.value.length > 0) router.push('/tag-recipe')
}

const GenerateReadyIdeas = () => {
	router.push('/ideas-recipe')
}

const GenerateIngredient = () => {
	router.push('/ingredient-recipe')
}

const MAX_CHARS = 250

const validateInput = (event) => {
	const textarea = event.target
	const inputValue = textarea.value

	if (inputValue.length > MAX_CHARS) {
		recipeIdea.value = inputValue.slice(0, MAX_CHARS)
	}
}
</script>

<style scoped>
.border-custom {
	border: 1px solid #1C1C1C0D;
}

.border-custom-red {
	border: 1px solid red;
}

.padding-filled {
	padding: 26px 0 10px 12px;
}

.padding-empty {
	padding: 12px;
}

textarea {
	line-height: 1.5;
}

span {
	transition: all 0.3s ease;
}

textarea:focus+span,
textarea:not(:placeholder-shown)+span {
	top: -8px;
	font-size: 10px;
	background-color: #FCFCFC;
}

.icon-fixed-size {
	width: 48px;
	height: 48px;
	min-width: 48px;
	min-height: 48px;
	border-radius: 50%;
	padding: 8px;
}
</style>