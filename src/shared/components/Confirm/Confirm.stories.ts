import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VConfirm from './VConfirm.vue'

interface VConfirmProps {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isOpen: boolean;
}

type VConfirmEvents = {
    onConfirm: () => void;
    onCancel: () => void;
};

type VConfirmStoryProps = VConfirmProps & VConfirmEvents;

const meta: Meta<VConfirmProps> = {
    title: 'Shared/VConfirm',
    component: VConfirm,
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
        message: { control: 'text' },
        confirmText: { control: 'text' },
        cancelText: { control: 'text' },
        isOpen: { control: 'boolean' },
    },
}

export default meta
type Story = StoryObj<VConfirmStoryProps>;

export const Default: Story = {
    args: {
        title: 'Подтверждение действия',
        message: 'Вы уверены, что хотите выполнить это действие?',
        confirmText: 'Подтвердить',
        cancelText: 'Отмена',
        isOpen: true,
    },
    render: (args) => ({
        components: { VConfirm },
        setup() {
            const isOpen = ref(args.isOpen)
            const onConfirm = () => {
                isOpen.value = false
                args.onConfirm?.()
            }
            const onCancel = () => {
                isOpen.value = false
                args.onCancel?.()
            }
            return { ...args, isOpen, onConfirm, onCancel }
        },
        template: `
      <div>
        <VConfirm
          :title="title"
          :message="message"
          :confirm-text="confirmText"
          :cancel-text="cancelText"
          :is-open="isOpen"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
        <button @click="isOpen = true" v-if="!isOpen">Открыть модальное окно</button>
      </div>
    `,
    }),
}

export const CustomTexts: Story = {
    args: {
        title: 'Удаление аккаунта',
        message: 'Вы действительно хотите удалить свой аккаунт? Это действие нельзя отменить.',
        confirmText: 'Да, удалить',
        cancelText: 'Нет, оставить',
        isOpen: true,
    },
}