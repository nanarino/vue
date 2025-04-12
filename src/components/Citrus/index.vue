<script setup lang="ts">
import type { Item } from "./types"
import { computed } from "vue"

const props = defineProps<{
    items: Item[]
    strokeWidth?: number
    onItemClick?: (item: Item) => void
}>()

const Y = (n: number, a: number, o = 0, r = 100) =>
    -Math.cos((n * (2 * Math.PI) + o) / a) * r
const X = (n: number, a: number, o = 0, r = 100) =>
    Math.sin((n * (2 * Math.PI) + o) / a) * r

const A = computed(() => props.items.length)
const O = computed(() => (props.strokeWidth ?? 0) / 2 / X(0.5, A.value))
const P1 = (n: number) => [X(n, A.value), Y(n, A.value)]
const P2 = (n: number) => [X(n + 1, A.value), Y(n + 1, A.value)]
const N = (n: number) => [
    O.value * X(n + 0.5, A.value),
    O.value * Y(n + 0.5, A.value),
]
</script>
<template>
    <svg
        width="100%"
        height="100%"
        viewBox="-180 -180 360 360"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            v-if="A < 2"
            cx="0"
            cy="0"
            r="100"
            data-citrus-item
            :fill="props.items[0]?.color ?? `rgb(var(--gray-2))`"
            :data-key="props.items[0]?.key ?? NaN"
            @click="() => props.items[0] && props.onItemClick?.(props.items[0])"
            :style="{
                cursor:
                    props.items[0] && props.onItemClick ? 'pointer' : 'auto',
            }"
            stroke-linejoin="round"
            stroke-linecap="round"
            :stroke="props.items[0]?.color ?? `rgb(var(--gray-2))`"
            :stroke-width
        />
        <g
            v-else
            v-for="(item, n) of props.items"
            :key="item.key"
            :fill="item.color"
            data-citrus-item
            :data-key="item.key"
            @click="() => props.onItemClick?.(item)"
            :style="{ cursor: props.onItemClick ? 'pointer' : 'auto' }"
        >
            <path
                :d="`M 0 0 
                    L ${P1(n)} 
                    A 100 100 
                    0 0 1 
                    ${P2(n)}
                    Z`"
                stroke-linejoin="round"
                stroke-linecap="round"
                :stroke="item.color"
                :stroke-width
                :transform="`translate(${N(n)})`"
            ></path>
        </g>
    </svg>
</template>
<style scoped>
circle:hover,
g:hover {
    transition: transform 0.3s;
    transform: scale(1.08);
}
</style>
