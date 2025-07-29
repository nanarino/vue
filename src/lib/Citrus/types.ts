export interface Item {
    color: string
    key: string | number | symbol
    title?: string
}

export interface CitrusProps {
    items: Item[]
    strokeWidth?: number
    onItemClick?: (item: Item) => void
}
