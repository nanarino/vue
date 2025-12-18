import type { VNode } from "vue"

/**URL是否已銷毀 */
export const REVOKED: unique symbol = Symbol("revoked")

export interface Image {
    [k: string]: any
    url: string
    name: string
    size: number
    type: string
}

export interface LocalInputFileImage extends Image {
    [REVOKED]: boolean
}

export interface ImageUploaderProps {
    /**相片格式 */
    accept?: string[]
    /**數量限制 */
    limit?: number
    /**自訂生成URL 并挂到File上 */
    customCreateUrl?: (
        raw: File | LocalInputFileImage
    ) => Promise<Image> | Image
    /**自訂銷毀 銷毀先前挂到File上URL */
    customRevokeUrl?: (img: Image | LocalInputFileImage) => Promise<void> | void
    appendText?: string
    removeText?: string
    renderAppendIcon?: () => VNode
    renderRemoveIcon?: () => VNode
}
