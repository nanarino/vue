export interface page {
    path: string
}
export interface menu extends page {
    children: page[]
}
