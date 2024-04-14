import type { CSSProperties } from 'vue'

export type CaloriesItem = {
    id: number,
    count: number
}

export type SliderItem = {
    id: number,
    name: string
}

export type Mark = {
    style: CSSProperties
    label: string
  }
  
export type Marks = Record<number, Mark | string>