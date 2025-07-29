<script setup lang="ts">
import { ref } from "vue"
import { Radar, type Points } from "@/lib/Radar"
import { line, curveCardinalClosed } from "d3-shape"

const columnsData = {
    price: "Price",
    useful: "Usefulness",
    design: "Design",
    battery: "Battery Capacity",
    camera: "Camera Quality",
}

const data = [
    {
        class: "iphone",
        price: 1,
        battery: 0.7,
        design: 1,
        useful: 0.9,
        camera: 0.9,
    },
    {
        class: "galaxy",
        price: 0.8,
        battery: 1,
        design: 0.6,
        useful: 0.8,
        camera: 1,
    },
    {
        class: "nexus",
        price: 0.5,
        battery: 0.8,
        design: 0.7,
        useful: 0.6,
        camera: 0.6,
    },
]

const axes = ref(true)
const tension = ref(0.3)
const smoothing = (points: Points) => {
    return line().curve(curveCardinalClosed.tension(tension.value ?? 0))(
        points
    ) as string
}
const scales = ref(5)
</script>
<template>
    <main style="display: contents">
        <Radar
            class="my-phone"
            :columns-data
            :data
            :options="{
                scales,
                smoothing,
                axes,
                shapeProps(data) {
                    return {
                        title: data.class,
                        class: 'shape ' + data.class,
                    }
                },
            }"
        />
        <form onsubmit="return false">
            <label class="na-form-item">
                <span>axes</span>
                <div class="na-input-wrapper">
                    <span class="na-switch">
                        <input
                            type="checkbox"
                            class="na-input"
                            v-model="axes"
                            name="axes"
                        />
                        <i class="na-switch-mover"></i>
                        <span class="na-switch-slot"></span>
                    </span>
                </div>
            </label>
            <label class="na-form-item">
                <span>count</span>
                <div class="na-input-wrapper" data-validate>
                    <input
                        type="number"
                        class="na-input"
                        v-model="tension"
                        name="tension"
                        :max="1"
                        :min="0"
                        :step="0.1"
                        required
                    />
                </div>
            </label>
            <label class="na-form-item">
                <span>scales</span>
                <div class="na-input-wrapper" data-validate>
                    <input
                        type="number"
                        class="na-input"
                        v-model="scales"
                        name="scales"
                        :max="15"
                        :min="0"
                        required
                    />
                </div>
            </label>
        </form>
    </main>
</template>
<style scoped>
:deep(.my-phone) {
    .axis {
        stroke: rgb(var(--gray-6));
        stroke-width: 0.2;
    }

    .scale {
        stroke: rgb(var(--gray-4));
        stroke-width: 0.2;
    }

    .shape {
        fill-opacity: 0.3;
        stroke-width: 0.5;
    }

    .shape:hover {
        fill-opacity: 0.6;
    }

    .shape.iphone {
        fill: rgb(var(--cyan-4));
        stroke: rgb(var(--cyan-6));
    }

    .shape.nexus {
        fill: rgb(var(--yellow-4));
        stroke: rgb(var(--yellow-6));
    }

    .shape.galaxy {
        fill: rgb(var(--pinkpurple-4));
        stroke: rgb(var(--pinkpurple-6));
    }
}

form {
    margin: 2em;
}
</style>
