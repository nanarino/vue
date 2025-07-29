<script setup lang="ts">
import { computed, ref } from "vue"
import { Citrus, type Item } from "@/lib/Citrus"
import { message } from "@/scripts/client/message"

const count = ref(0)
const strokeWidth = ref(18)
const items = computed(() =>
    [
        { color: "rgb(var(--red-4)", key: "red" },
        { color: "rgb(var(--orange-4)", key: "orange", title: "orange" },
        { color: "rgb(var(--gold-4)", key: "gold" },
        { color: "rgb(var(--yellow-4)", key: "yellow" },
        { color: "rgb(var(--lime-4)", key: "lime" },
        { color: "rgb(var(--green-4)", key: "green" },
        { color: "rgb(var(--cyan-4)", key: "cyan" },
        { color: "rgb(var(--blue-4)", key: "blue" },
        { color: "rgb(var(--purple-4)", key: "purple" },
        { color: "rgb(var(--pinkpurple-4)", key: "pinkpurple" },
        { color: "rgb(var(--magenta-4)", key: "magenta" },
    ].slice(0, count.value)
)

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
    <main style="display: contents">
        <section style="width: 200px">
            <Citrus :items :stroke-width @item-click="handleItemClick" />
        </section>
        <form onsubmit="return false">
            <label class="na-form-item">
                <span>count</span>
                <div class="na-input-wrapper" data-validate>
                    <input
                        type="number"
                        class="na-input"
                        v-model="count"
                        name="count"
                        :max="11"
                        :min="0"
                        required
                    />
                </div>
            </label>
            <label class="na-form-item">
                <span>stroke-width</span>
                <div class="na-input-wrapper" data-validate>
                    <input
                        type="number"
                        class="na-input"
                        v-model="strokeWidth"
                        name="stroke-width"
                        :max="27"
                        :min="0"
                        required
                    />
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
