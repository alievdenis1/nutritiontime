<template>
	<div class="auth-type-selection">
		<div class="auth-type-selection__logo">
			<img
				alt="Logo"
				width="216"
				height="42"
				src="/image/logo/logo-default.webp"
			>
		</div>

		<div class="auth-type-selection__buttons-wrapper">
			<span class="auth-type-selection__title">
				Как вы хотите войти?
			</span>

			<v-button
				color="white"
				class="auth-type-button is-email"
				@click="onAuthByEmailButtonClicked"
			>
				<img
					width="23"
					height="23"
					class="auth-type-button__icon"
					src="/image/icons/icon-email.svg"
					alt="email"
				>

				<span class="auth-type-button__description">
					Почта
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				color="white"
				class="auth-type-button is-telegram"
			>
				<img
					width="23"
					height="23"
					class="auth-type-button__icon"
					src="/image/icons/icon-telegram.svg"
					alt="email"
				>

				<span class="auth-type-button__description">
					Telegram
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				color="white"
				class="auth-type-button is-google"
			>
				<img
					width="23"
					height="23"
					class="auth-type-button__icon"
					src="/image/icons/icon-google.svg"
					alt="email"
				>

				<span class="auth-type-button__description">
					Google
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				color="white"
				class="auth-type-button is-facebook"
			>
				<img
					width="23"
					height="23"
					class="auth-type-button__icon"
					src="/image/icons/icon-facebook.svg"
					alt="email"
				>

				<span class="auth-type-button__description">
					Facebook
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				color="white"
				class="auth-type-button is-apple"
			>
				<img
					width="23"
					height="23"
					class="auth-type-button__icon"
					src="/image/icons/icon-apple.svg"
					alt="email"
				>

				<span class="auth-type-button__description">
					Apple ID
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>
		</div>

		<div class="auth-type-selection__politics text-xs color-brown text-center">
			Продолжая, вы соглашаетесь со следующим:
			<span class="color-red"> Положения и условия, </span>
			<span class="color-red"> Политика конфинедциальности </span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { VButton } from "shared/components/Button";
import { useRouter } from "vue-router";
const router = useRouter()

const onAuthByEmailButtonClicked = () => {
	router.push({ name: 'Auth' })
}
</script>

<style lang="scss" scoped>
@use "shared/styles/variables";
@use "shared/styles/mixins";

.auth-type-button {
	&.is-email {
		color: #056760;
	}

	&.is-telegram {
		color: #019FB5;
	}

	&.is-google {
		color: #E75854;
	}

	&.is-facebook {
		color: #0069A5;
	}

	&.is-apple {
		color: #968D7D;
	}
}

.auth-type-selection {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	&__logo {
		margin-bottom: 4rem;
		margin-top: 28px;
	}

	&__buttons-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;

		.auth-type-selection__title {
			@include mixins.text-regular();
			color: variables.$color_brown;
			margin-bottom: 2rem;
		}
	}

	.auth-type-button {
		height: 65px;
		&__description {
			display: inline-block;
			line-height: 100%;
			flex-grow: 1;
			text-align: left;
			margin-left: 7px;
		}

		& + .auth-type-button {
			margin-top: 20px;
		}
	}

	.auth-type-selection__politics {

	}
}
</style>
