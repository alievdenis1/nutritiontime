<template>
	<el-button
		class="v-button"
		:class="[colorClass]"
		:size="size"
		@click="onButtonClicked"
	>
		<slot />
	</el-button>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { ButtonColors } from './config.ts'

const emit = defineEmits<{
	(event: 'click')
}>()

const props = withDefaults(defineProps<{
	color?: ButtonColors,
	size?: 'large' | 'default' | 'small'
}>(), {
	color: ButtonColors.Green,
	size: 'default'
})
const { color, size } = toRefs(props)

const colorClass = computed<string>(() => {
	if (color.value === ButtonColors.Green) {
		return 'v-button--green'
	}

	if (color.value === ButtonColors.White) {
		return 'v-button--white'
	}

	return ''
})

const onButtonClicked = () => {
	emit('click')
}
</script>

<style lang="scss" scoped>
.v-button {
	@apply rounded-[15px] flex items-center justify-center text-base text-white w-full h-[70px]
		border-[1px] border-solid py-0 px-[25px];

    &--green {
		@apply bg-green border-green shadow-[0_3px_2px_rgba(237,216,194,0.35)];
    }

	&--white {
		@apply bg-white border-white shadow-[0_3px_2px_rgba(237,216,194,0.35)];
	}

    &:focus, &:hover {
        &.v-button--green {
			@apply bg-white border-green text-green;
        }

		&.v-button--white {
			@apply bg-white border-black shadow-[0_3px_2px_rgba(237,216,194,0.35)];
		}
    }
}
</style>
