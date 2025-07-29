<script setup lang="ts">
import { ref } from "vue"
import { Donut, type Item } from "@/lib/Donut"
import { message } from "@/scripts/client/message"

const strokeWidth = ref(60)
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
        <section>
            <Donut :items="[]" :stroke-width />
        </section>
        <section>
            <Donut
                :items="[{ color: '', key: 1, proportion: 100 }]"
                :stroke-width
            />
        </section>
        <section style="width: 200px">
            <Donut
                :items="[
                    { color: 'rgb(var(--blue-4)', key: 'blue', proportion: 33 },
                    {
                        color: 'rgb(var(--cyan-4)',
                        key: 'cyan',
                        proportion: 67,
                        title: 'cyan 67%',
                    },
                ]"
                :stroke-width
                @item-click="handleItemClick"
            />
        </section>
        <form onsubmit="return false">
            <label class="na-form-item">
                <span>stroke-width</span>
                <div class="na-input-wrapper" data-validate>
                    <input
                        type="number"
                        class="na-input"
                        v-model="strokeWidth"
                        name="stroke-width"
                        :max="99"
                        :min="9"
                        required
                    />
                </div>
            </label>
        </form>
    </main>
</template>
<style scoped>
section {
    width: 99px;
}
form {
    margin: 2em;
}
</style>
