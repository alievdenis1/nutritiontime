<template>
	<div class="relative">
		<div
			ref="imageContainer"
			class="w-full h-[361px]"
		>
			<img
				:src="normalizeImageUrl(recipe?.image ?? '')"
				:alt="recipe?.title ?? ''"
				class="w-full h-[365px] object-contain absolute top-0 left-0"
			>
		</div>
		111
		<div
			v-if="!isReviewModalOpen"
			ref="headerRef"
			class="fixed top-0 left-0 z-50 w-full transition-all duration-300"
			:class="{ 'bg-white': !isHeaderTransparent }"
		>
			<div class="flex justify-end items-center p-[16px]">
				<div class="flex space-x-2">
					<slot
						name="shareRecipe"
						v-bind="{ recipe }"
					/>
					<slot
						name="addToCollection"
						v-bind="{ recipe }"
					/>
					<slot
						name="toggleFavourite"
						v-bind="{ recipe }"
					/>
				</div>
			</div>
		</div>
		<div class="p-[16px] shadow-custom mx-[16px] mt-[24px] mb-[16px] rounded-[16px]">
			<div class="text-slateGray text-lg mb-[12px]">
				{{ t('yourRecipe') }}
			</div>
			<div class="text-xs text-slateGray mb-[12px]">
				{{ t('editInstructions') }}
			</div>
			<VButton
				:color="ButtonColors.White"
				@click="editingRecipe"
			>
				<div class="flex items-center justify-center gap-[12px]">
					<div>{{ t('editButton') }}</div>
					<div>
						<IconArrowRight icon-color="#319A6E" />
					</div>
				</div>
			</VButton>
		</div>

		<div class="mx-auto p-[16px]">
			<div class="flex items-center mb-[16px] mt-[24px]">
				<img
					:src="recipe?.author?.image"
					:alt="recipe?.author?.name"
					class="w-8 h-8 rounded-full mr-2"
				>
				<span class="text-sm text-slateGray">{{ recipe?.author?.name }}</span>
				<div
					v-if="recipe?.comments?.length && recipe.comments.length > 0"
					class=" ml-auto flex items-center"
				>
					<span class="text-xs text-slateGray mr-[8px]">
						{{ recipe?.reviewsCount }}
						{{ t('reviewsCount') }}
					</span>
					<span
						class="text-sm text-white w-[32px] h-[32px] rounded-[50%] bg-forestGreen flex items-center justify-center"
					>
						{{ recipe?.rating.toFixed(1) }}
					</span>
				</div>
			</div>

			<h2 class="text-xl font-bold text-darkGray mb-[8px]">
				{{ recipe?.title }}
			</h2>
			<p class="text-sm text-slateGray mb-[24px]">
				{{ recipe?.description }}
			</p>

			<h3 class="text-lg font-semibold text-darkGray mb-[16px]">
				{{ t('ingredients') }}
			</h3>
			<div
				v-for="(ingredient, index) in recipe?.ingredients ?? []"
				:key="index"
				class="flex items-center justify-between bg-lightGray px-[12px] py-[20px] rounded-[16px] mb-[16px]"
			>
				<span class="text-[12px]">{{ ingredient?.name }}</span>
				<span class="text-[#535353] text-xs">{{ ingredient?.amount }}</span>
			</div>
			<div class="mt-4 text-sm text-slateGray">
				{{ t('totalWeight') }}
				{{ recipe?.totalWeight }}
				{{ t('totalWeightGram') }}
			</div>

			<RecipeDetailsTabs
				:recipe="recipe"
			/>

			<div class="shadow-custom mt-[40px] p-[16px] rounded-[12px] flex items-center justify-between">
				<div v-if="!!recipe?.comments?.length">
					<span
						class="text-sm text-white w-[32px] h-[32px] rounded-[50%] bg-forestGreen flex items-center justify-center mb-[12px]"
					>
						{{ recipe?.rating.toFixed(1) }}
					</span>
					<span class="text-nowrap">{{ recipe?.reviewsCount }} {{ t('reviewsCount') }}</span>
				</div>
				<div
					v-if="!recipe?.comments?.length"
					class="text-sm text-darkGray"
				>
					{{ t('noReviews') }}
				</div>
				<div class="w-max">
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
				</div>
			</div>
			<div class="space-y-[12px]">
				<div
					v-for="(comment, index) in latestComments"
					:key="index"
					class="rounded-lg mt-[24px] flex flex-col gap-[12px] mb-[24px]"
				>
					<div class="flex items-center">
						<img
							v-if="comment.authorImage"
							:src="comment.authorImage"
							:alt="comment.author"
							class="w-8 h-8 rounded-full mr-2"
						>
						<span class="font-xs text-slateGray">{{ comment.author }}</span>
					</div>
					<p class="text-darkGray">
						{{ comment.text }}
					</p>
					<img
						v-if="comment.image"
						:src="comment.image"
						:alt="t('recipe.commentImage')"
						class="w-full h-auto object-cover aspect-video rounded-lg"
					>
					<div class="flex items-center gap-1">
						<div v-if="recipe">
							<IconHeart
								:is-liked="likedStates[recipe.id] ?? false"
								:disabled="isLiking[recipe.id] ?? false"
							/>
						</div>
						<span class="text-slateGray text-xs">{{ comment.likes }}</span>
					</div>
					<div class="w-full h-[1px] bg-[#1C1C1C0D]" />
				</div>
			</div>
			<VButton
				:color="ButtonColors.White"
				class="mt-[24px]"
				@click="allCommentPage"
			>
				<div class="flex items-center justify-center gap-[12px]">
					<div>{{ t('allReviews') }}</div>
					<div>
						<IconArrowRight icon-color="#319A6E" />
					</div>
				</div>
			</VButton>
		</div>
		<div class="px-[16px]">
			<div class="shadow-custom mt-[32px] p-[16px] rounded-[12px] flex items-center justify-between">
				<div>
					<div class="text-lg text-darkGray">
						{{ t('recipeAuthor') }}
					</div>
					<div class="flex items-center gap-[8px] mt-[12px]">
						<!--						<el-image-->
						<!--							:src="recipe?.author.image"-->
						<!--							:alt="recipe?.author.name"-->
						<!--							class="w-[20px] h-[20px]"-->
						<!--						/>-->
						<div class="text-xs text-slateGray">
							{{ recipe?.author.name }}
						</div>
					</div>
				</div>
				<div />
			</div>
		</div>
		<div class="px-[16px]">
			<div class="shadow-custom mt-[32px] p-[16px] rounded-[12px] flex items-center justify-between">
				<div>
					<div class="text-lg text-darkGray">
						{{ t('nftOwner') }}
					</div>
					<div class="flex items-center gap-[8px] mt-[12px]">
						<img
							:src="recipe?.nftOwner?.image"
							:alt="recipe?.nftOwner?.name"
							class="w-[20px] h-[20px]"
						>
						<div class="text-xs text-slateGray">
							{{ recipe?.nftOwner?.name }}
						</div>
					</div>
				</div>
				<div class="w-max">
					<VButton :color="ButtonColors.White">
						<div class="flex items-center justify-center gap-[12px]">
							<div>{{ t('moreAbout') }}</div>
							<div>
								<IconArrowRight
									v-if="!isSmallScreen"
									icon-color="#319A6E"
								/>
							</div>
						</div>
					</VButton>
				</div>
			</div>
		</div>
		<div class="px-[16px] mt-[24px] mb-[16px]">
			<VButton
				:color="ButtonColors.White"
				@click="exportToPDF"
			>
				<div class="flex items-center justify-center gap-[12px]">
					<div>{{ t('exportToPDF') }}</div>
					<div>
						<IconLoad />
					</div>
				</div>
			</VButton>
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

					<textarea
						v-model="review"
						:placeholder="'Ваше мнение о рецепте'"
						:maxlength="500"
						class="border rounded px-2 py-4 text-base min-h-[122px] w-[100%] mt-[20px] mb-[12px]"
					/>

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
		<CreateCollection />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, Ref } from 'vue'
import { IconArrowRight, IconHeart, IconShare, IconFavorites, IconLoad, IconClose, IconPhoto } from '@/shared/components/Icon'
import { RecipeDetailsTabs } from 'entities/Recipe/DetailedCardRecipe'
import { VButton, ButtonColors } from 'shared/components/Button'
import Localization from './DetailCardRecipe.localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { VModal } from 'shared/components/Modal'
import { useRecipeStore } from '../DetailedCardRecipe/stores/recipeStore'
import { useSearchStore } from '../Search/store/search-store'
import { VAddPhoto } from 'shared/components/AddPhoto'
import { useRouter } from 'vue-router'
import { Recipe } from './types/recipe'

import CreateCollection from '../Search/modal/CreateCollection.vue'
import { useQuery } from '@tanstack/vue-query'
import { getRecipeDetails } from 'entities/Recipe/api'
import { useRecipeLikeStore } from 'entities/Recipe/model/use-recipe-like-store.ts'
import { normalizeImageUrl } from 'shared/lib/mapping/normalize-image-url.ts'

const props = defineProps<{
	recipeId: number
}>()

const searchStore = useSearchStore()
const router = useRouter()
const likeStore = useRecipeLikeStore()

const {
	data: recipe,
	isLoading: isLoadingRecipe
} = useQuery({
	queryKey: ['recipe/details', () => props.recipeId],
	queryFn: async () => await getRecipeDetails({ id: props.recipeId }),
	cacheTime: 60 * 1000 /** 60 seconds */,
	initialData: null
})

const { t } = useTranslation(Localization)

const headerRef = ref<HTMLElement | null>(null)
const imageContainer = ref<HTMLElement | null>(null)
const isImageVisible = ref(true)

const isHeaderTransparent = computed(() => isImageVisible.value)

const buttonBackgroundClass = computed(() => {
	return isHeaderTransparent.value ? 'bg-white' : 'bg-lightGray'
})
const isSmallScreen = ref(window.innerWidth <= 380)
let observer: IntersectionObserver | null = null

onMounted(() => {
	observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			isImageVisible.value = entry.isIntersecting
		})
	}, {
		root: null,
		threshold: 0.1
	})

	if (imageContainer.value) {
		observer.observe(imageContainer.value)
	}
})

onUnmounted(() => {
	if (observer && imageContainer.value) {
		observer.unobserve(imageContainer.value)
	}
})

const icons = ref([
	{
		component: IconShare,
		class: 'w-[44px] h-[44px]',
		iconClass: 'w-[17px] h-[14px]'
	},
	{
		component: IconFavorites,
		class: 'w-[44px] h-[44px]',
		iconClass: 'w-[24px] h-[20px]',
		isActive: false,
		activeColor: '#319A6E',
		onClick: () => searchStore.toggleModalOpen(),
	},
	{
		component: IconHeart,
		class: 'w-[62px] h-[44px]',
		iconClass: 'w-[20px] h-[20px]',
		text: '24',
		isActive: false,
		activeColor: '#319A6E',
	}
])

const toggleIcon = (index: number) => {
	const icon = icons.value[index]

	if (index === 0) return
	icon.isActive = !icon.isActive
	if (index === 2) {
		icon.text = icon.isActive ? '25' : '24'
	}

	if(icon.onClick) {
		icon.onClick()
	}
}

const latestComments = computed(() => {
	return (recipe.value?.comments ?? []).slice(0, 3)
})

const exportToPDF = () => {
	// Implement PDF export logic here
}

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

const handleImageUpload = (imageUrl: string | null) => {
	reviewImage.value = imageUrl
}

const submitReview = () => {
	if (rating.value === 0 || review.value.trim() === '') {
		alert('Пожалуйста, поставьте оценку и напишите отзыв')
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
	addPhotoKey.value++ // Это заставит компонент VAddPhoto пересоздаться
}

const allCommentPage = () => {
	if (recipe.value) {
		router.push(`/all-comment/${recipe.value.id}`)
	}
}

const editingRecipe = () => {
	if (recipe.value) {
		router.push(`/recipe/${recipe.value.id}/edit`)
	}
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
