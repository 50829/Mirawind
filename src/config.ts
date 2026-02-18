import yaml from "js-yaml";

import type {
    SiteConfig,
    NavbarLink,
    NavbarConfig,
    SidebarConfig,
    ProfileConfig,
    AnnouncementConfig,
    PostConfig,
    FooterConfig,
    ParticleConfig,
    MusicPlayerConfig,
    PioConfig,
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
    Resources: LinkPreset.Resources,
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
 * 站点配置 - 从 YAML 加载
 */
export const siteConfig: SiteConfig = {
    ...config.site,
    // 转换字体配置格式
    font: Object.values(config.site.font).map((f: any) => ({
        src: f.src,
        family: f.family,
    })),
    // 时区从 YAML 获取（如果未设置则默认 UTC+8）
    timeZone: config.site.timeZone ?? 8,
    // 翻译配置从 YAML 获取（如果未设置则使用默认值）
    translate: config.site.translate ?? {
        enable: true,
        service: "client.edge",
        showSelectTag: false,
        autoDiscriminate: true,
        ignoreClasses: ["ignore", "banner-title", "banner-subtitle"],
        ignoreTags: ["script", "style", "code", "pre"],
    },
};

/**
 * 导航栏配置 - 从 YAML 加载
 */
export const navbarConfig: NavbarConfig = {
    links: normalizeNavbarLinks(config.navbar.links),
};

/**
 * 侧边栏配置 - 从 YAML 加载
 */
export const sidebarConfig: SidebarConfig = config.sidebar;

/**
 * Umami 统计配置 - 从 YAML 加载
 */
export const umamiConfig = {
    enabled: config.umami?.enabled ?? false,
    apiKey: import.meta.env.UMAMI_API_KEY,
    baseUrl: config.umami?.baseUrl ?? "https://api.umami.is",
    scripts: import.meta.env.UMAMI_TRACKING_CODE,
} as const;

/**
 * 个人资料配置 - 从 YAML 加载
 */
export const profileConfig: ProfileConfig = {
    ...config.profile,
    // 确保头像路径以 / 开头
    avatar: config.profile.avatar.startsWith('/') ? config.profile.avatar : `/${config.profile.avatar}`,
};

/**
 * 公告配置 - 从 YAML 加载
 */
export const announcementConfig: AnnouncementConfig = config.announcement;

/**
 * 文章配置 - 从 YAML 加载
 */
export const postConfig: PostConfig = config.post;

/**
 * 页脚配置 - 从 YAML 加载
 */
export const footerConfig: FooterConfig = config.footer;

/**
 * 粒子特效配置 - 从 YAML 加载
 */
export const particleConfig: ParticleConfig = config.particle;

/**
 * 音乐播放器配置 - 从 YAML 加载
 */
export const musicPlayerConfig: MusicPlayerConfig = config.musicPlayer;

/**
 * 看板娘配置 - 从 YAML 加载
 */
export const pioConfig: PioConfig = config.pio;
