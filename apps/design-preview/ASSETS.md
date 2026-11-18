# 素材与字体来源

## 光启控制台

两张机械主视觉于 2026-11-18 使用内置 ImageGen 生成，转换为本地 WebP。反应堆上的刻度、启动光效和指针视差由界面实时绘制。模块总览从同一张横向图集中取出三个模块视图。

- [反应堆主视觉](public/assets/ignition-reactor.webp)
- [三个全息模块的图集](public/assets/module-holograms.webp)

<details><summary>生成提示词</summary>

**反应堆**

Square 1024x1024. Premium photoreal cinematic 3D industrial product visualization, a single enormous intricate circular electromagnetic ignition reactor cartridge floating centrally in a black studio void. Nearly frontal view but with a subtle angle so the right edge and underside have unmistakable 3D mechanical depth. Sharply defined machined titanium concentric rings, silver beveled segments, dark gunmetal rotating shutter, chunky precision fasteners, dark copper coils, electric ice cyan emitter and blue-white inner annular lights, one minimal amber reflection. Distinct layers of real metal casting, weight and thickness, premium high contrast product photography. Core design centered at 50%/50%, fits inside central 76% of square, all edges and corners fade to pure pitch black. No floor, surroundings, typography, text, HUD labels, border, logos, watermarks, people or superhero. A sophisticated and believable sci-fi engineering artifact.

**模块图集**

Create ONE ultra-wide 3:1 landscape product-render sprite sheet for a high-end sci-fi cockpit module selector. EXACT layout: three independent isolated objects in three equal square cells, no drawn cell borders. Each on an identical thin circular gunmetal instrument pedestal with a single glowing ice-cyan ring, in the center of its own cell, scaled to the same size with generous black margins. Left at x=1/6: an elegant 3D polished titanium clothes hanger floating above the pedestal, layered thin cyan holographic echoes behind it. Center at x=1/2: a smooth adult head and shoulders holographic bust viewed three-quarter angle, rendered in luminous cyan contour scan lines and transparent smoked glass above its pedestal. Right at x=5/6: a single short tailored jacket on an invisible torso, silver and cyan precision wireframe technical garment with warm amber seam highlights above its pedestal. Realistic cinematic CAD visualization, beautiful machining, strong volumetric studio depth, elegant small details, three large clean legible silhouettes. The entire background is solid pitch black #000000 with absolutely no wall, floor or horizon, no grid, no text, no icons, no letters, no watermarks, no UI or frame. Each isolated pedestal/object strictly fits inside the central 78% of its own square for use as an application asset atlas. 3072 x 1024.

</details>

## 摄影与字体

下载日期：2026-10-30。全部页面素材存放本地，不在运行时热链第三方图片，不使用 AI 图像生成接口。

| 文件 | 来源 / 作者 | 权利与处理 |
| --- | --- | --- |
| public/assets/jacket.webp | [Tobias Tullius / Fg15LdqpWrs](https://unsplash.com/photos/Fg15LdqpWrs) | Unsplash License；原图 CDN photo-1591047139829-d91aecb6caea；800px WebP |
| public/assets/wardrobe.webp | [Marcus Loke / xXJ6utyoSw0](https://unsplash.com/photos/xXJ6utyoSw0) | Unsplash License；原图 CDN photo-1532453288672-3a27e9be9efd；1200px WebP |
| public/assets/portrait.webp | [Dom Hill / nimElTcTNyY](https://unsplash.com/photos/woman-in-yellow-tracksuit-standing-on-basketball-court-side-nimElTcTNyY) | Unsplash License；原图 CDN photo-1515886657613-9f3515b0c78f；720px WebP |
| Hero 建筑 / 基座 / 陈列材质 | 本次探索原创 CSS | 不使用外部建筑图片；不依赖 WebGL 或 3D 模型 |
| 线性图标 / favicon | 本次探索原创 SVG | 同一笔画体系，非第三方图标拼贴 |
| Inter Variable | @fontsource-variable/inter；[Inter](https://rsms.me/inter/) | SIL Open Font License，副本 public/licenses/inter-OFL.txt |
| Geist Variable | @fontsource-variable/geist；[Geist](https://vercel.com/font) | SIL Open Font License，副本 public/licenses/geist-OFL.txt |

下载链接来自 Unsplash 官方搜索页/照片页的下载资源。图像仅调整传输尺寸与编码；页面业务参考照片不加滤镜、不调色、不去背景。Hero/模块媒体有明确 CSS 裁切，人物舞台使用 contain 保留全身。

[Unsplash License](https://unsplash.com/license) 允许下载和使用素材。此处为独立的私有/本地设计评审样张，公开照片不代表真实 MyLife 用户或品牌代言人，不构成真实用户数据。未来正式发布时应再次评审具体素材、人物使用场景和所需授权；本轮不把探索素材直接批准为正式产品资产。
