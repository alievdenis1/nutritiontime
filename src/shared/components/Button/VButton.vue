<template>
	<button
		class="v-button"
		:class="[colorClass, borderRadiusClass, disabledClass]"
		:size="size"
		:disabled="props.disabled"
		@click="onButtonClicked"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { ButtonColors, ButtonRadius } from './config.ts'

const emit = defineEmits<{
	(event: 'click'):void
}>()

const props = withDefaults(defineProps<{
	color?: ButtonColors,
	size?: 'large' | 'default' | 'small',
	borderRadius?: number,
    disabled?: boolean
}>(), {
	color: ButtonColors.Green,
	size: 'default',
	borderRadius: 15,
    disabled: false
})

const { color, size, borderRadius, disabled } = toRefs(props)

const colorClass = computed<string>(() => {
	if (color.value === ButtonColors.Green) return 'v-button--green'
	if (color.value === ButtonColors.White) return 'v-button--white'
	if (color.value === ButtonColors.Red) return 'v-button--red'
	return ''
})

const borderRadiusClass = computed<string>(() => {
	if (borderRadius.value === ButtonRadius.Default) return 'v-button--default'
	if (borderRadius.value === ButtonRadius.Rounding) return 'v-button--rounding'
	return ''
})

const disabledClass = computed<string>(() => {
	return disabled.value ? 'v-button--disabled' : ''
})

const onButtonClicked = () => {
	emit('click')
}
</script>

<style lang="scss" scoped>
.v-button {
    @apply flex items-center justify-center text-base w-full h-[50px]
         border-solid py-0 px-[15px] gap-[8px] border-transparent z-20;

    &--green {
        @apply bg-forestGreen text-white shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    }

    &--white {
        @apply bg-white border-forestGreen text-forestGreen shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    }
    &--red {
        @apply bg-red  text-white shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    }

    &--default {
        @apply rounded-[16px];
    }
    &--rounding {
        @apply rounded-[40px];
    }

	&--disabled {
		@apply opacity-10;
	}
}
</style>
