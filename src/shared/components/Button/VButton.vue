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
import {computed, toRefs} from 'vue'
import {ButtonColors} from './config.ts'

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
@use "shared/styles/variables";

.v-button {
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    line-height: 20px;
    color: variables.$color_white;
    width: 100%;
    height: 70px;
    border-style: solid;
    border-width: 1px;
	padding: 0 25px;

    &--green {
		background: variables.$color_green;
		border-color: variables.$color_green;
        box-shadow: 0 3px 2px rgba(237, 216, 194, 0.35);
    }

	&--white {
		background: variables.$color_white;
		border-color: variables.$color_white;
		box-shadow: 0 3px 2px rgba(237, 216, 194, 0.35);
	}

    &:focus, &:hover {
        &.v-button--green {
			border-color: variables.$color_green;
			background: variables.$color_white;
			color: variables.$color_green;
        }

		&.v-button--white {
			background: variables.$color_white;
			border-color: variables.$color_black;
			box-shadow: 0 3px 2px rgba(237, 216, 194, 0.35);
		}
    }
}
</style>
