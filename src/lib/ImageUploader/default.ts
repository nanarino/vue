import { REVOKED, type Image, type LocalInputFileImage } from "."

export async function defaultCreateUrl(raw: File | LocalInputFileImage) {
    if (raw instanceof Blob) {
        /* 
            一種不需要銷毀的方法 性能稍弱 尤其對大檔案
            return new Promise<Image>((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(i)
                reader.onload = () => {
                    Reflect.set(i, "url", reader.result)
                    resolve(i as File & Image)
                }
            reader.onerror = reject
        })*/
        const url = URL.createObjectURL(raw) // 其實這裏 raw: File & LocalInputFileImage
        Reflect.set(raw, "url", url)
        Reflect.set(raw, REVOKED, false)
        return raw as LocalInputFileImage & File
    } else {
        return raw
    }
}

export function defaultRevokeUrl(img: Image | LocalInputFileImage) {
    if (REVOKED in img) {
        if (img[REVOKED] === false) {
            URL.revokeObjectURL(img.url)
            img[REVOKED] = true
        }
    }
}
