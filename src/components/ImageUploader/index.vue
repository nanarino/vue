<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount } from "vue"
import {
    defaultCreateUrl,
    defaultRevokeUrl,
    REVOKED,
    type Image,
    type LocalInputFileImage,
} from "./types"

const images = defineModel<(Image | LocalInputFileImage)[]>("modelValue", {
    default: () => [],
})
const props = withDefaults(
    defineProps<{
        /**相片格式 */
        accept?: string[]
        /**數量限制 */
        limit?: number
        /**自訂生成URL 并挂到File上 */
        customCreateUrl?: (
            raw: File | LocalInputFileImage
        ) => Promise<Image> | Image
        /**自訂銷毀 銷毀先前挂到File上URL */
        customRevokeUrl?: (
            img: Image | LocalInputFileImage
        ) => Promise<void> | void
    }>(),
    {
        accept: () => ["image/*"],
        limit: Infinity,
        customCreateUrl: defaultCreateUrl,
        customRevokeUrl: defaultRevokeUrl,
    }
)

const emit = defineEmits<{
    change: [item: { images: Image[]; action: "append" | "remove" }]
    loadError: [event: Event, image: Image, index: number]
    overLimit: []
}>()

function handleDrag(e: DragEvent) {
    e.stopPropagation()
    e.preventDefault()
}

async function handleDrop(e: DragEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (
        images.value.length + (e.dataTransfer?.files?.length || 0) >
        props.limit
    ) {
        return emit("overLimit")
    }
    await append(e.dataTransfer?.files || [])
}

const files_setup_effect = async (
    files: FileList | (LocalInputFileImage | File | Image)[]
) =>
    Promise.all(
        Array.from(files)
            .filter(
                // 過濾格式不正確的檔案
                v => props.accept.filter(t => new RegExp(t).test(v.type)).length
            )
            .map(async file => {
                if ("url" in file) {
                    if (REVOKED in file && file[REVOKED]) {
                        // 有URL但是已經被銷毀了
                        return props.customCreateUrl(file)
                    } else {
                        // 非輸入的相片 或是已遠端持久化過的URL
                        return file
                    }
                }
                // 沒有URL 是新輸入的相片
                return props.customCreateUrl(file)
            })
    )

const append = async (files: FileList | (File | Image)[]) => {
    const created_images = await files_setup_effect(files)
    images.value = [...images.value, ...created_images]
    await nextTick()
    emit("change", {
        images: created_images,
        action: "append",
    })
}

async function handleInput(e: Event) {
    const files = (<HTMLInputElement>e.target)?.files || <File[]>[]
    if (images.value.length + files.length <= props.limit) {
        await append(files)
    } else {
        emit("overLimit")
    }
    ;(<HTMLInputElement>e.target).value = ""
}

async function handleLoadError(e: Event, img: Image, i: number) {
    emit("loadError", e, img, i)
}

const remove = async (index: number) => {
    const removed_image = images.value.splice(index, 1)
    images.value = [...images.value] // 相当于emit('update:modelValue')
    await props.customRevokeUrl(removed_image[0])
    await nextTick()
    emit("change", {
        images: removed_image,
        action: "remove",
    })
}

const size = computed(() =>
    images.value.reduce((size, file) => size + file.size, 0)
)

defineExpose({ append, remove, size, files_setup_effect })

void (async function images_setup() {
    // 重新設定URL
    // 防止URL已被銷毀 導致檔案預覽失敗
    await files_setup_effect(images.value)
})()

onBeforeUnmount(async () => {
    // 銷毀URL
    await Promise.all(images.value.map(props.customRevokeUrl))
})
</script>

<template>
    <div class="na-image-uploader">
        <div
            class="na-image"
            v-show="images.length > 0"
            v-for="(image, index) of modelValue"
            :key="image.url"
        >
            <img
                :src="image.url"
                @dragstart="handleDrag"
                @error="handleLoadError($event, image, index)"
            />
            <div class="na-image-footer">
                <div class="na-image-footer-content">
                    <div class="na-paragraph" data-ellipsis="2">
                        {{ image.name }}
                    </div>
                </div>
                <div class="na-image-footer-action">
                    <iconify-icon
                        icon="line-md:remove"
                        name="delete"
                        class="na-link"
                        @click="remove(index)"
                    />
                </div>
            </div>
        </div>
        <div
            class="na-image na-input-wrapper"
            v-show="images.length < props.limit"
            @drop="
                images.length < props.limit
                    ? handleDrop($event)
                    : handleDrag($event)
            "
            @dragenter="handleDrag"
            @dragover="handleDrag"
            data-primary
        >
            <input
                type="file"
                class="na-input"
                :accept="`${accept || 'image/*'}` || 'image/*'"
                @change="handleInput"
                multiple
            />
            <iconify-icon
                icon="line-md:plus"
                style="font-size: 48px; pointer-events: none"
            />
            <span> 點擊添加或拖拽相片 </span>
        </div>
    </div>
</template>

<style scoped>
.na-image-uploader {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;

    @media screen and (max-width: 1650px) and (min-width: 1024px) {
        & {
            /** 代碼塊在右側 且熒幕較小時 */
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media screen and (min-width: 1024px) {
        & {
            /** 代碼塊在右側時 需要減去代碼塊寬度 */
            max-width: calc(100vw - var(--max-width-code-aside, 540px));
        }
    }

    @media screen and (max-width: 876px) {
        & {
            /** 較小熒幕 ipad mini 竪屏 */
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media screen and (max-width: 540px) {
        & {
            /** 手機 */
            grid-template-columns: 1fr 1fr;
        }
    }

    @media screen and (max-width: 360px) {
        & {
            grid-template-columns: 1fr;
        }
    }

    .na-image {
        aspect-ratio: 1 / 1;
        border-radius: var(--border-radius-md);

        .na-link {
            font-size: 22px;
        }
    }
}
</style>
