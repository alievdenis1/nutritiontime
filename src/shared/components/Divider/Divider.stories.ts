import type { Meta, StoryObj } from '@storybook/vue3'
import VDivider from './VDivider.vue'

const meta: Meta<typeof VDivider> = {
    title: 'Shared/VDivider',
    component: VDivider,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof VDivider>;

export const Default: Story = {}