import type { Meta, StoryObj } from '@storybook/vue3'
import IconsStory from './IconsStories.vue'
import * as iconComponents from './index'

const meta: Meta<typeof IconsStory> = {
    title: 'Shared/Icons',
    component: IconsStory,
    tags: ['autodocs'],
    argTypes: {
        color: { control: 'color' },
        size: { control: { type: 'range', min: 12, max: 96, step: 1 } },
    },
}

export default meta

type Story = StoryObj<typeof IconsStory>;

export const Icons: Story = {
    render: (args) => ({
        components: { IconsStory },
        setup() {
            return { args }
        },
        template: '<IconsStory v-bind="args" />',
    }),
    args: {
        color: '#111111',
        size: 25,
    },
}

const iconStories: Record<string, Story> = {}

Object.entries(iconComponents).forEach(([name, component]) => {
    iconStories[name] = {
        render: (args) => ({
            components: { Icon: component },
            setup() {
                return { args }
            },
            template: '<Icon v-bind="args" />',
        }),
        args: {
            color: '#000000',
        },
    }
})

export { iconStories }