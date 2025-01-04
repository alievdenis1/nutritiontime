<template>
	<VButton
		:color="ButtonColors.White"
		@click="openReviewModal"
	>
		<div class="flex items-center justify-center gap-[12px]">
			<div>{{ t('leaveReview') }}</div>
			<div>
				<IconArrowRight icon-color="#319A6E" />
			</div>
		</div>
	</VButton>
	<!-- TODO: можно вынести в entity/Comment -->
	<VModal
		:show="isReviewModalOpen"
		@close="closeReviewModal"
	>
		<div class="flex items-center justify-between">
			<div class="text-xl text-darkGray">
				<!-- TODO: перевод -->
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
								class="w-[32px] h-[32px] rounded-full text-slateGray text-sm  font-bold flex items-center justify-center focus:outline-none"
								:class="star <= rating ? 'bg-forestGreen text-white' : 'bg-lightGray text-slateGray'"
								@click="setRating(star)"
							>
								{{ star }}
							</button>
						</template>
					</div>
					<span class="text-xs text-slateGray truncate">{{ ratingText }}</span>
				</div>

				<!-- TODO: перевод -->
				<textarea
					v-model="review"
					:placeholder="'Ваше мнение о рецепте'"
					:maxlength="500"
					class="border rounded px-2 py-4 text-base min-h-[122px] w-[100%] mt-[20px] mb-[12px]"
				/>

				<!-- TODO: перевод -->
				<!-- TODO: addPhotoKey обновляет компонент, нужно переделать -->
				<VAddPhoto
					:key="addPhotoKey"
					:icon-color="'#1C1C1C'"
					:width-image="54"
					:height-image="54"
					:title="'Прикрепить фото'"
					:height-main="66"
					backgrounds="#F3F3F3"
					:icon="IconPhoto"
					:on-image-uploaded="handleImageUpload"
					@upload:image="handleUploadImage"
				/>
				<VButton
					class="mt-[20px]"
					:color="ButtonColors.Green"
					@click="submitReview"
				>
					<!-- TODO: перевод -->
					Оставить отзыв
				</VButton>
			</div>
		</div>
	</VModal>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, ref, computed } from 'vue'
import { IconClose, IconPhoto, IconArrowRight } from '@/shared/components/Icon'
import { VButton, ButtonColors } from 'shared/components/Button'
import Localization from './AddCommentButton.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { VModal } from 'shared/components/Modal'
import { VAddPhoto } from 'shared/components/AddPhoto'

import { addComment } from '../../api'
// import { useRouter } from 'vue-router'
// import { Recipe } from './types/recipe'

const { t } = useTranslation(Localization)

// const props = withDefaults(defineProps<{
//     bgColor?: string,
//     recipeId: string,
//     likes: number,
// }>(), {
//     bgColor: 'bg-white',
// })

// TODO: отрефакторить и разнести

const isReviewModalOpen = ref(false)
const rating = ref(0)
const review = ref('')
const reviewImage = ref<File | null>(null)
const addPhotoKey = ref(0)

const setRating = (value: number) => {
	rating.value = value
}

// TODO: добавить перевод
const ratingText = computed(() => {
	switch (rating.value) {
		case 1:
			return 'Плохой рецепт'
		case 2:
			return 'Посредственный рецепт'
		case 3:
			return 'Средний рецепт'
		case 4:
			return 'Хороший рецепт'
		case 5:
			return 'Отличный рецепт'
		default:
			return ''
	}
})

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
	addPhotoKey.value++ // Это заставит компонент VAddPhoto пересоздаться
}

// TODO: переписать
const handleImageUpload = () => {
	reviewImage.value = null
}

const handleUploadImage = (_: string | null, imageFile: File) => {
	reviewImage.value = imageFile
}

const submitReview = () => {
	if (rating.value === 0 || review.value.trim() === '') {
		// TODO: добавить нормальную валидацию
		alert('Пожалуйста, поставьте оценку и напишите отзыв')
		return
	}

	const newComment = {
		text: review.value,
		rating: rating.value,
		...(reviewImage.value && {
			image: reviewImage.value,
		})
	}

	const { execute } = addComment({ recipeId: '1' }, newComment)

	execute()

	// TODO: после отправки отзыва - нужно перезапросить рецепт
	// Отрефакторить этот код

	closeReviewModal()
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