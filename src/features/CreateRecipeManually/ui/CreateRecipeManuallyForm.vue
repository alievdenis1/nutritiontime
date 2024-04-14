<template>
	<form class="form-element mb-6">
		<span class="text-[15px] font-medium text-[#735F2B]">
			Intelligence
		</span>

		<div class="form-element">
			<span class="form-element-title__small">
				{{ t('nameFood') }}
			</span>
			<div class="w-[347px] h-[42px] bg-white rounded-[40px] p-[15px] mb-[11px] flex items-center justify-between">
				<input
					class="w-[90%]"
					type="text"
				>
				<v-button class="cursor-pointer">
					<img
						src="/image/icons/icon-pen.svg"
						width="17"
					>
				</v-button>
			</div>
		</div>

		<div class="form-element">
			<span class="form-element-title__small">
				{{ t('photoAndVideo') }}
			</span>
			<ImageUploader />
		</div>

		<div class="form-element">
			<span class="text-[15px] text-[#735F2B]">
				{{ t('instructions') }}
			</span>
			<CookingInstructions />
		</div>

		<div class="form-element">
			<span class="form-element-title">
				{{  t('calories') }}
			</span>
			<CaloriesList
				:calories-list="calories"
			/>
		</div>

		<div class="form-element">
			<span class="form-element-title">
				{{ t('chooseProducts') }}
			</span>
			<ProductSearch />
			<SliderList
				:data="products"
				:is-products="true"
			/>
		</div>

		<div class="form-element">
			<span class="form-element-title">
				{{ t('excludeProducts') }}
			</span>
			<ProductSearch />
			<SliderList
				:data="products"
				:is-products="true"
			/>
		</div>

		<div class="form-element pb-3">
			<span class="form-element-title">
				{{ t('time') }}
			</span>
			<InputRange
				:marks="marks"
			/>
		</div>

		<v-button
			class="create-button mb-[12px] self-center"
		>
			{{ t('create') }}
		</v-button>
	</form>
</template>

<script setup lang="ts">
import { ProductSearch } from 'entities/create-recipe/ui/product-search'
import { CaloriesList } from 'entities/create-recipe/ui/calories-list'
import { SliderList } from 'entities/create-recipe/ui/slider-list'
import { InputRange } from 'entities/create-recipe/ui/input-range'
import { CookingInstructions } from '@/entities/create-recipe-manually/ui/cooking-instructions'
import { ImageUploader } from 'entities/create-recipe/ui/image-uploader'

import Localization from './CreateRecipeManuallyForm.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)
import { reactive } from 'vue'

const calories = [
	{ id:1, count: 50 },
	{ id:2, count: 60 },
	{ id:3, count: 70 },
	{ id:4, count: 50 },
	{ id:5, count: 60 },
	{ id:6, count: 70 },
]

const products = [
	{ id:1, name: 'Milk' },
	{ id:2, name: 'Milk' },
	{ id:3, name: 'Milk' },
	{ id:4, name: 'Milk' },
	{ id:5, name: 'Milk' },
	{ id:6, name: 'Milk' },
]

const marks = reactive({
  15: '15min',
  30: '30min',
  45: '45min',
  60: '60min',
  75: '75min'
})
</script>

<style scoped>
.create-button {
	@apply text-[20px] leading-[110%] font-medium w-[235px] h-[54px] flex items-center justify-center
	bg-[#735F2B] rounded-[40px] text-white cursor-pointer
}

.form-element-title__small {
	@apply text-[#735F2B] text-[11px] leading-[94.95%] opacity-70
}

.form-element-title {
	@apply text-[15px] text-[#735F2B] opacity-70
}

.form-element {
	@apply flex flex-col gap-3
}
</style>