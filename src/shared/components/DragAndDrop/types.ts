export interface DragTypes {
    id: number
    label: string
    isActiveEdit: boolean
    count: number
}

export type VDragAndDropEmits = {
    edit: [tab: DragTypes];
    delete: [tab: DragTypes];
    adding: [];
    change: [id: number];
}