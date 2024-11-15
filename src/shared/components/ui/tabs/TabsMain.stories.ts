import type { Meta, StoryObj } from '@storybook/vue3'
import { TabsMain, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs'

const meta: Meta<typeof TabsMain> = {
    title: 'UI/TabsMain',
    component: TabsMain,
    tags: ['autodocs'],
    argTypes: {
        defaultValue: { control: 'text' },
    },
}

export default meta
type Story = StoryObj<typeof TabsMain>;

const mockTabs = [
    { id: 'tab1', label: 'Account', content: 'Account settings and preferences' },
    { id: 'tab2', label: 'Password', content: 'Change your password' },
    { id: 'tab3', label: 'Notifications', content: 'Configure your notifications' },
]

export const Default: Story = {
    render: (args) => ({
        components: { TabsMain, TabsList, TabsTrigger, TabsContent },
        setup() {
            return { args, mockTabs }
        },
        template: `
            <TabsMain v-bind="args">
                <TabsList>
                    <TabsTrigger v-for="tab in mockTabs" :key="tab.id" :value="tab.id">
                        {{ tab.label }}
                    </TabsTrigger>
                </TabsList>
                <TabsContent v-for="tab in mockTabs" :key="tab.id" :value="tab.id">
                    {{ tab.content }}
                </TabsContent>
            </TabsMain>
        `,
    }),
    args: {
        defaultValue: 'tab1',
    },
}