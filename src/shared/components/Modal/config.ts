import { ButtonColors } from '../Button/config'

export enum ModalOption {
    EDIT = 'edit',
    SECURE = 'secure',
    DELETE = 'delete'
}

export type ModalConfig = {
    headerType: 'text' | 'image';
    mainContentType: 'input' | 'text' | 'image';
    headerContent: string;
    inputContent: string;
    buttonText: string;
    buttonColor: ButtonColors;
    imageContent?: string;
};

