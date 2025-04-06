<template>
	<button
		class="text-[#9F9FA0] hover:text-red-500 transition-colors duration-200"
		:disabled="isDeleting"
		@click.stop="confirmDelete"
	>
		<slot>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="#9F9FA0"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
				/>
			</svg>
		</slot>
	</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { openConfirm } from '@/shared/components/Confirm'
import { deleteRecipe } from '../api'
import localization from './DeleteRecipe.localization.json'

const { t } = useTranslation({ ...localization })

const props = defineProps<{
	recipeId: number
}>()

const emit = defineEmits(['recipe-deleted', 'delete-error'])

// Состояние для процесса удаления
const isDeleting = ref(false)

// Функция подтверждения удаления
const confirmDelete = async () => {
	// Предотвращаем всплытие события, чтобы не срабатывали родительские обработчики
	event?.stopPropagation()

	const confirmed = await openConfirm({
		title: t('deleteRecipeTitle'),
		description: t('deleteRecipeDescription'),
		confirmButtonText: t('confirmDelete'),
		cancelButtonText: t('cancelDelete')
	})

	if (confirmed) {
		isDeleting.value = true
		try {
			await deleteRecipe(props.recipeId)
			emit('recipe-deleted', props.recipeId)
		} catch (error) {
			console.error('Error deleting recipe:', error)
			emit('delete-error', error)
		} finally {
			isDeleting.value = false
		}
	}
}
</script>