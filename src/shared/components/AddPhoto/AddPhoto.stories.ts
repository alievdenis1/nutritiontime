import type { Meta, StoryObj } from '@storybook/vue3'
import VAddPhoto from './VAddPhoto.vue'
import { IconPhoto } from '@/shared/components/Icon'

const meta: Meta<typeof VAddPhoto> = {
    title: 'Shared/VAddPhoto',
    component: VAddPhoto,
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
        widthImage: { control: 'number' },
        heightImage: { control: 'number' },
        heightMain: { control: 'number' },
        backgrounds: { control: 'color' },
        iconColor: { control: 'color' },
        textColor: { control: 'color' },
    },
}

export default meta
type Story = StoryObj<typeof VAddPhoto>;

export const Default: Story = {
    args: {
        title: 'Add Photo',
        widthImage: 54,
        heightImage: 54,
        heightMain: 66,
        backgrounds: '#F3F3F3',
        icon: IconPhoto,
        iconColor: '#9F9FA0',
        textColor: '#1C1C1C',
    },
}