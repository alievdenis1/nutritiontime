import type { Meta, StoryObj } from '@storybook/vue3'
import VInput from './VInput.vue'

const meta: Meta<typeof VInput> = {
    title: 'Shared/VInput',
    component: VInput,
    tags: ['autodocs'],
    argTypes: {
        value: { control: 'text' },
        title: { control: 'text' },
        required: { control: 'boolean' },
        error: { control: 'boolean' },
        errorMessage: { control: 'text' },
        disabled: { control: 'boolean' },
        'onUpdate:value': { action: 'update:value' },
        'onUpdate:error': { action: 'update:error' },
    },
}

export default meta
type Story = StoryObj<typeof VInput>;

export const Default: Story = {
    args: {
        value: '',
        title: 'Input Title',
    },
}

export const WithError: Story = {
    args: {
        value: '',
        title: 'Input with Error',
        error: true,
        errorMessage: 'This field is required',
    },
}

export const Disabled: Story = {
    args: {
        value: '',
        title: 'Disabled Input',
        disabled: true,
    },
}

export const Required: Story = {
    args: {
        value: '',
        title: 'Required Input',
        required: true,
    },
}