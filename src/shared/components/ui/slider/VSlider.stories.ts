import type { Meta, StoryObj } from '@storybook/vue3'
import { VSlider } from '@/shared/components/ui/slider'
import { ref } from 'vue'

const meta: Meta<typeof VSlider> = {
    title: 'UI/VSlider',
    component: VSlider,
    tags: ['autodocs'],
    argTypes: {
        modelValue: {
            control: { type: 'object' },
        },
        min: { control: { type: 'number' } },
        max: { control: { type: 'number' } },
        step: { control: { type: 'number' } },
    },
}

export default meta
type Story = StoryObj<typeof VSlider>;

export const Default: Story = {
    render: (args) => ({
        components: { VSlider },
        setup() {
            const value = ref(args.modelValue)
            return { args, value }
        },
        template: `
            <div>
                <VSlider v-model="value" :min="args.min" :max="args.max" :step="args.step" />
                <p>Current value: {{ value }}</p>
            </div>
        `,
    }),
    args: {
        modelValue: [50],
        min: 0,
        max: 100,
        step: 1,
    },
}

export const Range: Story = {
    render: (args) => ({
        components: { VSlider },
        setup() {
            const value = ref(args.modelValue)
            return { args, value }
        },
        template: `
            <div>
                <VSlider v-model="value" :min="args.min" :max="args.max" :step="args.step" />
                <p>Current range: {{ value }}</p>
            </div>
        `,
    }),
    args: {
        modelValue: [25, 75],
        min: 0,
        max: 100,
        step: 1,
    },
}