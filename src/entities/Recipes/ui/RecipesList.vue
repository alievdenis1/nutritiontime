<template>
	<div class="flex items-center gap-[10px] mb-5 h-[41px]">
		<h2 class="font-bold text-[28px] leading-[33px] text-[#056760]">
			Легкие
		</h2>
		<v-button class="cursor-pointer">
			<img
				width="17"
				src="/image/icons/icon-pen.svg"
				height="17"
			>
		</v-button>
	</div>
	<div
		v-for="card in recipes"
		:key="card.id"
		class="bg-white w-full py-[30px] pl-[30px] pr-[20px] flex gap-4 mb-2 rounded"
	>
		<img
			width="78"
			:src="card.img"
			height="75"
			alt="recipe_picture"
		>
		<div>
			<p class="font-medium text-[#056760] leading-[14px] text-[15px] h-[40px] w-[169px]">
				{{ card.title }}
			</p>
			<div class="flex gap-3 text-[#968D7D] h-[11px] w-[145px]">
				<span class="flex items-center text-[13px] gap-1">
					<img
						width="11"
						src="/image/icons/icon-clock.svg"
						height="11"
					>
					{{ `${card.time} min.` }}
				</span>
				<span class="flex items-center text-[13px] gap-1">
					<img
						style="color: #968D7D;"
						width="11"
						src="/image/icons/icon-fire.svg"
						height="11"
					>
					{{ `${card.kkal} kkal.` }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const recipes = [
    { id: 1, title: 'Овсяный панчес с малиной и клюквой', img:'', time: 30, kkal: 150 },
    { id: 2, title: 'Овсяный панчес с малиной и клюквой', img:'', time: 30, kkal: 150 },
    { id: 3, title: 'Овсяный панчес с малиной и клюквой', img:'', time: 30, kkal: 150 }
]
</script>

<style lang="scss" scoped></style>