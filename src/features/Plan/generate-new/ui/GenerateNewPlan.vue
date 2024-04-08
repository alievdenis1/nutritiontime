<template>
	<v-button @click="onClicked">
		{{ t('generateNew') }}
	</v-button>
</template>

<script setup lang="ts">
import { VButton } from 'shared/components/Button'
import Localization from './GenerateNewPlan.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const onClicked = () => {
// TODO: Сгенерировать новый план
}
</script>
