<template>
	<el-button
		text
		class="rounded"
		@click="deleteCollectionDialogVisible = true"
	>
		<div class="flex row text-default text-[#7C473F] w-full items-center gap-3 font-normal">
			<img
				src="/image/icons/icon-trash.svg"
				width="17"
			>

			{{ t('delete') }}
		</div>
	</el-button>
	<DeleteModal
		v-model="deleteCollectionDialogVisible"
		:planId="planId"
	/>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { Plan } from 'entities/Plan/types'
import Localization from './DeletePlan.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import DeleteModal from './DeleteModal.vue'

const { t } = useTranslation(Localization)

const deleteCollectionDialogVisible = ref<boolean>(false)

const props = defineProps<{
	planId: Plan['id']
}>()

const { planId } = toRefs(props)

</script>
