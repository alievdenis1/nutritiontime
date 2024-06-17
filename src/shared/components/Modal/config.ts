import { ButtonColors } from '../Button'

export type ModalConfig = {
    headerType: 'text' | 'image';
    mainContentType: 'input' | 'text' | 'image';
    headerContent: string;
    inputContent: string;
    buttonText: string;
    buttonColor: ButtonColors;
    imageContent?: string;
};