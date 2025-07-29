<script setup lang="ts">
import { computed } from "vue"
import type { DonutProps, Item } from "."

const props = withDefaults(defineProps<DonutProps>(), {
    strokeWidth: 60,
})
const offset = computed(
    () => ((props.strokeWidth || 0) / 2 / (2 * Math.PI * 100)) * 100
)
const data = computed(() =>
    props.items.reduce(
        (items: { item: Item; start: number; stop: number }[], item) => {
            const start = items.at(-1)?.stop ?? 0
            return [
                ...items,
                {
                    item,
                    start,
                    stop: start + item.proportion,
                },
            ]
        },
        []
    )
)
const Y = (p: number) => -Math.cos((p * (2 * Math.PI)) / 100) * 100
const X = (p: number) => Math.sin((p * (2 * Math.PI)) / 100) * 100
const P = (n: number) => [X(n), Y(n)]
</script>
<template>
    <svg
        width="100%"
        height="100%"
        viewBox="-180 -180 360 360"
        xmlns="http://www.w3.org/2000/svg"
    >
        <slot></slot>
        <circle
            cx="0"
            cy="0"
            r="100"
            fill="transparent"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke="rgb(var(--gray-2))"
            :stroke-width
        />
        <g
            v-for="{ item, start, stop } of data"
            :key="item.key"
            fill="transparent"
            data-donut-item
            :data-key="item.key"
            @click="() => props.onItemClick?.(item)"
            :style="{ cursor: props.onItemClick ? 'pointer' : 'auto' }"
        >
            <path
                v-if="stop - start < 100"
                v-show="stop - start > 0"
                :d="`
                    M ${P(start + offset)} 
                    A 100 100 
                    0 ${stop - start > 50 ? 1 : 0} 1, 
                    ${P(stop - offset)}
                    `"
                stroke-linejoin="round"
                stroke-linecap="round"
                :stroke="item.color || `rgb(var(--primary-4))`"
                :stroke-width
            >
                <title v-if="item.title" v-text="item.title"></title>
            </path>
            <circle
                v-else
                cx="0"
                cy="0"
                r="100"
                fill="transparent"
                stroke-linejoin="round"
                stroke-linecap="round"
                :stroke="item.color || `rgb(var(--primary-4))`"
                :stroke-width
            >
                <title v-if="item.title" v-text="item.title"></title>
            </circle>
        </g>
    </svg>
</template>
<style scoped>
[data-donut-item]:hover {
    transition: transform 0.3s;
    transform: scale(1.08);
}
</style>
