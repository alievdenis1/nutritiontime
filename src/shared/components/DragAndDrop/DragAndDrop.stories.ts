import type { Meta, StoryObj } from '@storybook/vue3'
import VDragAndDrop from './VDragAndDrop.vue'
import { DragTypes } from './types'

const meta: Meta<typeof VDragAndDrop> = {
    title: 'Shared/VDragAndDrop',
    component: VDragAndDrop,
    tags: ['autodocs'],
    argTypes: {
        items: { control: 'object' },
    },
}

export default meta
type Story = StoryObj<typeof VDragAndDrop>;

const mockItems: DragTypes[] = [
    { id: 1, label: 'Item 1', isActiveEdit: false, count: 5 },
    { id: 2, label: 'Item 2', isActiveEdit: true, count: 3 },
    { id: 3, label: 'Item 3', isActiveEdit: false, count: 7 },
]

export const Default: Story = {
    args: {
        items: mockItems,
    },
}