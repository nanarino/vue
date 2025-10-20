import type { Ref, VNode } from "vue"

export type TabLabel = string

export interface TabGroupProps<T extends TabLabel = TabLabel> {
    primary?: boolean | "success" | "danger" | "warning"
    size?: "lg" | "md"
    renderRemoveIcon?: () => VNode
    renderLabelsText?: (label: T) => VNode | void
}

export interface TabPanelProps<T extends TabLabel = TabLabel> {
    label: T
    closeable?: boolean
}

export type TabPanelInject<T extends TabLabel = TabLabel> = {
    active?: Ref<T | undefined>
    data: TabPanelProps<T>[]
}
