import type { Meta, StoryObj } from '@storybook/vue3'
import VModal from './VModal.vue'

const meta: Meta<typeof VModal> = {
    title: 'Shared/VModal',
    component: VModal,
    tags: ['autodocs'],
    argTypes: {
        show: {
            control: 'boolean',
        },
    },
}

export default meta
type Story = StoryObj<typeof VModal>;

export const Default: Story = {
    args: {
        show: true,
    },
    render: (args) => ({
        components: { VModal },
        setup() {
            return { args }
        },
        template: `
      <VModal v-bind="args">
        <div class="p-4">
          <h2 class="text-lg font-bold mb-2">Modal Title</h2>
          <p>This is the modal content.</p>
        </div>
      </VModal>
    `,
    }),
}