<template>
	<el-button
		text
		class="rounded"
		@click="deleteCollectionDialogVisible = true"
	>
		<div class="flex row text-default text-[#7C473F] w-full items-center gap-3 font-normal">
			<icon-trash />
			{{ t('delete') }}
		</div>
	</el-button>
	<DeleteModal
		v-model="deleteCollectionDialogVisible"
		:plan-id="planId"
	/>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import Localization from './DeleteCollection.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import DeleteModal from './DeleteModal.vue'
import { IconTrash } from '@/shared/components/Icon'

const { t } = useTranslation(Localization)

const deleteCollectionDialogVisible = ref<boolean>(false)

const props = defineProps<{
	planId: Collection['id']
}>()

const { planId } = toRefs(props)

</script>
