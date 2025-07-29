export interface Item {
    color: string
    key: string | number | symbol
    title?: string
    proportion: number
}

export interface DonutProps {
    items: Item[]
    strokeWidth?: number
    onItemClick?: (item: Item) => void
}
