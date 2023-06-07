<template>
	<div class="start-screen flex flex-col items-center m-50">
		<div class="start-screen__logo">
			<img
				alt="Logo"
				width="216"
				height="42"
				src="/image/logo/logo-default.webp"
			>
		</div>

		<div class="start-screen__image">
			<img
				alt=""
				width="345"
				height="358"
				src="/image/start-screen-image.webp"
			>
		</div>

		<div class="start-screen__description text-description text-center">
			Удобный способ планировать питание
			в соответствии с вашими предпочтениями
			и возможностями
		</div>

		<div class="start-screen__button">
			<v-button @click="onStartButtonClicked">
				Начать
			</v-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { VButton } from 'shared/components/Button'
import { useRouter } from 'vue-router'
const router = useRouter()

const onStartButtonClicked = () => {
	// TODO
	router.push({ name: 'SelectAuthType' })
}
</script>

<style lang="scss" scoped>
.start-screen {
	&__logo {
		@apply mt-[28px];
	}

	&__logo, &__image {
		@apply mt-16;
	}

	&__button {
		@apply flex w-full items-end grow;
	}
}
</style>
