<template>
	<div class="auth-screen">
		<div class="auth-screen__header">
			<div class="auth-screen__logo">
				<img
					width="238"
					alt="Logo"
					src="/image/logo/logo-large.webp"
				>
			</div>

			<el-tabs
				v-model="currentTab"
			>
				<el-tab-pane
					:name="Tabs.Auth"
					:label="t('login')"
				/>

				<el-tab-pane
					:name="Tabs.Register"
					:label="t('register')"
				/>
			</el-tabs>
		</div>

		<div class="auth-screen__body">
			<el-form
				v-if="currentTab === Tabs.Auth"
				label-position="top"
				:model="authModel"
				@submit.prevent
			>
				<el-form-item
					:label="t('email')"
					prop="email"
				>
					<el-input
						v-model="authModel.email"
						:placeholder="t('emailPlaceholder')"
					/>
				</el-form-item>

				<el-form-item
					:label="t('password')"
					prop="password"
				>
					<el-input
						v-model="authModel.password"
						:placeholder="t('passwordPlaceholder')"
					/>
				</el-form-item>

				<span class="text-red">
					{{ t('forgetPassword') }}
				</span>
			</el-form>

			<v-button
				:color="ButtonColors.Green"
				@click="onAuthButtonClicked"
			>
				{{ t('signInButton') }}
			</v-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ButtonColors, VButton } from 'shared/components/Button'
import Localization from './AuthScreen.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

enum Tabs {
	Auth = 'auth',
	Register = 'register'
}
const currentTab = ref<Tabs>(Tabs.Auth)

const authModel = reactive<{
	email: string,
	password: string
}>({
	email: '',
	password: ''
})

const onAuthButtonClicked = () => {
	// TODO:
}

</script>

<style lang="scss" scoped>
.auth-screen {
	@apply w-full flex flex-col;

	&__header {
		@apply flex flex-col bg-white p-[50px] pb-0 shadow-[0_4px_30px_rgba(0,0,0,0.06)]
			rounded-bl-[22px] rounded-br-[22px];

		.auth-screen__logo {
			@apply flex justify-center mb-16 mt-8;
		}

		:deep(.el-tabs) {
			.el-tabs__header {
				@apply mb-0;
			}

			.el-tabs__nav-wrap::after {
				@apply bg-transparent;
			}

			.el-tabs__nav-scroll {
				@apply flex justify-center;
			}

			.el-tabs__item {
				@apply w-[134px] text-brown;

				&.is-active {
					@apply text-green;
				}
			}

			.el-tabs__active-bar {
				@apply bg-green;
			}
		}
	}

	&__body {
		@apply h-full p-[50px] flex flex-col;

		:deep(.el-form) {
			@apply grow;
		}
	}
}

</style>
