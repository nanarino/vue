<script setup lang="ts">
import Tabs from "@/lib/Tabs"
import { ref, h } from "vue"
const renderRemoveIcon = () => h("iconify-icon", { icon: "line-md:remove" })
const active = ref("夜景")
const BASE = import.meta.env.BASE_URL
</script>
<template>
    <main style="display: contents">
        <section>
            <Tabs.group
                v-model="active"
                size="lg"
                @change="console.log"
                @close="console.log"
                :renderRemoveIcon
            >
                <Tabs.panel label="夜景" class="na-image">
                    <img :src="`${BASE}images/IMG_2568.JPG`" alt="夜景" />
                </Tabs.panel>
                <Tabs.panel label="動物" class="na-image">
                    <img :src="`${BASE}images/IMG_2674.JPG`" alt="動物" />
                </Tabs.panel>
                <Tabs.panel label="人像" class="na-image" closeable>
                    <img :src="`${BASE}images/IMG_2532.JPG`" alt="人像" />
                </Tabs.panel>
            </Tabs.group>
        </section>
    </main>
</template>
<style scoped>
section {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 2rem);
    gap: 2px;
}
</style>
