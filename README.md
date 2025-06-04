# na-vue

[![pnpm v9](https://img.shields.io/badge/maintained%20with-pnpm%209.0-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![nodejs v20](https://img.shields.io/badge/Node.js-v20.17.0-026e00.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)

一个 [nanarinostyl](https://nanarino.github.io/stylus/) 主題的 [vue3](https://vuejs.org/) 元件合集

## 開發

```bash
pnpm i
pnpm dev
```

## 利用

先要自订構建出 nanarinostyl ( `nanarinostyl/dist/style.min.css` ) 放置在自己專案的 `assets` 或 `public` 目錄中，用任意方式引入

```astro
<html lang="en-HK">
    <head>
        <link rel="stylesheet" href="/nanarinostyl.min.css" />
    </head>
    <body>
        <slot />
    </body>
</html>
```

若使用 css in js 方式引入，有些打包器（如 vite）在構建后纔會將其置於 `<head />` 中，開發環境出現 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) 問題是正常的，但是初始化明暗的脚本不應該使用 `import` 引入

```ts
import "nanarinostyl"
```

再拷貝本倉庫元件源代碼來進行使用
