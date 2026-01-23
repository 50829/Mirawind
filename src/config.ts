import yaml from "js-yaml";

import type {
    SiteConfig,
    NavbarConfig,
    SidebarConfig,
    ProfileConfig,
    AnnouncementConfig,
    PostConfig,
    FooterConfig,
    ParticleConfig,
    MusicPlayerConfig,
    PioConfig,
    NavbarLink,
} from "./types/config";
import { LinkPreset } from "./types/config";
import rawConfig from "../twilight.config.yaml?raw";

/**
 * YAML 配置文件类型定义
 */
type ConfigFile = {
    site: SiteConfig;
    umami: {
        enabled: boolean;
        apiKey?: string;
        baseUrl: string;
        scripts?: string;
    };
    navbar: {
        links: Array<NavbarLink | LinkPreset | string>;
    };
    sidebar: SidebarConfig;
    profile: ProfileConfig;
    announcement: AnnouncementConfig;
    post: PostConfig;
    footer: FooterConfig;
    particle: ParticleConfig;
    musicPlayer: MusicPlayerConfig;
    pio: PioConfig;
};

// 从 YAML 文件加载配置
const config = yaml.load(rawConfig) as ConfigFile;

// LinkPreset 名称映射
const linkPresetNameMap: Record<string, LinkPreset> = {
    Home: LinkPreset.Home,
    Archive: LinkPreset.Archive,
    Projects: LinkPreset.Projects,
    Skills: LinkPreset.Skills,
    Timeline: LinkPreset.Timeline,
    Diary: LinkPreset.Diary,
    Albums: LinkPreset.Albums,
    Anime: LinkPreset.Anime,
    About: LinkPreset.About,
    Friends: LinkPreset.Friends,
};

// 标准化单个导航链接
const normalizeNavbarLink = (
    link: NavbarLink | LinkPreset | string,
): NavbarLink | LinkPreset => {
    if (typeof link === "string") {
        const preset = linkPresetNameMap[link];
        if (preset === undefined) {
            throw new Error(`Unknown LinkPreset: ${link}`);
        }
        return preset;
    }
    if (typeof link === "number") {
        return link;
    }
    const children = link.children?.map(normalizeNavbarLink);
    return children ? { ...link, children } : link;
};

// 标准化导航链接数组
const normalizeNavbarLinks = (links: Array<NavbarLink | LinkPreset | string>) =>
    links.map(normalizeNavbarLink);

/**
 * 
 */

// 自动检测浏览器语言
const SITE_LANG = "zh"; // 服务端渲染时默认为 'en'
// 如果需要强制使用特定语言，可以取消注释下面一行并设置语言代码
//const SITE_LANG = "zh"; // 强制使用的语言代码，'zh', 'en', 'ja' 等

// 设置网站时区
const SITE_TIMEZONE = 8; // from -12 to 12 default in UTC+8


// 站点配置
export const siteConfig: SiteConfig = {
    // 站点 URL（以斜杠结尾）
    siteURL: "https://mirawind.top/", // 请替换为你的站点 URL 并以斜杠结尾
    // 站点标题
    title: "Mirawind's Blog",
    // 站点副标题
    subtitle: "相寻梦里路，飞雨落花中",
    // 语言配置
    lang: SITE_LANG, // 自动检测的浏览器语言
    // 翻译配置
    translate: {
        // 启用翻译功能
        enable: true,
        // 翻译服务
        service: "client.edge", // 使用 Edge 浏览器
        // 显示语言选择下拉框
        showSelectTag: false, // 使用自定义按钮
        // 自动检测用户语言
        autoDiscriminate: true,
        // 翻译时忽略的 CSS 类名
        ignoreClasses: ["ignore", "banner-title", "banner-subtitle"],
        // 翻译时忽略的 HTML 标签
        ignoreTags: ["script", "style", "code", "pre"],
    },
    // 时区配置
    timeZone: SITE_TIMEZONE,
    // 字体配置
    font: {
        // 仓耳青禾字体 (适合中文，现代简约风格)
        "cangerQinghe": {
            src: "/assets/font/仓耳青禾体W03.ttf",
            family: "Canger Qinghe",
        },
    },
    // 主题色配置
    themeColor: {
        // 主题色的默认色相 (范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345)
        hue: 265,
        // 对访问者隐藏主题色选择器
        fixed: false,
    },
    // 默认主题 ("system" 跟随系统 | "light" 浅色 | "dark" 深色)
    defaultTheme: "light",
    // 壁纸配置
    wallpaper: {
        // 模式 ("banner" 横幅 | "fullscreen" 全屏 | "none" 纯色)
        mode: "banner",
        // 图片源配置 (fullscreen 和 banner 模式共享)
        src: {
            // 桌面壁纸图片 (支持单张图片或图片数组，当数组长度 > 1 时自动启用轮播)
            desktop: [
                "/assets/desktop-banner/137775938_p0.jpg",
            ],
            // 移动壁纸图片 (支持单张图片或图片数组，当数组长度 > 1 时自动启用轮播)
            mobile: [
                "/assets/desktop-banner/137775938_p0.jpg",
            ],
        },
        // 壁纸位置 ('top' | 'center' | 'bottom')
        position: "center",
        // 轮播配置 (fullscreen 和 banner 模式共享)
        carousel: {
            // 为多张图片启用轮播，否则随机显示一张图片
            enable: true,
            // 轮播间隔时间 (秒)
            interval: 3.6,
            // 启用 Ken Burns 效果
            kenBurns: true,
        },
        // Banner 模式专属配置
        banner: {
            // 横幅文本配置
            homeText: {
                // 在主页显示文本
                enable: true,
                // 主标题
                title: "Mirawind's Blog",
                // 副标题，支持单个字符串或字符串数组
                subtitle: [
                    "相寻梦里路，飞雨落花中",
                ],
                // 副标题打字机效果
                typewriter: {
                    // 启用副标题打字机效果
                    enable: true,
                    // 打字速度 (毫秒)
                    speed: 111,
                    // 删除速度 (毫秒)
                    deleteSpeed: 51,
                    // 完全显示后的暂停时间 (毫秒)
                    pauseTime: 3000,
                },
            },
            // 横幅图片来源文本
            credit: {
                // 显示横幅图片来源文本
                enable: true,
                // 要显示的来源文本
                text: "君を照らす太陽になりたい - void_0",
                // (可选) 原始艺术品或艺术家页面的 URL 链接
                url: "https://www.pixiv.net/artworks/137775938",
            },
            // 导航栏配置
            navbar: {
                // 导航栏透明模式 ("semi" 半透明加圆角 | "full" 完全透明 | "semifull" 动态透明)
                transparentMode: "semifull",
            },
            // 水波纹效果配置
            waves: {
                // 启用水波纹效果
                enable: false,
                // 启用性能模式 (简化波浪效果以提升性能)
                performanceMode: true,
            },
        },
        // Fullscreen 模式专属配置
        fullscreen: {
            // 层级
            zIndex: -1, // 确保壁纸在背景层
            // 壁纸透明度，0-1之间
            opacity: 0.9,
            // 背景模糊程度 (像素值)
            blur: 1,
            // 导航栏透明模式
            navbar: {
                transparentMode: "semi", // 使用半透明模式而不是完全透明
            },
        },
    },
    // OpenGraph 配置
    generateOgImages: false, // 注意开启图片生成后要渲染很长时间，不建议本地调试的时候开启
    // favicon 配置
    favicon: [
    ],
    // bangumi 配置
    bangumi: {
        // 用户 ID
        userId: "your-bangumi-id", // 可以设置为 "sai" 测试
    },
};

/**
 * 
 */

// 导航栏配置
export const navBarConfig: NavBarConfig = {
    // 链接配置 (支持多级菜单)
    links: [
        // LinkPreset.Home,
        {
            name: "博客",
            url: "/blog/",
            icon: "material-symbols:article",
        },
        LinkPreset.Archive,
        {
            name: "Links",
            url: "/links/",
            icon: "material-symbols:link",
            children: [
                {
                    name: "GitHub",
                    url: "https://github.com/50829",
                    external: true,
                    icon: "fa6-brands:github",
                },
                {
                    name: "Bilibili",
                    url: "https://space.bilibili.com/397174240",
                    external: true,
                    icon: "fa6-brands:bilibili",
                },
            ],
        },
        {
            name: "My",
            url: "/content/",
            icon: "material-symbols:person",
            children: [
                LinkPreset.Projects,
                LinkPreset.Skills,
                LinkPreset.Timeline,
                LinkPreset.Diary,
                LinkPreset.Albums,
                LinkPreset.Anime,
            ],
        },
        {
            name: "About",
            url: "/content/",
            icon: "material-symbols:info",
            children: [
                LinkPreset.About,
                LinkPreset.Friends,
            ],
        },
    ],
};

/**
 * 
 */

// 侧边栏布局配置
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  // 侧边栏组件配置列表
  components: [
    {
      // 组件类型
      type: "profile", // 用户资料组件
      // 是否启用该组件
      enable: true,
      // 组件所属侧边栏
      side: "left",
      // 组件显示顺序 (数字越小越靠前)
      order: 1,
      // 组件位置
      position: "top", // 固定在顶部
      // CSS 类名，用于应用样式和动画
      class: "onload-animation",
      // 动画延迟时间 (毫秒) ，用于错开动画效果
      animationDelay: 0,
    },
    {
      // 组件类型
      type: "announcement", // 公告组件
      // 是否启用该组件 (现在通过统一配置控制)
      enable: false,
      // 组件所属侧边栏
      side: "left",
      // 组件显示顺序
      order: 2,
      // 组件位置
      position: "top", // 固定在顶部
      // CSS 类名
      class: "onload-animation",
      // 动画延迟时间
      animationDelay: 50,
    },
    {
      // 组件类型
      type: "categories", // 分类组件
      // 是否启用该组件
      enable: true,
      // 组件所属侧边栏
      side: "right",
      // 组件显示顺序
      order: 3,
      // 组件位置
      position: "top", // 粘性定位，可滚动
      // CSS 类名
      class: "onload-animation",
      // 动画延迟时间
      animationDelay: 150,
      // 响应式配置
      responsive: {
        // 折叠阈值
        collapseThreshold: 5, // 当分类数量超过5个时自动折叠
      },
    },
    {
      // 组件类型
      type: "tags", // 标签组件
      // 是否启用该组件
      enable: false,
      // 组件所属侧边栏
      side: "left",
      // 组件显示顺序
      order: 4,
      // 组件位置
      position: "sticky", // 粘性定位，可滚动
      // CSS 类名
      class: "onload-animation",
      // 动画延迟时间
      animationDelay: 250,
      // 响应式配置
      responsive: {
        // 折叠阈值
        collapseThreshold: 20, // 当标签数量超过20个时自动折叠
      },
    },
    {
      // 组件类型
      type: "toc", // 目录组件
      // 是否启用该组件
      enable: true,
      // 组件所属侧边栏
      side: "left",
      // 组件显示顺序
      order: 5,
      // 组件位置
      position: "sticky", // 粘性定位，可滚动
      // CSS 类名
      class: "onload-animation",
      // 动画延迟时间
      animationDelay: 350,
    },
  ],
  // 默认动画配置
  defaultAnimation: {
    // 是否启用默认动画
    enable: true,
    // 基础延迟时间 (毫秒)
    baseDelay: 0,
    // 每个组件递增的延迟时间 (毫秒)
    increment: 50,
  },
  // 响应式布局配置
  responsive: {
    // 不同设备的布局模式 ("hidden" 不显示侧边栏 | "drawer" 抽屉模式 | "sidebar" 显示侧边栏)
    layout: {
      // 移动端
      mobile: "sidebar",
      // 平板端
      tablet: "sidebar",
      // 桌面端
      desktop: "sidebar",
    },
  },
};


// Umami统计配置
export const umamiConfig = {
    // 是否显示Umami统计
    enabled: true,
    // API密钥
    apiKey: import.meta.env.UMAMI_API_KEY,
    // UmamiCloudAPI地址
    baseUrl: "https://api.umami.is",
    // 要插入的Script
    scripts: import.meta.env.UMAMI_TRACKING_CODE,
} as const;

// 导航栏配置
export const navbarConfig: NavbarConfig = {
    links: normalizeNavbarLinks(config.navbar.links),
};

// 侧边栏配置
export const sidebarConfig: SidebarConfig = config.sidebar;

// 资料配置
export const profileConfig: ProfileConfig = {
    // 头像配置 (相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录)
    avatar: "assets/images/greenpurple_cut.jpg",
    // 信息配置
    name: "Mirawind",
    // 简介配置
    bio: "Wish to be a firefly in the night...",
    // 链接配置
    links: [
        {
            name: "",
            icon: "fa6-brands:github",
            url: "https://github.com/50829",
        },
    ],
};


// 公告配置
export const announcementConfig: AnnouncementConfig = config.announcement;

// 文章配置
export const postConfig: PostConfig = {
    // 显示“上次编辑”卡片
    showLastModified: false,
    // 在文章内容中显示封面
    showCoverInContent: true,
    // 代码高亮配置
    expressiveCode: {
        // 主题
        theme: "github-dark", // 深色背景
    },
    // 许可证配置
    license: {
        // 启用许可证
        enable: true,
        // 许可证名称
        name: "CC BY-NC-SA 4.0",
        // 许可证链接
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    },
    // 评论配置
    comment: {
        // 启用评论功能
        enable: false,
        // Twikoo 评论系统配置
        twikoo: {
            // 环境 ID
            envId: "https://twikoo.vercel.app",
            // 语言
            lang: SITE_LANG, // 默认使用站点语言
        },
    },
};

/**
 * 
 */

// 页脚配置
export const footerConfig: FooterConfig = config.footer;

// 粒子特效配置
export const particleConfig: ParticleConfig = config.particle;

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = config.musicPlayer;

// 看板娘配置
export const pioConfig: PioConfig = config.pio;