<script setup lang="ts">
import { IconShare } from 'shared/components/Icon'
import { computed } from 'vue'
import { Recipe } from 'entities/Recipe'
import Localization from './ShareRecipe.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { useRouter } from 'vue-router'

const { t } = useTranslation(Localization)
const router = useRouter()

type RecipeInfo = Pick<Recipe, 'id' | 'title'> & Record<string, unknown>

const props = withDefaults(defineProps<{
	invertBackground?: boolean
	recipe: RecipeInfo
}>(), {
	invertBackground: false
})

const buttonBackgroundClass = computed(() => {
	return !props.invertBackground
		? 'bg-white'
		: 'bg-lightGray'
})

function createRecipePageUrl(id: number) {
	const localRecipeUrl = router.resolve({
		name: 'details-recipe',
		params: {
			id
		}
	})

	return window.location.origin + localRecipeUrl.href
}

async function shareRecipe() {
	console.log('CREATED_PAGE_URL', createRecipePageUrl(props.recipe.id))

	await navigator.share({
		title: props.recipe.title,
		text: t('shareText'),
		url: createRecipePageUrl(props.recipe.id)
	})
}
</script>

<template>
	<button
		class="flex items-center justify-center rounded-full shadow-custom transition-colors duration-300 gap-1 w-[44px] h-[44px]"
		:class="[buttonBackgroundClass]"
		@click="shareRecipe"
	>
		<IconShare class="w-[17px] h-[14px]" />
	</button>
</template>

<style module>

</style>
