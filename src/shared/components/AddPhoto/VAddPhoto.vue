<template>
	<div
		class="photo-upload flex justify-center items-center"
		:class="errorClasses"
		:style="{ height: `${heightMain}px`, background: backgrounds }"
	>
		<div
			v-if="uploadedImage"
			class="flex gap-[8px] items-center justify-center"
		>
			<img
				:src="uploadedImage"
				alt="Uploaded Photo"
				class="object-cover rounded"
				:style="{ width: `${widthImage}px`, height: `${heightImage}px` }"
			>
			<button
				class="p-2 cursor-pointer"
				@click.stop.prevent="removeImage"
			>
				<IconClose :icon-color="iconColor" />
			</button>
		</div>
		<label
			v-else
			class="photo-upload-label flex justify-center items-center"
		>
			<input
				ref="fileInput"
				type="file"
				class="hidden"
				@change="handleFileUpload"
			>
			<div class="photo-upload-content flex items-center gap-2">
				<component
					:is="icon"
					v-if="icon"
					:icon-color="iconColor"
				/>
				<span
					class="text-xs"
					:style="{ color: textColor }"
				>{{ title }}</span>
			</div>
		</label>
	</div>
	<p
		v-if="props.error"
		class="text-xs text-coralRed max-w-xs mb-[24px]"
	>
		{{ props.errorMessage }}
	</p>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { IconClose, IconPhoto } from 'shared/components/Icon'
import { AddPhoto, AddPhotoEmits } from './type.ts'

const emits = defineEmits<AddPhotoEmits>()
const props = withDefaults(defineProps<AddPhoto & {
	initialImage?: string | null;
	// TODO: переписать
	onImageUploaded?: (imageUrl: string | null) => void;
}>(), {
	icon: IconPhoto,
	iconColor: '#9F9FA0',
	textColor: '#1C1C1C',
	initialImage: null,
	onImageUploaded: undefined,
	error: false,
	errorMessage: ''
})

const uploadedImage = ref<string | null>(props.initialImage)
const imageTypes = ['jpeg', 'jpg', 'png']

const errorClasses = computed(() => props.error ? 'border-1 border-solid border-[#f04f4f]' : '')

watch(() => props.initialImage, (newValue) => {
	uploadedImage.value = newValue
})

const onUploadError = (): void => {
	emits('update:error', true)
}

const validateFileType = (file: File): boolean => {
	return imageTypes.some(type => file.type.includes(type))
}

const validateResult = (file: File): void => {
	const image = new Image()

	image.onerror = (): void => {
		onUploadError()
	}

	image.src = URL.createObjectURL(file)
	uploadedImage.value = image.src
	emits('upload:image', image.src, file)
}

const handleFileUpload = (event: Event): void => {
	const target = event.target as HTMLInputElement
	const files = target.files

	emits('update:error', false)

	if (files && files[0]) {
		Array.from(files).forEach((file) => {
			const isValidType = validateFileType(file)

			if (!isValidType) {
				onUploadError()
				return
			}
			validateResult(file)
		})
	}
}

const removeImage = () => {
	uploadedImage.value = null
	// TODO: переписать
	if (props.onImageUploaded) {
		props.onImageUploaded(null)
	}
}

const fileInput = ref<HTMLInputElement | null>(null)

const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

defineExpose({ openFileDialog })
</script>

<style scoped>
.photo-upload {
	@apply rounded-[16px] text-center cursor-pointer;
}

.photo-upload-label {
	@apply flex flex-col items-center;
}

.photo-upload-input {
	@apply hidden;
}
</style>