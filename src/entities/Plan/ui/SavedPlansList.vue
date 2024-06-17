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
					<v-button @click="onActionButtonEdit(item)">
						<img :src="`${imgPath}-edit.svg`">
					</v-button>
					<v-button @click="onActionButtonSecure(item)">
						<img :src="securedItems[item.id] ? `${imgPath}-setting-active.svg` : `${imgPath}-setting-no-active.svg`">
					</v-button>
					<v-button @click="onActionButtonDelete(item)">
						<img :src="`${imgPath}-trash.svg`">
					</v-button>
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
const { t } = useTranslation(Localization)

const imgPath = '../../../../public/image/icons/icon'

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
