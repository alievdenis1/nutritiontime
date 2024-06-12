<template>
	<div class="flex items-center justify-between gap-[10px] mb-4 h-[41px]">
		<div>
			<h2 class="font-bold text-[20px] leading-[19px] text-[#735F2B]">
				{{ t('todayPlan') }}
			</h2>
			<span class="text-[15px] text-[#735F2B] font-medium opacity-70">
				{{ t('breakfast') }}
			</span>
		</div>
		<v-button class="cursor-pointer mr-[14px]">
			<img
				height="17"
				src="/image/icons/icon-pen.svg"
				width="17"
			>
		</v-button>
	</div>
	<div
		v-if="recipes.length == 0"
		class="text-[#735F2B]"
	>
		У вас еще нет ни одного рецепта
	</div>
	<router-link
		v-else
		v-for="card in recipes"
		:key="card.id"
		class="bg-white w-full py-[14px] px-[20px] flex items-center justify-between mb-4 rounded-[40px]"
		:to="`/${card.id}`"
	>
		<div class="flex gap-3">
			<img
				:src="card.img"
				alt="recipe_picture"
				height="90"
				width="82"
			>
			<div class="flex flex-col justify-between">
				<div class="flex flex-col gap-[5px] mt-[22px] font-medium text-[#735F2B]">
					<span class="text-[15px] w leading-[95%]">
						{{ card.title }}
					</span>
					<span class="text-[10px] opacity-70">
						{{ card.desc }}
					</span>
				</div>
				<div class="flex gap-3 text-[#735F2B] items-center font-medium">
					<span class="flex items-center text-[10px] gap-1">
						<img
							height="16"
							src="/image/icons/icon-clock.svg"
							width="16"
						>
						{{ `${card.time}min.` }}
					</span>
					<span class="flex items-center text-[10px] gap-1">
						<img
							height="15"
							src="/image/icons/icon-fire.svg"
							width="11"
						>
						{{ `${card.kkal} kkal.` }}
					</span>
				</div>
			</div>
		</div>
		<v-button
			class="cursor-pointer"
			@click="router.push(`/${card.id}`)"
		>
			<el-icon
				class="items-center"
				size="8"
			>
				<el-icon-arrow-right-bold class="text-[#735F2B]" />
			</el-icon>
		</v-button>
	</router-link>
</template>

<script lang="ts" setup>
import Localization from './RecipesList.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { HttpClient, Api } from 'tonapi-sdk-js'
import { onMounted, ref } from 'vue'
import { toUserFriendlyAddress } from '@tonconnect/ui'
import { useRouter } from 'vue-router'
import type { RecipeList } from '../types'

const router = useRouter()
const { t } = useTranslation(Localization)

const recipes = ref<RecipeList>([])

const httpClient = new HttpClient({
  baseUrl: 'https://tonapi.io/',
  baseApiParams: {
    headers: {
      Authorization: 'Bearer AGO5FUEPXUJOHDAAAAALMOEI52XJWF7BYH3YRME4XPSYMRYVNFVVLEB5MM3AT4GP7HHCAPY',
      'Content-type': 'application/json'
    }
  }
})
//Пока для теста вывожу нфт с аккаунта Дена, но нужно ТонКлиент глобально как-то получать
const account = '0:e340db898b21f2ba86eca5634ca5c28ca3a7d56be37c40574bca2c7b1a92bc28'
const collection = ref()
const client = new Api(httpClient)
const getCollection = async () =>  {
  const collectionRes = await client.accounts.getAccountNftItems(account)
  collectionRes.nft_items.map(item => {
      if (item.previews && item.previews.length > 0) {
      recipes.value.push({
        id: 1,
        title: item.metadata.name,
        desc: item.metadata.description,
        img: item.previews[1].url,
        address: toUserFriendlyAddress(item.address),
        time: 30,
        kkal: 150
      })
    } else {
      recipes.value.push({
        id: 1,
        title: item.metadata.name,
        desc: item.metadata.description,
        img: 'Картинка по умолчанию',
        address: toUserFriendlyAddress(item.address),
        time: 30,
        kkal: 150
      })
    }
  })
  collection.value = collectionRes
}
onMounted(() => {
  getCollection()
})

</script>

<style lang="scss" scoped></style>