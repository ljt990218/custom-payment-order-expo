# 项目概览

- 当前仓库是一个基于 Expo Router 的 React Native + TypeScript 项目，入口为 `expo-router/entry`。
- 主要业务在 `app/(tabs)/index.tsx`：填写账单配置并跳转到 `app/details.tsx` 预览详情页；`app/(tabs)/explore.tsx` 是简单展示页。
- 全局初始化在 `app/_layout.tsx`，会引入 `global.css`、注册路由栈，并在渲染前通过 `hooks/use-fonts.ts` 加载自定义字体。
- 仓库已提交原生目录 `android/` 和 `ios/`，改动 Expo 配置时要留意 JS 层与原生工程是否需要同步验证。

# 项目结构

- `app/`: Expo Router 路由目录，包含根布局、tabs、详情页和模态页。
- `components/`: 通用组件与 `components/ui/` 下的基础 UI 封装。
- `hooks/`: 主题、字体等自定义 hooks。
- `assets/`: 字体、图标、图片资源；自定义字体位于 `assets/fonts/`，头像与条码相关资源主要在 `assets/icons/` 和 `assets/images/`。
- `constants/`: 主题常量。
- `types/`: 类型补充声明。
- `scripts/reset-project.js`: Expo 模板自带重置脚本，会移动或删除现有 `app`、`components`、`hooks`、`constants`、`scripts` 目录后重建空白 `app/`，除非明确要重置模板，否则不要运行。

# 构建和运行命令

- 安装依赖: `yarn install`
- 启动开发服务: `yarn start`
  实际执行 `expo start --go`，默认走 Expo Go 模式；仓库里没有固定端口配置。
- 启动 Android: `yarn android`
- 启动 iOS: `yarn ios`
- 启动 Web: `yarn web`
- 代码检查: `yarn lint`
- 模板重置: `yarn reset-project`
  该命令有破坏性，只适合把项目重置成空白 Expo Router 模板时使用。
- Web 输出模式在 `app.json` 中配置为 `static`。
- `eas.json` 已定义 `development`、`preview`、`production` 三个 build profile，但仓库没有封装对应的 package script。
- `README.md` 仍是默认 Expo 模板，里面的 `npm install` / `npx expo start` 说明与当前仓库的 `yarn` 工作流不完全一致；以 `package.json` 和锁文件为准。

# 代码规范

- 使用 TypeScript 严格模式，配置见 `tsconfig.json`。
- 路径别名已启用：`@/*` 指向仓库根目录。
- 路由采用 Expo Router 文件路由；新增页面时优先按 `app/` 下的文件结构组织，而不是手写集中式路由表。
- 样式体系基于 NativeWind：
  `babel.config.js` 启用了 `nativewind/babel`，`metro.config.js` 通过 `withNativeWind` 接入 `global.css`，`tailwind.config.js` 扫描 `app/` 和 `components/`。
- 当前页面代码以函数组件 + Hooks 为主，业务页面里普遍使用单引号、无分号风格；配置文件多为 CommonJS + 分号写法。修改时优先跟随所在文件现有风格，不要为了“统一”做无关格式化。
- 样式写法以 `className` 为主，只有在 React Native 需要精确数值或对象样式时再补 `style`。
- 自定义字体已经在 `app.json` 与 `hooks/use-fonts.ts` 中登记；新增字体或改字体名时，这两处要同步。
- ESLint 使用 `eslint-config-expo/flat`，当前仅额外忽略 `dist/*`。提交前至少跑一次 `yarn lint`。

# Git Workflow

- 最近提交使用明显的 Conventional Commits 前缀：`fix:`、`feat:`、`refactor:`，标题可中英混写。
- 仓库内未发现 `.github/workflows/`、`.husky/`、`commitlint`、`lint-staged` 等自动化约束；默认依赖开发者手动自检。
- 提交时保持改动聚焦，避免顺手重排无关文件；如果工作区里已有他人的未提交改动，不要覆盖或回退。

# 测试方式

- 当前仓库没有 `test` script，也没有 `tests/` 目录，未发现 Jest、Vitest、Playwright、Cypress 等测试配置。
- 现阶段以手动验证为主：
  1. 运行 `yarn start`、`yarn android` 或 `yarn ios` 检查页面是否能正常进入。
  2. 在首页表单修改字段，确认 `AsyncStorage` 持久化生效。
  3. 跳转 `app/details.tsx`，检查字体、图标、条形码 URL 和参数透传是否正常。
  4. 如改动 `app.json`、字体、图标或 NativeWind 配置，至少在一个真实平台端再验证一次。
