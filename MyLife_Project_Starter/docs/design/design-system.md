# MyLife Design System v1.0

## 色彩 Token
基础色：
- Canvas `#F5F3EF`：暖白页面背景
- Surface `#FFFFFF`：主要内容面板
- Graphite `#171A20`：深色主区域
- Text Primary `#20232A`
- Text Secondary `#737782`
- Border `#E7E4DE`

强调色：Champagne `#C4A779`、Silver `#AEB7C2`、Olive `#78836E`、Terracotta `#B87964`。
香槟金用于少量品牌点缀；其他强调色按模块语义使用。深色区域需有独立文字、边框和交互状态 Token。保证文字对比度。

## 字体
- 英文：Geist 或 Inter。
- 中文：Noto Sans SC / 思源黑体。
- 数字：Geist / Inter。
- 装饰性衬线字体仅少量用于品牌展示，不用于密集正文。

桌面字号参考：Hero 56–72px；页面标题 32–40px；区块标题 22–28px；卡片标题 16–20px；正文 14–16px；辅助文字 12–13px。移动端单独定义字号与行高。

## 间距
采用 4px 基础单位：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80px。页面使用一致的内容最大宽度；复杂工作台明确主操作区、辅助面板和内容区。

## 圆角
小控件 8–10px；输入框/按钮 10–12px；普通卡片 14–18px；大型视觉面板 20–28px。胶囊仅用于标签或特定操作。

## 阴影与层级
L0 页面背景；L1 普通卡片；L2 浮动卡片、菜单、弹窗；L3 主视觉悬浮对象。阴影方向与模糊风格一致，不要所有组件使用重阴影。

## Mixed Theme
- Home：深色 Hero + 浅色内容区。
- Wardrobe：暖白/浅色为主，突出服装图片。
- Avatar Studio：中性背景，确保人物颜色准确。
- Outfit Studio：可采用深色摄影棚式画布，控制面板保持高可读性。
- 全站导航、按钮、输入框、状态反馈保持一致。

## 组件状态
交互组件定义 default、hover、focus-visible、active、disabled、loading、error（适用时）。表单有清晰标签、校验提示和提交反馈。
