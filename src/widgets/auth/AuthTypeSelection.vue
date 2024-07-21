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
				{{ t('howToEnter') }}
			</span>

			<v-button
				:color="ButtonColors.White"
				class="auth-type-button is-email"
				@click="onAuthByEmailButtonClicked"
			>
				<icon-email />

				<span class="auth-type-button__description">
					{{ t('email') }}
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				:color="ButtonColors.White"
				class="auth-type-button is-telegram"
			>
				<icon-telegram />

				<span class="auth-type-button__description">
					Telegram
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				:color="ButtonColors.White"
				class="auth-type-button is-google"
			>
				<icon-google />

				<span class="auth-type-button__description">
					Google
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				:color="ButtonColors.White"
				class="auth-type-button is-facebook"
			>
				<icon-facebook />

				<span class="auth-type-button__description">
					Facebook
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>

			<v-button
				:color="ButtonColors.White"
				class="auth-type-button is-apple"
			>
				<icon-apple />

				<span class="auth-type-button__description">
					Apple ID
				</span>

				<el-icon :size="9">
					<el-icon-arrow-right-bold />
				</el-icon>
			</v-button>
		</div>

		<div class="auth-type-selection__politics text-xs text-brown text-center">
			{{ t('confirm') }}
			<span class="text-red"> {{ t('terms') }} </span>
			<span class="text-red"> {{ t('privacyPolicy') }} </span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ButtonColors, VButton } from 'shared/components/Button'
import { useRouter } from 'vue-router'
import Localization from './AuthTypeSelection.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { IconApple, IconEmail, IconFacebook, IconGoogle, IconTelegram } from 'shared/components/Icon'

const { t } = useTranslation(Localization)
const router = useRouter()

const onAuthByEmailButtonClicked = () => {
	router.push({ name: 'Auth' })
}
</script>

<style lang="scss" scoped>

.auth-type-button {
	&.is-email {
		@apply text-green;
	}

	&.is-telegram {
		@apply text-blue-100;
	}

	&.is-google {
		@apply text-red;
	}

	&.is-facebook {
		@apply text-blue;
	}

	&.is-apple {
		@apply text-brown;
	}
}

.auth-type-selection {
	@apply w-full flex flex-col items-center;

	&__logo {
		@apply mb-16 mt-[28px];
	}

	&__buttons-wrapper {
		@apply w-full flex flex-col items-center grow;

		.auth-type-selection__title {
			@apply text-base text-brown mb-8;
		}
	}

	.auth-type-button {
		@apply h-[65px];

		&__description {
			@apply inline-block grow text-left ml-[7px];
		}

		& + .auth-type-button {
			@apply mt-[20px];
		}
	}
}
</style>
