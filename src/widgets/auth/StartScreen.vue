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
import { useRouter } from "vue-router";
const router = useRouter()

const onStartButtonClicked = () => {
	// TODO
	router.push({ name: 'SelectAuthType' })
}
</script>

<style lang="scss" scoped>
.start-screen {
  &__logo {
    margin-top: 28px;
  }

  &__logo, &__image {
    margin-bottom: 4rem;
  }

  &__button {
    display: flex;
    width: 100%;
    align-items: end;
    flex-grow: 1;
  }
}
</style>
