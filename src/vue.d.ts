import type { IconifyIconAttributes } from "iconify-icon"
export {}

declare module "vue" {
    interface GlobalComponents {
        "iconify-icon": new () => HTMLElement & {
            /** @deprecated */
            $props: IconifyIconAttributes
        }
    }
}
