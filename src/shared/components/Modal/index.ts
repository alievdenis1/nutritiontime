import { ModalConfig, ModalOption } from './config'
import { ButtonColors } from '../Button'

export const modalConfig: Record<ModalOption, ModalConfig> = {
    [ModalOption.EDIT]: {
        headerType: 'text',
        mainContentType: 'input',
        headerContent: 'Редактировать коллекцию',
        inputContent: 'Введите название',
        buttonText: 'Сохранить',
        buttonColor: ButtonColors.Green,
    },
    [ModalOption.SECURE]: {
        headerType: 'text',
        mainContentType: 'input',
        headerContent: 'Добавить коллекцию',
        inputContent: 'Введите название',
        buttonText: 'Сохранить',
        buttonColor: ButtonColors.Green,
    },
    [ModalOption.DELETE]: {
        headerType: 'image',
        mainContentType: 'text',
        headerContent: '',
        inputContent: 'Вы уверены что хотите удалить коллекцию?',
        buttonText: 'Удалить',
        buttonColor: ButtonColors.Red,
    }
}