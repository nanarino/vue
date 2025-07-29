<script setup lang="ts">
import { Radar } from "@/components/Radar"

const columnsData = {
    price: "Price",
    useful: "Usefulness",
    design: "Design",
    battery: "Battery Capacity",
    camera: "Camera Quality",
}

const data = [
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
]

</script>
<template>
    <view style="display: contents">
        <Radar class="my-phone" :columns-data="columnsData" :data="data" :options="{
            shapeProps(data) {
                // 测试案例，覆盖内部的class
                return {
                    class: 'shape ' + data.class
                }
            },
        }" />
    </view>
</template>
<style scoped>
:deep(.my-phone) {
    .axis {
        stroke: #555;
        stroke-width: 0.2;
    }

    .scale {
        fill: #f0f0f0;
        stroke: #999;
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
        fill: #edc951;
        stroke: #edc951;
    }

    .shape.nexus {
        fill: #cc333f;
        stroke: #cc333f;
    }

    .shape.galaxy {
        fill: #00a0b0;
        stroke: #00a0b0;
    }
}
</style>
