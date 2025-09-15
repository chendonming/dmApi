# 整体项目规划文档

## 技术选择

- 项目脚手架: electron-vite。我们将使用它来快速搭建一个集成了 Electron, Vite, React 和 TypeScript 的现代化开发环境。
- 前端框架: React。这是我们构建用户界面的核心。
- UI 组件库: Material-UI (MUI)。我们将采用 Material Design 风格，利用 MUI 丰富、高质量的组件来构建应用的界面。
- 状态管理: Zustand。我们将使用这个轻量、现代的方案来管理整个应用的全局状态。它的简洁性和高性能将帮助我们快速迭代。
- 本地数据库: SQLite。通过在 Electron 主进程中使用 better-sqlite3 库，为应用提供强大、可靠的本地数据持久化能力。
- 后端日志系统：electron-log

## 前端架构

采取功能优先的组织方式，以下是目录结构：

```
src/renderer/
├── @types/                # 全局或共享的 TypeScript 类型定义 (e.g., a.d.ts)
├── assets/                # 静态资源 (图片, 字体, SVG)
├── components/            # 1. 全局通用、与业务无关的UI组件
│   ├── Editor/            # Monaco Editor 的封装
│   ├── KeyValueEditor/    # 键值对编辑器
│   └── ...
├── features/              # 2. 按业务功能划分的模块 (核心目录)
│   ├── collection/        # 对应“集合管理”功能
│   │   ├── components/    # 此功能独有的组件 (e.g., CollectionTree)
│   │   ├── hooks/         # 此功能独有的 Hooks
│   │   └── index.tsx      # 功能模块的入口/容器组件
│   ├── request/           # 对应“请求/响应”功能
│   │   ├── components/    # (e.g., RequestPanel, ResponsePanel)
│   │   └── ...
│   └── environment/       # 对应“环境管理”功能
│       └── ...
├── hooks/                 # 3. 全局通用的自定义 Hooks
│   ├── useIpcRequest.ts   # 封装 IPC 通信
│   ├── useDebounce.ts     # 防抖 Hook
│   └── ...
├── lib/                   # 第三方库的配置或纯工具函数
│   ├── logger.ts          # 日志配置
│   └── utils.ts           # 通用工具函数 (e.g., formatBytes)
├── pages/                 # 4. 页面级组件/应用主布局
│   └── MainLayout.tsx     # 应用主布局 (包含侧边栏和主工作区)
├── store/                 # 5. Zustand 全局状态管理
│   ├── environmentStore.ts
│   ├── tabsStore.ts
│   └── index.ts           # 组合并导出所有 stores
├── styles/                # 全局样式和主题配置
│   └── theme.ts           # MUI 主题配置文件
├── App.tsx                # 应用根组件
└── main.tsx               # 应用入口文件
```

### 组件分类

我们遵循组件组合和单一职责的原则，将组件分为两类：

- 功能/特性组件 (Feature Components):
  - 位置: src/features/\*/
  - 职责: 负责一个完整业务功能的实现。它们是“聪明的”，通常会处理数据获取、状态管理和复杂的业务逻辑。
    示例: features/collection/index.tsx 负责从后端获取集合数据，管理树状视图的展开/折叠状态，并处理用户的点击、删除等操作。

- 通用/UI组件 (Common/UI Components):
  - 位置: src/components/
  - 职责: 负责纯粹的 UI 展示。它们是“愚蠢的”，不包含业务逻辑，所有数据和行为都通过 props 传入。它们具有高度的可复用性。
  - 示例: components/KeyValueEditor 组件，它不知道自己被用于编辑 Headers 还是 Query Params，只负责渲染键值对并返回用户的输入。

数据流: 始终遵循 自顶向下 的单向数据流。Feature 组件获取数据后，通过 props 传递给 Common 组件。Common 组件通过回调函数将用户交互通知给 Feature 组件。

### 状态管理策略 (State Management Strategy)

根据状态的作用域，我们采用分层策略：

| 状态类型          | 描述                                         | 使用工具                     | 示例                                                                               |
| :---------------- | :------------------------------------------- | :--------------------------- | :--------------------------------------------------------------------------------- |
| **全局应用状态**  | 跨多个功能模块共享，影响整个应用行为的状态。 | **Zustand (主 Store)**       | 当前激活的环境ID (`activeEnvironmentId`)、应用主题 (亮/暗模式)、打开的标签页列表。 |
| **功能/领域状态** | 某个复杂功能模块内部共享的状态。             | **Zustand (Slice模式)**      | 整个 Collection 的树状数据、某个复杂表单的全部状态。                               |
| **本地组件状态**  | 仅限单个组件或其少数子组件使用的状态。       | **`useState`, `useReducer`** | 输入框的值、开关是否打开、一个组件内部的加载状态。                                 |

**原则**: **状态就近原则**。能用本地状态解决的，就绝不提升到全局状态，避免不必要的复杂性和性能开销。

### 数据流与后端通信 (Data Flow & Backend Communication)\*\*

前端（渲染进程）与后端（主进程）的通信**唯一**途径是 **IPC (Inter-Process Communication)**，并由 Preload 脚本作为安全的桥梁。

为了简化和规范化这个流程，我们采用自定义 Hook 来封装所有 IPC 调用。

**通信流程图**:

```
[React Component] ---> [useIpcRequest Hook] ---> [window.electronAPI (Preload)] ---> [IPC Channel] ---> [Main Process Handler]
       ^                                                                                                      |
       |                                                                                                      | (Returns Promise)
       +------------------------------------- (Update UI with data/loading/error state) <----------------------+
```

- **`useIpcRequest` Hook**: 这个 Hook 将负责处理 IPC 调用的生命周期，包括 `loading`, `error`, `data` 等状态。组件只需调用这个 Hook 即可，无需关心底层的 IPC 实现细节。
- **类型安全**: 主进程、Preload 脚本和渲染进程之间共享类型定义，确保所有 IPC 通信都是类型安全的。

### 自定义Hooks (Custom Hooks)\*\*

自定义 Hooks 是我们封装和复用逻辑的主要手段。除了 `useIpcRequest`，我们还将创建：

- `useActiveTab`: 方便地获取和更新当前激活标签页的数据。
- `useDebounce`: 用于处理输入防抖，如自动保存功能。
- `useKeyPress`: 用于添加全局快捷键。
- `useAppSettings`: 用于读写持久化的用户偏好设置。

### 样式方案 (Styling Strategy)\*\*

我们完全拥抱 MUI 提供的样式方案，以保持风格统一和开发高效。

- **`sx` Prop**: 用于快速实现一次性的、小范围的样式定制。它提供了对主题的直接访问，非常便捷。
  ```jsx
  <Box sx={{ p: 2, border: '1px dashed grey' }}>...</Box>
  ```
- **`styled()` 工具**: 用于创建可复用的、带有复杂样式的自定义组件。当一个样式逻辑需要在多处使用时，应该将其封装成一个 `styled` 组件。
  ```jsx
  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main
  }))
  ```
- **主题定制**: 所有颜色、字体、间距等设计规范都将在 `styles/theme.ts` 文件中统一配置，确保整个应用视觉上的一致性。
