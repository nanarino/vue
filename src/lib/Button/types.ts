export interface ButtonProps {
    primary?: boolean | "success" | "danger" | "warning"
    disabled?: boolean
    onClick?: (e: MouseEvent) => void | Promise<void>
    autoLoading?: boolean
    size?: "lg" | "md" | "sm"
}
