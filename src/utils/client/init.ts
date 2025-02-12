// 需要引入一下 window上有宣告theme
import type { Theme } from "@holy-two/data-theme"
import message from "./message"

document.addEventListener("astro:after-swap", () => {
    document.documentElement.dataset["theme"] = window.theme
    message.reset()
})
