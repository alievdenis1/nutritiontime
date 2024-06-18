<template>
	<v-collapse
		v-loading="isLoadingSavedPlans"
		:data="savedPlans"
		title-key="name"
		:title="t('myCollection')"
		name-key="id"
		@generate="onGenerateNewPlan"
	>
		<template #item="{ item }">
			<div class="flex row items-center justify-between w-full">
				<plan-info :plan="item" />
				<div class="flex items-center cursor-pointer gap-4">
					<IconEdit @click="onActionButtonEdit(item)" />
					<div @click="onActionButtonSecure(item)">
						<IconSettingActive v-if="securedItems[item.id]" />
						<IconSettingNoActive v-else />
					</div>
					<IconTrach @click="onActionButtonDelete(item)" />
				</div>
			</div>
		</template>
	</v-collapse>
	<VModal
		:visible="modalVisible"
		:modal-option="mode"
		@update:visible="modalVisible = $event"
	/>
</template>

<script setup lang="ts">
import { usePlansStore } from '../model'
import { storeToRefs } from 'pinia'
import PlanInfo from './PlanInfo.vue'
import { VCollapse } from 'shared/components/Collapse'
import { Plan } from '../types'
import Localization from './SavedPlansList.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { reactive, ref } from 'vue'
import VModal from '@/shared/components/Modal/VModal.vue'
import IconTrach from '@/shared/components/Icon/IconTrash.vue'
import IconSettingActive from '@/shared/components/Icon/IconSettingActive.vue'
import IconSettingNoActive from '@/shared/components/Icon/IconSettingNoActive.vue'
import IconEdit from '@/shared/components/Icon/IconEdit.vue'

const { t } = useTranslation(Localization)

const modalVisible = ref(false)
const securedItems = reactive<{ [key: number]: boolean }>({})
const mode = ref('')

const emit = defineEmits<{
(event: 'edit', value: Plan): void;
(event: 'secure', value: Plan): void;
(event: 'delete', value: Plan): void;
}>()

const store = usePlansStore()
const { savedPlans, isLoadingSavedPlans } = storeToRefs(store)

const onActionButtonEdit = (plan: Plan) => {
	mode.value = 'edit'
    modalVisible.value = true
	emit('edit', plan)
}

const onActionButtonSecure = (plan: Plan) => {
	securedItems[plan.id] = !securedItems[plan.id]
	// modalVisible.value = true
	// mode.value = 'secure'
	emit('secure', plan)
}

const onActionButtonDelete = (plan: Plan) => {
	mode.value = 'delete'
	modalVisible.value = true
	emit('delete', plan)
}

const onGenerateNewPlan = () => {
console.log('Новый план создан')
}

</script>
