<template>
	<div class="flex flex-col p-[16px]">
		<div class="flex justify-center items-center min-h-[44px]">
			<h2 class="text-center text-lg text-darkGray">
				{{ t('reviews') }}
			</h2>
		</div>
		<div class="shadow-custom mt-[16px] p-[16px] rounded-[12px]">
			<div class="flex items-center justify-between">
				<div>
					<span
						class="text-lg text-white w-[32px] h-[32px] rounded-[50%] bg-forestGreen flex items-center justify-center mb-[12px]"
					>
						{{ recipe?.rating.toFixed(1) }}
					</span>

					<div class="text-lg text-darkGray">
						{{ recipe?.comments.length }}
						{{ t('plural') }}
					</div>
				</div>
				<div class="w-max">
					<VButton
						:color="ButtonColors.White"
						@click="openReviewModal"
					>
						<div class="flex items-center justify-center gap-[12px]">
							{{ t('leaveReview') }}
							<div>
								<IconArrowRight icon-color="#319A6E" />
							</div>
						</div>
					</VButton>
				</div>
			</div>
			<div class="flex items-center justify-between gap-[4px] mt-[24px]">
				<img
					:src="recipe?.image"
					:alt="recipe?.title"
					class="w-[80px] h-[80px] rounded-[12px] object-cover object-center shadow-sm"
				>
				<div class="text-sm text-darkGray">
					{{ recipe?.title }}
				</div>
			</div>
		</div>

		<div
			v-for="(comment, index) in recipe?.comments ?? []"
			:key="index"
			class="rounded-lg mt-[24px] flex flex-col gap-[12px] mb-[24px]"
		>
			<div class="flex items-center">
				<img
					v-if="comment?.authorImage"
					:src="comment?.authorImage"
					:alt="comment?.author"
					class="w-8 h-8 rounded-full mr-2"
				>
				<span class="font-xs text-slateGray">{{ comment?.author }}</span>
			</div>
			<p class="text-darkGray">
				{{ comment?.text }}
			</p>
			<img
				v-if="comment?.image"
				:src="comment?.image"
				:alt="t('commentImage')"
				class="w-full h-auto object-cover aspect-video rounded-lg"
			>
			<div class="flex items-center">
				<IconHeart
					icon-color="#319A6E"
					class="w-5 h-5 text-red-500 mr-2 cursor-pointer"
				/>
				<span class="text-slateGray text-xs">{{ comment.likes }}</span>
			</div>
			<div class="w-full h-[1px] bg-[#1C1C1C0D]" />
		</div>
		<VModal
			:show="isReviewModalOpen"
			@close="closeReviewModal"
		>
			<div class="flex items-center justify-between">
				<div class="text-xl text-darkGray">
					Отзыв о рецепте
				</div>
				<button
					class="text-2xl w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[14px] cursor-pointer"
					@click="closeReviewModal"
				>
					<IconClose />
				</button>
			</div>
			<div class="max-w-md mx-auto">
				<div>
					<div class="flex flex items-center justify-between">
						<div class="flex items-center gap-[8px]">
							<template
								v-for="star in 5"
								:key="star"
							>
								<button
									class="w-[32px] h-[32px] rounded-full text-white text-sm font-bold flex items-center justify-center focus:outline-none"
									:class="star <= rating ? 'bg-forestGreen' : 'bg-lightGray'"
									@click="setRating(star)"
								>
									{{ star }}
								</button>
							</template>
						</div>
						<span class="text-xs text-slateGray truncate">{{ ratingText }}</span>
					</div>

					<textarea
						v-model="review"
						:placeholder="'Ваше мнение о рецепте'"
						class="border rounded px-2 py-4 text-base min-h-[122px] w-[100%] mt-[20px] mb-[12px]"
					/>

					<VAddPhoto
						:key="addPhotoKey"
						:icon-color="'#9F9FA0'"
						:width-image="54"
						:height-image="54"
						:title="'Прикрепить фото'"
						:height-main="66"
						backgrounds="#F3F3F3"
						:icon="IconPhoto"
						:on-image-uploaded="handleImageUpload"
					/>
					<VButton
						class="mt-[20px]"
						:color="ButtonColors.Green"
						@click="submitReview"
					>
						Оставить отзыв
					</VButton>
				</div>
			</div>
		</VModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue'
import { IconArrowRight, IconHeart, IconClose, IconPhoto } from 'shared/components/Icon'
import { VButton, ButtonColors } from 'shared/components/Button'
import { VModal } from 'shared/components/Modal'
import { VAddPhoto } from 'shared/components/AddPhoto'
import Localization from './AllComment.localization.json'
import { useTranslation } from 'shared/lib/i18n'
const { t } = useTranslation(Localization)
import { Recipe } from '../../entities/Recipe/DetailedCardRecipe/types/recipe'
import { useRecipeStore } from '../../entities/Recipe/DetailedCardRecipe/stores/recipeStore'
const store = useRecipeStore()
const recipe: Ref<Recipe | undefined> = ref(store.currentRecipe)

const isReviewModalOpen = ref(false)
const rating = ref(0)
const review = ref('')
const reviewImage = ref<string | null>(null)
const addPhotoKey = ref(0)

const setRating = (value: number) => {
	rating.value = value
}

const ratingText = computed(() => {
	switch (rating.value) {
		case 1:
			return 'Плохой рецепт'
		case 2:
			return 'Неплохой рецепт'
		case 3:
			return 'Хороший рецепт'
		case 4:
			return 'Невероятный рецепт'
		case 5:
			return 'Отличный рецепт'
		default:
			return ''
	}
})

const handleImageUpload = (imageUrl: string | null) => {
	reviewImage.value = imageUrl
}

const submitReview = () => {
	if (rating.value === 0 || review.value.trim() === '') {
		// alert('Пожалуйста, поставьте оценку и напишите отзыв')
		return
	}

	const newComment = {
		author: 'Пользователь',
		text: review.value,
		likes: 0,
		rating: rating.value,
		image: reviewImage.value,
		authorImage: '/image/denis.svg'
	}

	if (recipe.value) {
		recipe.value.comments.unshift(newComment)
	}

	closeReviewModal()
}

const openReviewModal = () => {
	isReviewModalOpen.value = true
	resetReviewForm()
}

const closeReviewModal = () => {
	isReviewModalOpen.value = false
	resetReviewForm()
}

const resetReviewForm = () => {
	rating.value = 0
	review.value = ''
	reviewImage.value = null
	addPhotoKey.value++
}
</script>

<style>
.border {
	border: 1px solid #E1E1E1;
}

.truncate {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>