<template>
	<el-button
		text
		class="p-[5px]"
		@click="onClicked"
	>
		<div class="flex row text-default text-green w-full items-center">
			<el-icon
				size="17"
				class="mr-[12px]"
			>
				<icon-copy />
			</el-icon>

			{{ t('copy') }}
		</div>
	</el-button>
</template>

<script setup lang="ts">
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import { toRefs } from 'vue'
import { useCopyCollectionStore } from '../model'
import { IconCopy } from 'shared/components/Icon'
import Localization from './CopyCollection.localization.json'
import { useTranslation } from '@/shared/lib/i18n'

const { t } = useTranslation(Localization)

const emit = defineEmits<{
  (event: 'success'): void;
  (event: 'error'): void;
}>()

const props = defineProps<{
	planId: Collection['id']
}>()

const { planId } = toRefs(props)

const store = useCopyCollectionStore()

const onClicked = () => {
	store.copyCollection(planId.value)
		.then(() => {
			emit('success')
		}).catch(() => {
			emit('error')
		})
}
</script>

<style lang="scss" scoped></style>
