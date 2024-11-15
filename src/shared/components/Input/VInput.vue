<template>
	<div class="wrapper">
		<input
			v-if="!textarea"
			:id="useId()"
			ref="inputRef"
			v-bind="$attrs"
			:value="modelValue"
			:disabled="props.disabled"
			:class="inputClasses"
			:readonly="props.readonly"
			:autofocus="props.autofocus"
			:maxlength="props.maxLength"
			@input="onInput"
			@focusin="!props.readonly && setFocus(true)"
			@focusout="setFocus(false)"
		>
		<textarea
			v-else
			ref="textareaRef"
			v-bind="$attrs"
			:value="modelValue"
			:disabled="disabled"
			:class="inputClasses"
			:readonly="props.readonly"
			:maxlength="props.maxLength"
			@input="onInput"
			@focusin="setFocus(true)"
			@focusout="setFocus(false)"
			@scroll="onScroll"
		/>

		<p
			class="title"
			:class="[titleClasses]"
		>
			{{ props.title }}
		</p>

		<span
			v-if="$slots['right-icon'] || props.clearable"
			class="absolute top-4 right-2 icon flex justify-between items-center gap-3"
		>
			<IconClose
				v-if="props.clearable"
				icon-color="#9F9FA0"
				class="clear"
				@click="onClear"
			/>
			<slot name="right-icon" />
		</span>
		<div
			v-if="$slots['list'] && props.searchable && isFocused"
			class="absolute top-full right-0 left-0 bg-white"
			:style="{
				zIndex: props.zIndex
			}"
		>
			<slot name="list" />
		</div>

		<p
			v-if="hasError"
			class="text-coralRed font-medium text-xs inline-block text-left mt-1"
		>
			{{ props.errorMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useId } from 'radix-vue'
import { IconClose } from 'shared/components/Icon'

type InputBackground = 'default' | 'gray'

export type InputEmits = {
    'update:modelValue': [string]
    'update:error': [boolean]
    focusout: [void]
    'clear:error': [string]
}

export interface InputProps {
    modelValue: string;
    title: string;
    name: string;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    textarea?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    digital?: boolean;
    noDigital?: boolean;
    background?: InputBackground;
    autofocus?: boolean;
    searchable?: boolean;
    zIndex?: string;
    maxLength?: number;
}

defineSlots<{
    default(props: object): never;
    'right-icon'(props: object): never;
    'list'(props: object): never;
}>()

const props = withDefaults(
    defineProps<InputProps>(),
    {
        background: 'default',
        errorMessage: '',
        zIndex: '',
        maxLength: 100
    }
)

const emits = defineEmits<InputEmits>()

const isFocused = ref<boolean>(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const titleClasses = ref<string>('')

const hasError = computed((): boolean => props.error || (!!props.errorMessage && props.error))

const inputClasses = computed(() => {
    const classes = []

    if (hasError.value) classes.push('error')
    if (props.modelValue?.length || props.modelValue) classes.push('focused')
    if (props.readonly) classes.push('readonly')
    if (props.background !== 'default') classes.push(props.background)

    return classes
})

const onInput = (event: Event): void => {
    let value = (event.target as HTMLInputElement).value

    if (props.noDigital) {
        value = value.replace(/\d/g, '')
    }
    if (props.digital) {
        value = value.replace(/[^\d]/g, '')
    }

    (event.target as HTMLInputElement).value = value
    emits('update:modelValue', value)
    emits('clear:error', props.name)
}

const setFocus = (value: boolean): void => {
    isFocused.value = value

    if (!value) emits('focusout')
}

const onScroll = (): void => {
    if (!textareaRef.value) return

    const scrollTop = textareaRef.value.scrollTop
    if (scrollTop >= 8) titleClasses.value = 'hidden'
    if (scrollTop < 8) titleClasses.value = ''
}

const onClear = (): void => {
    emits('update:modelValue', '')
}

const onAutofocus = (): void => {
    nextTick(() => {
        if (!inputRef.value || !props.autofocus) return
        inputRef.value.focus()
        setFocus(true)
    })
}

defineExpose({ onAutofocus })
</script>

<style lang="scss" scoped>
.wrapper {
    @apply relative w-full min-h-14;

    &:has(textarea) {
        @apply h-auto;
    }

    &:has(.icon) {
        input {
            @apply pr-8;
        }
    }

    &:has(.clear) {
        input {
            @apply pr-20;
        }
    }

    &:has(input:focus), &:has(textarea:focus), &:has(input.focused), &:has(textarea.focused) {
        .title {
            @apply text-xs top-1.5;
        }

        .focused {
            @apply border-[#319A6E33] pt-[26px] py-3 pb-[10px];
        }
    }

    & .title {
        @apply pointer-events-none flex absolute text-[#9F9FA0] font-normal top-[18px] bottom-[18px] left-3 right-3 text-description transition-[150ms] h-fit w-fit;
    }

    input, textarea {
        @apply mt-0 border border-[#E1E1E1] border-solid rounded py-1.5 px-3 h-full w-full outline-none relative font-normal text-description text-[#1c1c1c];

        &:focus {
            @apply border-[#319A6E33] pt-[26px] py-3 pb-[10px];
        }

        &.gray {
            @apply bg-[#F3F3F3] border-transparent;
        }
    }

    input {
        @apply min-h-14;
    }

    textarea {
        @apply min-h-[122px];
        resize: none;

        &:focus {
            @apply pt-[32px] py-3 pb-[10px];
        }
    }

    .hidden {
        @apply opacity-0;
    }

    .error {
        @apply border-[#F04F4F] !important;
    }

    .readonly {
        pointer-events: none;
    }
}
</style>