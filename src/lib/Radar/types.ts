export type Point = [number, number]
export type Points = Point[]

export type Data<T extends Exclude<string, "class">> = Record<
    T,
    string | number
> & { class: string }

export interface Column<T extends Exclude<string, "class">> {
    key: T
    caption: string
    angle: number
}

export interface Options<T extends Exclude<string, "class">> {
    size: number
    scales: number
    axes: boolean
    captions: boolean
    captionsPosition: number
    smoothing: (points: Points) => string
    axisProps: (col: Column<T>) => { class: string } & Record<string, any>
    scaleProps: (scale: number) => { class: string } & Record<string, any>
    shapeProps: (col: Data<T>) => { class: string } & Record<string, any>
    captionProps: (col: Column<T>) => { class: string } & Record<string, any>
}

export interface ExtendedOptions<T extends Exclude<string, "class">>
    extends Options<T> {
    chartSize: number
}

export interface RadarProps<T extends string> {
    columnsData: Record<Exclude<T, "class">, string>
    data: Data<T>[]
    options?: Partial<Options<T>>
}
