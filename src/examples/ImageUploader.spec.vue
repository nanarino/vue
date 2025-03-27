<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue"
import { ImageUploader, type Image } from "@/components/ImageUploader"
import { message } from "@/utils/client/message"

const imgs = shallowRef<Image[]>([])
const ImageUploaderRef = useTemplateRef("ImageUploaderRef")

const change = async (item: {
    images: Image[]
    action: "append" | "remove"
}) => {
    console.log(item)
    console.log(ImageUploaderRef.value?.size)
}

void (async function init() {
    const res = await fetch(`${import.meta.env.BASE_URL}data/Kirby.json`)
    const Kirby = (await res.json()) as Image
    if (Kirby.url)
        Kirby.url = Kirby.url.replace(/^\//, import.meta.env.BASE_URL)
    imgs.value = [Kirby]
})()
</script>

<template>
    <view style="display: contents">
        <ImageUploader
            v-model="imgs"
            :max-count="9"
            :accept="[`image/gif`, `image/jpeg`, `image/png`]"
            ref="ImageUploaderRef"
            @change="change"
            @overflow="message({ content: `超出数量限制`, primary: `danger` })"
        />
        <p class="na-font-mono">
            {{ imgs.map((x: Image) => x.name) }}
        </p>
    </view>
</template>
