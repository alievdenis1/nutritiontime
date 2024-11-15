import type { Meta, StoryObj } from '@storybook/vue3'
import VLoading from './VLoading.vue'

const meta: Meta<typeof VLoading> = {
    title: 'Shared/VLoading',
    component: VLoading,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof VLoading>;

export const Default: Story = {
    render: () => ({
        components: { VLoading },
        template: '<VLoading />',
    }),
}