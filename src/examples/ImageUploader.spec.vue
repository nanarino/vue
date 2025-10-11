<script setup lang="ts">
import { shallowRef, useTemplateRef, ref, h } from "vue"
import { ImageUploader, type Image } from "@/lib/ImageUploader"
import { message } from "@/scripts/client/message"

const imgs = shallowRef<Image[]>([])
const ImageUploaderRef = useTemplateRef("ImageUploaderRef")

// 自訂圖示
const renderAppendIcon = () => h("iconify-icon", { icon: "line-md:plus" })
const renderRemoveIcon = () => h("iconify-icon", { icon: "line-md:remove" })

const change = async (item: {
    images: Image[]
    action: "append" | "remove"
}) => {
    console.log(item)
    console.log(ImageUploaderRef.value?.size)
}

// 初始相片
void (async function init() {
    const res = await fetch(`${import.meta.env.BASE_URL}images/IMG_2568.json`)
    const IMG_2568 = (await res.json()) as Image
    if (IMG_2568.url)
        IMG_2568.url = IMG_2568.url.replace(/^\//, import.meta.env.BASE_URL)
    imgs.value = [IMG_2568]
})()

// 測試 `v-if`
const hidden = ref(false)
</script>
<template>
    <main style="display: contents">
        <ImageUploader
            v-if="!hidden"
            v-model="imgs"
            :limit="9"
            :accept="[`image/gif`, `image/jpeg`, `image/png`]"
            ref="ImageUploaderRef"
            @change="change"
            :render-append-icon
            :render-remove-icon
            @over-limit="message({ content: `最多9張`, primary: `danger` })"
        />
        <p class="na-paragraph na-font-mono" data-has-indent>
            {{ imgs.map((x: Image) => x.name) }}
        </p>
        <form onsubmit="return false">
            <label class="na-form-item">
                <span>hidden</span>
                <div class="na-input-wrapper">
                    <span class="na-switch">
                        <input
                            type="checkbox"
                            class="na-input"
                            v-model="hidden"
                            id="hidden"
                            name="hidden"
                        />
                        <i class="na-switch-mover"></i>
                        <span class="na-switch-slot"></span>
                    </span>
                </div>
            </label>
        </form>
    </main>
</template>
<style scoped>
form {
    margin: 2em;
}
</style>
