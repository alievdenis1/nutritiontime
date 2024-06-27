<template>
	<div class="flex flex-col gap-[15px] text-[15px] leading-[94.95%] text-[#9D8C61] font-normal my-[18px]">
		<div class="flex items-center justify-between">
			<span>{{ `${t('reviews')}(${comments.length})` }}</span>
			<button
				class="cursor-pointer"
				@click="isCommentsOpen = !isCommentsOpen"
			>
				<icon-arrow-rounded :class="{ 'rotate-180': isCommentsOpen }" />
			</button>
		</div>
		<el-collapse-transition>
			<div v-if="isCommentsOpen">
				<div
					v-for="comment in comments"
					:key="comment.id"
					class="bg-white pl-5 pr-[10px] py-[9px] text-[12px] flex items-center justify-between rounded-[40px]"
				>
					<div class="flex items-center gap-[10px]">
						<div class="flex flex-col items-center gap-[3px]">
							<span>{{ comment.author }}</span>
							<icon-author />
						</div>
						<p class="text-[#735F2B]">
							{{ comment.message }}
						</p>
					</div>
					<div class="flex items-center gap-2">
						<span class="opacity-70 text-[#735F2B]">{{ comment.time }}</span>
						<button
							class="text-[#AB9F80] cursor-pointer"
							@click="toggleLike"
						>
							<icon-favorites :icon-fill="iconFill" />
						</button>
					</div>
				</div>
			</div>
		</el-collapse-transition>
	</div>
</template>

<script setup lang="ts">
import { IconArrowRounded, IconFavorites } from 'shared/components/Icon'
import { ref } from 'vue'
import Localization from './RecipeComments.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { IconAuthor } from '@/shared/components/Icon'

const { t } = useTranslation(Localization)

const isCommentsOpen = ref(true)
const iconFill = ref<'evenodd' | 'nonzero'>('evenodd')

const toggleLike = () => {
	iconFill.value === 'evenodd' ? iconFill.value = 'nonzero' : iconFill.value = 'evenodd'
}

const comments = [
    { id:1, message: 'it is great', author: 'bury', time: '10:55' },
]
</script>

<style scoped>

</style>