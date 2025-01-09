import {
	CookingTime,
	DifficultyAndSpiciness,
	IngredientsPart, KitchenwarePart,
	MainInfo,
	NutritionalValue, PerStepInstruction, TagsPart
} from './parts'
import type { Component } from 'vue'
import { useTranslation } from 'shared/lib/i18n'
import Localization from './ManageRecipe.localization.json'

type Block = {
	id: number
	title: string
	component: Component
}

export const useManageRecipeBlocks = () => {
	const { t } = useTranslation(Localization)

	const blocks: Block[] = [
		{
			id: 1,
			title: t('basicInformation'),
			component: MainInfo
		},
		{
			id: 2,
			title: t('spicinessAndDifficulty'),
			component: DifficultyAndSpiciness
		},
		{
			id: 3,
			title: t('cookingTime'),
			component: CookingTime
		},
		{
			id: 4,
			title: t('ingredientsTitle'),
			component: IngredientsPart
		},
		{
			id: 5,
			title: t('nutritionalValueTitle'),
			component: NutritionalValue
		},
		{
			id: 8,
			title: t('stepByStep'),
			component: PerStepInstruction
		},
		{
			id: 6,
			title: t('kitchenware'),
			component: KitchenwarePart
		},
		{
			id: 7,
			title: t('tagsTitle'),
			component: TagsPart
		}
	]

	return {
		blocks
	}
}
