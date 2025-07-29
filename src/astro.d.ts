import type { IconifyIconAttributes } from "iconify-icon"

declare global {
    namespace astroHTML.JSX {
        interface IntrinsicElements {
            "iconify-icon": IconifyIconAttributes & HTMLAttributes
        }
    }
}
