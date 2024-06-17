<template>
	<el-button
		class="v-button"
		:class="[colorClass, borderRadiusClass]"
		:size="size"
		@click="onButtonClicked"
	>
		<slot />
	</el-button>
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
	borderRadius?: number
}>(), {
	color: ButtonColors.Green,
	size: 'default',
	borderRadius: 15
})

const { color, size, borderRadius } = toRefs(props)

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

const onButtonClicked = () => {
	emit('click')
}
</script>

<style lang="scss" scoped>
.v-button {
    @apply flex items-center justify-center text-base w-full h-[50px]
         border-solid py-0 px-[25px];

    &--green {
        @apply bg-green border-green text-white shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    }

    &--white {
        @apply bg-white border-[#3636364D] text-[#363636] shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    }
    &--red {
        @apply bg-red  text-white shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    }
    ////// До момента пока ховеры не утвердят
    // &:focus, &:hover {
    //     &.v-button--green {
    //         @apply bg-white border-green text-green;
    //     }

    //     &.v-button--white {
    //         @apply bg-white  shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    //     }
    //     &.v-button--red {
    //         @apply bg-red text-white shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    //     }
    // }

    &--default {
        @apply rounded-[15px];
    }
    &--rounding {
        @apply rounded-[40px];
    }
}
</style>
