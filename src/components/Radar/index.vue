<script setup lang="ts">
import { radar, type Options } from "."

const props = defineProps({
    
})
// TODO 改成由props傳遞
const chart = radar(
    {
        price: "Price",
        useful: "Usefulness",
        design: "Design",
        battery: "Battery Capacity",
        camera: "Camera Quality",
    },
    [
        // data
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
    ],
    {
        shapeProps: data => ({ class: "shape " + data.class }),
    }
)
</script>

<template>
    <svg
        version="1"
        xmlns="http://www.w3.org/2000/svg"
        width="480"
        height="400"
        viewBox="-12 0 120 100"
        style="border: 1px solid red"
    >
        <component :is="chart" />
    </svg>
</template>
