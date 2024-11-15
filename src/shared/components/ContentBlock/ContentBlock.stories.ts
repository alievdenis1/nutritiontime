import type { Meta, StoryObj } from '@storybook/vue3'
import VContentBlock from './VContentBlock.vue'
import { IconArrowRight } from '@/shared/components/Icon'

const meta: Meta<typeof VContentBlock> = {
    title: 'Shared/VContentBlock',
    component: VContentBlock,
    tags: ['autodocs'],
    argTypes: {
        buttonIcon: { control: 'object' },
        buttonClass: { control: 'text' },
        buttonText: { control: 'text' },
        text: { control: 'text' },
        image: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<typeof VContentBlock>;

export const Default: Story = {
    args: {
        buttonIcon: IconArrowRight,
        buttonClass: 'bg-forestGreen text-white',
        buttonText: 'Learn More',
        text: 'This is a content block',
        image: '/public/image/placeholder.png',
    },
}