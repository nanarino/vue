import type { Ref, VNode } from "vue"

export type TabLabel = string

export interface TabGroupProps {
    primary?: boolean | "success" | "danger" | "warning"
    size?: "lg" | "md"
    renderRemoveIcon?: () => VNode
    renderLabelsText?: (label: TabLabel) => VNode | void
}

export interface TabPanelProps {
    label: TabLabel
    closeable?: boolean
}

export type TabPanelInject = {
    active?: Ref<TabLabel>
    data: TabPanelProps[]
}
