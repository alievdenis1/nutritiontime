<template>
	<CreateRecipeTabs
		v-model:mode="mode"
	/>
</template>

<script setup lang="ts">
import { CreateRecipeTabs } from 'widgets/create-recipe'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
	RECIPE_CREATION_VARIANTS,
	type RecipeCreationVariants
} from 'entities/Recipe/model/use-navigate-to-recipe-creation.ts'

const route = useRoute()
const router = useRouter()

const mode = ref<RecipeCreationVariants>(RECIPE_CREATION_VARIANTS.BASE)

const initiallySetMode = () => {
	console.log(route.query.variant)
	if (route.query.variant === RECIPE_CREATION_VARIANTS.BASE) {
		mode.value = RECIPE_CREATION_VARIANTS.BASE
	} else {
		mode.value = RECIPE_CREATION_VARIANTS.AI
	}
}

initiallySetMode()

watch(mode, (newMode) => {
	router.replace({
		...route,
		query: {
			...route.query,
			variant: newMode
		},
	})
})
</script>

<style scoped lang="scss">

</style>
