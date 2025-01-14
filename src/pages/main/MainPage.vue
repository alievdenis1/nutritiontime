<template>
	<div class="">
		<div
			class="flex items-center justify-between p-4 m-4 rounded-lg shadow-custom cursor-pointer border"
			@click="navigateToDiary"
		>
			<div class="text-left w-[255px]">
				<h3 class="font-semibold mb-[8px] text-lg text-darkGray">
					Дневник питания
				</h3>

				<p class="text-slateGray text-xs">
					Контроль веса и калорий
				</p>
			</div>

			<IconArrowRight
				icon-color="#1C1C1C"
				class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
			/>
		</div>

		<div
			class="flex items-center justify-between p-4 m-4 rounded-lg shadow-custom cursor-pointer border"
			@click="navigateToBook"
		>
			<div class="text-left w-[255px]">
				<h3 class="font-semibold mb-[8px] text-lg text-darkGray">
					Книга рецептов
				</h3>

				<p class="text-slateGray text-xs">
					Сохраненные и созданные рецепты
				</p>
			</div>

			<IconArrowRight
				icon-color="#1C1C1C"
				class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
			/>
		</div>

		<div
			class="flex items-center justify-between p-4 m-4 rounded-lg shadow-custom cursor-pointer border"
			@click="navigateToWallet"
		>
			<div class="text-left w-[255px]">
				<h3 class="font-semibold mb-[8px] w-full text-lg text-darkGray flex">
					Кото-кликер
				</h3>

				<p class="text-slateGray text-xs">
					Зарабатывай рецептоны
				</p>
			</div>

			<IconArrowRight
				icon-color="#1C1C1C"
				class="w-[48px] h-[48px] bg-lightGray rounded-[50%] p-[8px]"
			/>
		</div>

		<div
			class="flex items-center justify-between p-4 m-4 rounded-lg shadow-custom
			border bg-[#E6E6E6]"
		>
			<div class="text-left w-[255px]">
				<h3 class="font-semibold mb-[8px] text-lg text-[#717171]">
					Планы питания
				</h3>

				<p class="text-slateGray text-xs text-[#717171]">
					В разработке
				</p>
			</div>

			<IconArrowRight
				icon-color="#717171"
				class="w-[48px] h-[48px] bg-gray rounded-[50%] p-[8px]"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconArrowRight } from 'shared/components/Icon'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToWallet = () => {
	router.push('/wallet')
}
const navigateToBook = () => {
	router.push('/diary')
}
const navigateToDiary = () => {
	router.push('/book')
}
</script>

<style lang="scss" scoped>
.shadow-custom {
  box-shadow: 0px 0px 34px 0px #00000014;
}
</style>
