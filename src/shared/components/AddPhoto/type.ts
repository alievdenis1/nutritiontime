import { Component } from 'vue'

export interface AddPhoto {
    title: string;
    widthImage: number;
    heightImage: number;
    heightMain: number;
    backgrounds: string;
    icon?: Component;
    iconColor?: string;
    textColor?: string;
}