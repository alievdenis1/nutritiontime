import type { Meta, StoryObj } from '@storybook/vue3'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/shared/components/ui/dropdown-menu'

const meta: Meta<typeof DropdownMenu> = {
    title: 'UI/DropdownMenu',
    component: DropdownMenu,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DropdownMenu>;

const mockItems = [
    { label: 'Profile', icon: 'user' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Logout', icon: 'log-out' },
]

export const Default: Story = {
    render: () => ({
        components: {
            DropdownMenu,
            DropdownMenuTrigger,
            DropdownMenuContent,
            DropdownMenuItem,
            DropdownMenuSeparator
        },
        setup() {
            return { mockItems }
        },
        template: `
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem v-for="item in mockItems" :key="item.label">
                        <span :class="'icon-' + item.icon" class="mr-2"></span>
                        {{ item.label }}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>About</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        `,
    }),
}