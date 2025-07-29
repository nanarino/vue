<script setup lang="ts" generic="T extends string">
import { computed } from "vue";
import { radar, type Options, type Data } from "."

const props = withDefaults(
    defineProps<{
        columnsData: Record<Exclude<T, 'class'>, string>
        data: Data<T>[]
        options?: Partial<Options<T>>
    }>(),
    {
        options: () => ({})
    }
)

const defaultOptions: Partial<Options<T>> = {
    shapeProps: data => ({ class: "shape " + data.class }),
}

const mergedOptions = computed(() => {
    const options: Partial<Options<T>> = {
        ...props.options
    }

    for (const key of Object.keys(defaultOptions)) {
        const val = Reflect.get(options, key)
        const defaultVal = Reflect.get(defaultOptions, key)

        if (!val && defaultVal) {
            Reflect.set(options, key, defaultVal)
            continue
        }

        if (typeof val === 'function' && typeof defaultVal === 'function') {
            Reflect.set(
                options,
                key,
                (...args: unknown[]) => {
                    const defaultRecords = defaultVal.call(options, ...args)
                    const optionRecords = val.call(options, ...args)
                    return [defaultOptions, optionRecords]
                        .filter(records => typeof records === 'object')
                        .reduce((prev, acc) => {
                            return {
                                ...prev,
                                ...acc
                            }
                        }, {})
                }
            )
        }
    }

    return options
})

console.log(mergedOptions.value)

// TODO 改成由props傳遞
const chart = computed(() => radar(
    props.columnsData,
    props.data,
    mergedOptions.value
))
</script>

<template>
    <svg version="1" xmlns="http://www.w3.org/2000/svg" width="480" height="400" viewBox="-12 0 120 100">
        <component :is="chart" />
    </svg>
</template>
