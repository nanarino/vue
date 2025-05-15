<script setup lang="ts">
import { shallowReactive } from "vue"
import { Citrus, type Item } from "@/components/Citrus"
import { message } from "@/scripts/client/message"

const items = shallowReactive<Item[]>([])

function append_item() {
    items.push(
        [
            { color: "rgb(var(--red-4)", key: "red" },
            { color: "rgb(var(--orange-4)", key: "orange" },
            { color: "rgb(var(--gold-4)", key: "gold" },
            { color: "rgb(var(--yellow-4)", key: "yellow" },
            { color: "rgb(var(--lime-4)", key: "lime" },
            { color: "rgb(var(--green-4)", key: "green" },
            { color: "rgb(var(--cyan-4)", key: "cyan" },
            { color: "rgb(var(--blue-4)", key: "blue" },
            { color: "rgb(var(--purple-4)", key: "purple" },
            { color: "rgb(var(--pinkpurple-4)", key: "pinkpurple" },
            { color: "rgb(var(--magenta-4)", key: "magenta" },
        ][items.length]
    )
}

function handleItemClick(item: Item) {
    console.log(item)
    const color = item.key as string
    message({
        content: color,
        primary: "primary",
        style: {
            "--background-color-message": `var(--${color}-5)`,
            "--box-shadow-color": `var(--${color}-4)`,
        },
    })
}
</script>
<template>
    <view style="display: contents">
        <button
            class="na-button"
            @click="append_item"
            :disabled="items.length > 10"
        >
            測試添加item
        </button>
        <section>
            <Citrus :items />
        </section>
        <section>
            <Citrus :items :stroke-width="18" @item-click="handleItemClick" />
        </section>
    </view>
</template>
<style scoped>
button {
    margin-bottom: 16px;
}
section {
    width: 120px;
}
</style>
