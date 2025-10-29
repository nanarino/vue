// CSS Houdini
import smoothCorners from "smooth-corners?url"
declare global {
    namespace CSS {
        const paintWorklet: Worklet
    }
}
if (CSS && "paintWorklet" in CSS) {
    CSS.paintWorklet.addModule(smoothCorners)
}

// 需要引入一下 window上有宣告theme
import type { Theme as _Theme } from "@holy-two/data-theme"
import message from "./message"

document.addEventListener("astro:after-swap", () => {
    document.documentElement.dataset["theme"] = window.theme
    message.reset()
})
