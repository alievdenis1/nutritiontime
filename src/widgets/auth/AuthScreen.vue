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
					label="Вход"
				/>

				<el-tab-pane
					:name="Tabs.Register"
					label="Регистрация"
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
					label="Почта"
					prop="email"
				>
					<el-input
						v-model="authModel.email"
						placeholder="Введите Email"
					/>
				</el-form-item>

				<el-form-item
					label="Пароль"
					prop="password"
				>
					<el-input
						v-model="authModel.password"
						placeholder="Введите пароль"
					/>
				</el-form-item>

				<span class="color-red">
					Забыли пароль?
				</span>
			</el-form>

			<v-button
				color="green"
				@click="onAuthButtonClicked"
			>
				Войти
			</v-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { VButton } from "shared/components/Button";

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
@use "shared/styles/variables";

.auth-screen {
	width: 100%;
	display: flex;
	flex-direction: column;

	&__header {
		display: flex;
		flex-direction: column;
		background-color: variables.$color_white;
		padding: 50px 50px 0 50px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
		border-bottom-left-radius: 22px;
		border-bottom-right-radius: 22px;

		.auth-screen__logo {
			display: flex;
			justify-content: center;
			margin-bottom: 4rem;
			margin-top: 2rem;
		}

		:deep(.el-tabs) {
			.el-tabs__header {
				margin-bottom: 0;
			}

			.el-tabs__nav-wrap::after {
				background-color: transparent;
			}

			.el-tabs__nav-scroll {
				justify-content: center;
				display: flex;
			}

			.el-tabs__item {
				color: variables.$color_brown;
				width: 134px;

				&.is-active {
					color: variables.$color_green;
				}
			}

			.el-tabs__active-bar {
				background-color: variables.$color_green;
			}
		}
	}

	&__body {
		height: 100%;
		padding: 50px;
		display: flex;
		flex-direction: column;

		:deep(.el-form) {
			flex-grow: 1;
		}
	}
}

</style>
