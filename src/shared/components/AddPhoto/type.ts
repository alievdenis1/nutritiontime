import { Component } from 'vue'

export type AddPhotoEmits = {
    'update:error': [value: boolean],
    'upload:image': [value: string, file: File]
}

export interface AddPhoto {
    widthImage: number;
    heightImage: number;
    heightMain: number;
    title: string;
    icon?: Component;
    iconColor?: string;
    textColor?: string;
    backgrounds?: string;
    initialImage?: string | null;
    onImageUploaded?: (imageUrl: string | null) => void;
    error?: boolean;
    errorMessage?: string;
}