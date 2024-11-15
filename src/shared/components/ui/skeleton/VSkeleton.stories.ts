import type { Meta, StoryObj } from '@storybook/vue3'
import { VSkeleton } from '@/shared/components/ui/skeleton'

const meta: Meta<typeof VSkeleton> = {
    title: 'UI/VSkeleton',
    component: VSkeleton,
    tags: ['autodocs'],
    argTypes: {
        class: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<typeof VSkeleton>;

export const Default: Story = {
    args: {
        class: 'w-[200px] h-[20px]',
    },
}

export const Circle: Story = {
    args: {
        class: 'w-[50px] h-[50px] rounded-full',
    },
}

export const CardSkeleton: Story = {
    render: () => ({
        components: { VSkeleton },
        template: `
            <div class="border p-4 max-w-sm rounded-xl">
                <VSkeleton class="w-[100px] h-[100px] rounded-full mb-4" />
                <VSkeleton class="w-full h-[20px] mb-2" />
                <VSkeleton class="w-2/3 h-[20px] mb-2" />
                <VSkeleton class="w-1/2 h-[20px]" />
            </div>
        `,
    }),
}