import { ModalConfig } from './config'
import { ButtonColors } from '../Button'

export const modalConfig: Record<string, ModalConfig> = {
    edit: {
        headerType: 'text',
        mainContentType: 'input',
        headerContent: 'Редактировать коллекцию',
        inputContent: 'Введите название',
        buttonText: 'Сохранить',
        buttonColor: ButtonColors.Green,
    },
    secure: {
        headerType: 'text',
        mainContentType: 'input',
        headerContent: 'Добавить коллекцию',
        inputContent: 'Введите название',
        buttonText: 'Сохранить',
        buttonColor: ButtonColors.Green,
    },
    delete: {
        headerType: 'image',
        mainContentType: 'text',
        headerContent: '',
        inputContent: 'Вы уверены что хотите удалить коллекцию?',
        buttonText: 'Удалить',
        buttonColor: ButtonColors.Red   ,
        imageContent: 'icon-bin.svg',
    }
}