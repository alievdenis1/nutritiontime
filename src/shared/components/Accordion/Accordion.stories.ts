import type { Meta, StoryObj } from '@storybook/vue3'
import VAccordion from './VAccordion.vue'

const meta: Meta<typeof VAccordion> = {
    title: 'Shared/VAccordion',
    component: VAccordion,
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<typeof VAccordion>;

export const Default: Story = {
    args: {
        title: 'Accordion Title',
    },
    render: (args) => ({
        components: { VAccordion },
        setup() {
            return { args }
        },
        template: `
      <VAccordion v-bind="args">
        <p>This is the accordion content.</p>
      </VAccordion>
    `,
    }),
}