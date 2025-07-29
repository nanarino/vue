/**
 * 翻譯自:
 * https://github.com/derhuerst/svg-radar-chart/blob/master/index.js
 */
import { h, type VNode } from "vue"
import type {
    Point,
    Points,
    Data,
    Column,
    Options,
    ExtendedOptions,
} from "./types"

// 坐标转换函数保持不变
const polarToX = (angle: number, distance: number): number =>
    Math.cos(angle - Math.PI / 2) * distance

const polarToY = (angle: number, distance: number): number =>
    Math.sin(angle - Math.PI / 2) * distance

// 点坐标转换为字串
const points = (points: Points): string => {
    return points
        .map(point => `${point[0].toFixed(4)},${point[1].toFixed(4)}`)
        .join(" ")
}

// 无平滑效果的路径生成
const noSmoothing = (points: Points): string => {
    if (points.length === 0) return ""

    let d = `M${points[0][0].toFixed(4)},${points[0][1].toFixed(4)}`
    for (let i = 1; i < points.length; i++) {
        d += `L${points[i][0].toFixed(4)},${points[i][1].toFixed(4)}`
    }
    return d + "z"
}

// 生成轴线元素
const axis =
    <T extends Exclude<string, "class">>(opt: ExtendedOptions<T>) =>
    (col: Column<T>): VNode => {
        return h("polyline", {
            ...opt.axisProps(col),
            points: points([
                [0, 0],
                [
                    polarToX(col.angle, opt.chartSize / 2),
                    polarToY(col.angle, opt.chartSize / 2),
                ],
            ]),
        })
    }

// 生成数据形状元素
const shape =
    <T extends Exclude<string, "class">>(
        columns: Column<T>[],
        opt: ExtendedOptions<T>
    ) =>
    (data: Data<T>, i: number): VNode => {
        const shapePoints = columns.map(col => {
            if (col.key === "class") {
                return [0, 0] as Point
            }

            const val = data[col.key]

            if (typeof val !== "number") {
                throw new Error(`Data set ${i} is invalid.`)
            }

            return [
                polarToX(col.angle, (val * opt.chartSize) / 2),
                polarToY(col.angle, (val * opt.chartSize) / 2),
            ] as Point
        })

        const shapeProps = opt.shapeProps(data)

        return h(
            "path",
            {
                ...shapeProps,
                d: opt.smoothing(shapePoints),
            },
            shapeProps.title && h("title", shapeProps.title)
        )
    }

// 生成刻度元素
const scale = <T extends Exclude<string, "class">>(
    opt: ExtendedOptions<T>,
    value: number
): VNode => {
    return h("circle", {
        ...opt.scaleProps(value),
        cx: 0,
        cy: 0,
        r: (value * opt.chartSize) / 2,
    })
}

// 生成标题元素
const caption =
    <T extends Exclude<string, "class">>(opt: ExtendedOptions<T>) =>
    (col: Column<T>): VNode => {
        const props = opt.captionProps(col)
        return h(
            "text",
            {
                fill: "currentColor",
                ...props,
                x: polarToX(col.angle, (opt.size / 2) * 0.95).toFixed(4),
                y: polarToY(col.angle, (opt.size / 2) * 0.95).toFixed(4),
                dy: (parseInt(props["font-size"] + "") || 2) / 2,
            },
            col.caption
        )
    }

// 默认配置
const defaults: Options<string> = {
    size: 100,
    axes: true,
    scales: 3,
    captions: true,
    captionsPosition: 1.2,
    smoothing: noSmoothing,
    axisProps: () => ({ class: "axis" }),
    scaleProps: () => ({ class: "scale", fill: "none" }),
    shapeProps: () => ({ class: "shape" }),
    captionProps: () => ({
        class: "caption",
        ["text-anchor"]: "middle",
        ["font-size"]: 3,
        ["font-family"]: "sans-serif",
    }),
}

// 主渲染函数
export const renderRadarChart = <T extends string>(
    // 从data的key里剔除class
    columnsData: Record<Exclude<T, "class">, string>,
    data: Data<T>[],
    opt: Partial<Options<T>> = {}
): VNode => {
    if (typeof columnsData !== "object" || Array.isArray(columnsData)) {
        throw new Error("columns must be an object")
    }
    if (!Array.isArray(data)) {
        throw new Error("data must be an array")
    }
    if (
        data.some(item =>
            Object.keys(item).some(key => {
                const typedKey = key as keyof Data<T>
                return (
                    typedKey !== "class" && typeof item[typedKey] !== "number"
                )
            })
        )
    ) {
        throw new Error("data must contain set of numbers")
    }

    const options: ExtendedOptions<T> = {
        ...(defaults as Options<T>),
        ...opt,
        chartSize: 0,
    }
    options.chartSize = options.size / options.captionsPosition

    const columns: Column<T>[] = Object.keys(columnsData).map(
        (key, i, all) => ({
            key: key as T,
            caption: columnsData[key as Exclude<T, "class">],
            angle: (Math.PI * 2 * i) / all.length,
        })
    )

    const groups: VNode[] = [h("g", data.map(shape(columns, options)))]

    if (options.captions) {
        groups.push(h("g", columns.map(caption(options))))
    }

    if (options.axes) {
        groups.unshift(h("g", columns.map(axis(options))))
    }

    if (options.scales > 0) {
        const scales: VNode[] = []
        for (let i = options.scales; i > 0; i--) {
            scales.push(scale(options, i / options.scales))
        }
        groups.unshift(h("g", scales))
    }

    const delta = (options.size / 2).toFixed(4)
    return h(
        "g",
        {
            transform: `translate(${delta},${delta})`,
        },
        groups
    )
}

export const radar = renderRadarChart
