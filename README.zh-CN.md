<div align="center">

# 🧮 Calculator Ultra

### 现代网络上最强大的科学计算器

[![在线演示](https://img.shields.io/badge/演示-在线-brightgreen?style=for-the-badge)](https://calculator-ultra.pages.dev)
[![测试](https://img.shields.io/badge/测试-386%20通过-success?style=for-the-badge)](https://github.com)
[![许可证](https://img.shields.io/badge/许可证-MIT-blue?style=for-the-badge)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-就绪-blueviolet?style=for-the-badge)](https://calculator-ultra.pages.dev)

[🇺🇸 English](README.md) | [🇨🇳 中文](README.zh-CN.md) | [🇻🇳 Tiếng Việt](README.vi.md)

<img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
<img src="https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white" alt="Vite" />

</div>

---

## ✨ 功能特点

### 🔢 计算器模式

| 模式 | 描述 |
|------|------|
| **基础** | 标准算术运算，带记忆功能 |
| **科学** | 三角函数、对数、指数、阶乘等 |
| **高级** | 微积分（导数、积分、极限）、矩阵、向量、复数 |
| **图形** | 绘制数学函数，支持交互式缩放和平移 |
| **统计** | 统计分析、回归、概率分布 |
| **编程** | 二进制、八进制、十六进制转换，位运算 |
| **金融** | 复利、贷款摊销、货币时间价值计算 |
| **单位换算** | 10+类别中100+种单位之间的转换 |
| **方程求解** | 求解一元一次、二次和多项式方程 |

### 🎨 主题与自定义

- **6种精美主题**：浅色、深色、AMOLED黑、Solarized、高对比度、复古
- **响应式设计**：完美适配桌面、平板和手机
- **横屏优化**：专为横向屏幕设计的特殊布局

### ⚡ 性能与无障碍

- **PWA支持**：可安装为原生应用，支持离线使用
- **键盘快捷键**：完整的键盘导航支持
- **ARIA标签**：对屏幕阅读器友好
- **触觉反馈**：移动设备上的振动反馈
- **滑动手势**：通过触摸手势切换模式

### 📊 高级数学功能

- **导数**：符号和数值求导
- **积分**：定积分和不定积分
- **极限**：单侧和双侧极限
- **泰勒级数**：将函数展开为幂级数
- **矩阵运算**：行列式、逆矩阵、特征值
- **向量运算**：点积、叉积、模长
- **复数**：完整的复数运算支持

---

## 🚀 快速开始

### 在线体验

**👉 [在线演示](https://calculator-ultra.pages.dev)**

### 安装为PWA

1. 在Chrome/Edge/Safari中访问网站
2. 点击"安装"或"添加到主屏幕"
3. 享受离线访问！

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/yourusername/calculator-ultra.git
cd calculator-ultra

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
```

---

## ⌨️ 键盘快捷键

| 按键 | 操作 |
|------|------|
| `0-9` | 输入数字 |
| `+ - * / ^` | 运算符 |
| `Enter` / `=` | 计算 |
| `Backspace` | 删除 |
| `Escape` | 清除 |
| `s` / `c` / `t` | sin / cos / tan |
| `l` / `n` / `r` | log / ln / sqrt |
| `p` / `e` | π / e |
| `Ctrl+D` | 切换 DEG/RAD |
| `Ctrl+M` | 存入记忆 |
| `Ctrl+R` | 读取记忆 |

---

## 🏗️ 技术栈

- **前端**：React 18 + TypeScript
- **样式**：TailwindCSS 3.4
- **数学引擎**：Math.js 12.4
- **构建工具**：Vite 5.1
- **测试**：Vitest 4.0
- **PWA**：Vite PWA插件
- **托管**：Cloudflare Pages

---

## 📁 项目结构

```
calculator-ultra/
├── src/
│   ├── components/     # React组件
│   │   ├── Calculator/ # 主计算器
│   │   ├── Keypad/     # 按键面板
│   │   ├── Display/    # 表达式显示
│   │   └── ...         # 其他UI组件
│   ├── contexts/       # React上下文
│   ├── hooks/          # 自定义Hooks
│   ├── utils/          # 工具函数
│   │   ├── mathOperations.ts
│   │   ├── derivatives.ts
│   │   ├── integrals.ts
│   │   └── ...
│   └── types/          # TypeScript类型
├── public/             # 静态资源
└── scripts/            # 构建脚本
```

---

## 🧪 测试

```bash
# 运行所有测试
npm test

# 监视模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

**测试统计：**
- ✅ 386个测试通过
- ✅ 21个测试套件
- ✅ utils和hooks完整覆盖

---

## 🚀 部署

### 部署到Cloudflare Pages

```bash
# 完整部署（含测试）
npm run deploy

# 快速部署
npm run pages:deploy
```

---

## 🤝 贡献

欢迎贡献！请随时提交Pull Request。

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加惊艳的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起Pull Request

---

## 📄 许可证

本项目采用MIT许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- [Math.js](https://mathjs.org/) - 强大的数学库
- [Lucide React](https://lucide.dev/) - 精美图标
- [Headless UI](https://headlessui.com/) - 无障碍UI组件
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的CSS

---

<div align="center">

**为数学家、学生和专业人士倾心打造 ❤️**

[⬆ 返回顶部](#-calculator-ultra)

</div>
