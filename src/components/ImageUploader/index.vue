<script setup lang="ts">
import { computed, nextTick } from "vue"
import type { Image } from "./interface"

const images = defineModel<Image[]>("modelValue", { default: () => [] })
const props = withDefaults(
    defineProps<{
        accept?: string[]
        maxCount?: number
    }>(),
    {
        accept: () => ["image/*"],
        maxCount: Infinity,
    }
)

const emit = defineEmits<{
    change: [item: { images: Image[]; action: "append" | "remove" }]
    overflow: []
}>()

const stopDrag = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
}
const handleDrop = async (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (
        images.value.length + (e.dataTransfer?.files?.length || 0) >
        props.maxCount
    ) {
        return emit("overflow")
    }
    await append(e.dataTransfer?.files || [])
}

const append = async (files: FileList | (File | Image)[]) => {
    const imgs = await Promise.all(
        Array.from(files)
            .filter(
                v => props.accept.filter(t => new RegExp(t).test(v.type)).length
            )
            .map(async i => {
                if ("url" in i) return i
                return new Promise<Image>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(i as File)
                    reader.onload = () => {
                        Reflect.set(i, "url", reader.result)
                        resolve(i)
                    }
                    reader.onerror = reject
                })
            })
    )
    images.value = [...images.value, ...imgs]
    await nextTick()
    emit("change", {
        images: imgs,
        action: "append",
    })
}

const handleInput = async (e: Event) => {
    const files = (<HTMLInputElement>e.target)?.files || <File[]>[]
    if (images.value.length + files.length <= props.maxCount) {
        await append(files)
    } else {
        emit("overflow")
    }
    ;(<HTMLInputElement>e.target).value = ""
}

const remove = async (index: number) => {
    images.value = [...images.value] // 相当于emit('update:modelValue')
    await nextTick()
    emit("change", {
        images: images.value.splice(index, 1),
        action: "remove",
    })
}

const size = computed(() =>
    images.value.reduce((size, file) => size + file.size, 0)
)

defineExpose({ append, remove, size })
</script>

<template>
    <div class="na-image-uploader">
        <div
            class="na-image"
            v-show="images.length > 0"
            v-for="(item, index) of modelValue"
            :key="index"
        >
            <img :src="item.url" @dragstart="stopDrag" />
            <div class="na-image-footer">
                <div class="na-image-footer-content">
                    <div class="na-paragraph" data-ellipsis="2">
                        {{ item.name }}
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
            v-show="images.length < props.maxCount"
            @drop="
                images.length < props.maxCount
                    ? handleDrop($event)
                    : stopDrag($event)
            "
            @dragenter="stopDrag"
            @dragover="stopDrag"
            data-primary
        >
            <input
                type="file"
                class="na-input"
                :accept="`${accept || 'image/*'}`"
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

    @media screen and (max-width: 876px) {
        & {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media screen and (max-width: 540px) {
        & {
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
