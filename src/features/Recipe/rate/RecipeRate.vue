<template>
	<div class="flex flex-col gap-3 text-[#735F2B] my-[18px] text-[15px] leading-[94.95%]">
		<span class="opacity-70">{{ t('rate') }}</span>
		<div class="flex items-center justify-between">
			<div class="flex gap-2">
				<button
					v-for="item in likes"
					:key="item.id"
					class="text-[#AB9F80] cursor-pointer"
					@click="toggleLike(item.id)"
				>
					<icon-favorites :icon-fill="item.liked ? 'nonzero':'evenodd'" />
				</button>
			</div>
			<div class="flex items-center gap-2">
				<v-button class="cursor-pointer">
					<icon-plus-rounded />
				</v-button>
				<v-button class="cursor-pointer">
					<icon-trash />
				</v-button>
				<v-button class="cursor-pointer">
					<icon-forward />
				</v-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconFavorites, IconForward, IconPlusRounded, IconTrash } from 'shared/components/Icon'
import Localization from './RecipeRate.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { ref } from 'vue'

const { t } = useTranslation(Localization)

const likes = ref([
    { id: 1, liked: true },
    { id: 2, liked: false },
    { id: 3, liked: false },
    { id: 4, liked: false },
    { id: 5, liked: false }
])

const toggleLike = (id:number) => {
    for(let i = 0; i < likes.value.length; i++) {
        let like = likes.value[i]
        if(like.id === id) {
            like.liked ? like.liked = false : like.liked = true
        }
        if(like.id < id) {
            like.liked = true
        }
        if(like.id > id) {
            like.liked = false
        }
    }
}

</script>

<style scoped>

</style>