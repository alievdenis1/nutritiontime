import type { Meta, StoryObj } from '@storybook/vue3'
import VButton from './VButton.vue'
import { ButtonColors } from './config'

const meta: Meta<typeof VButton> = {
    title: 'Shared/VButton',
    component: VButton,
    tags: ['autodocs'],
    argTypes: {
        color: {
            control: 'select',
            options: Object.values(ButtonColors),
        },
        size: {
            control: 'select',
            options: ['large', 'default', 'small'],
        },
        borderRadius: {
            control: 'number',
        },
    },
}

export default meta
type Story = StoryObj<typeof VButton>;

export const Default: Story = {
    args: {
        default: 'Button',
    },
}

export const Green: Story = {
    args: {
        default: 'Green Button',
        color: ButtonColors.Green,
    },
}

export const White: Story = {
    args: {
        default: 'White Button',
        color: ButtonColors.White,
    },
}

export const Red: Story = {
    args: {
        default: 'Red Button',
        color: ButtonColors.Red,
    },
}