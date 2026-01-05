export interface ButtonProps {
    primary?: boolean | "success" | "danger" | "warning"
    square?: boolean
    round?: boolean
    ghost?: boolean
    disabled?: boolean
    onClick?: (e: MouseEvent) => void | Promise<void>
    autoLoading?: boolean
    size?: "lg" | "md" | "sm"
}
