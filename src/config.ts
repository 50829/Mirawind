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
    FontRole,
    FontRoleMap,
    ResolvedFontRoleMap,
    ResolvedFontSystem,
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

const FONT_ROLES: FontRole[] = [
    "body",
    "context",
    "heading",
    "title",
    "subtitle",
    "ui",
    "code",
    "caption",
    "blockquote",
];

const DEFAULT_FONT_FALLBACK = {
    sans: [
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Open Sans",
        "Helvetica Neue",
        "sans-serif",
    ],
    serif: [
        "ui-serif",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times",
        "serif",
    ],
    mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
    ],
};

function normalizeRoleAssignment(value: string | string[] | undefined): string[] {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function resolveRoleMap(
    map: FontRoleMap | undefined,
    availableFontIds: Set<string>,
    primaryFontId: string,
): ResolvedFontRoleMap {
    const resolved = {} as ResolvedFontRoleMap;

    for (const role of FONT_ROLES) {
        const normalized = normalizeRoleAssignment(map?.[role]).filter((fontId) =>
            availableFontIds.has(fontId),
        );

        if (normalized.length > 0) {
            resolved[role] = normalized;
            continue;
        }

        // code 角色允许为空，交给 monospace fallback
        if (role === "code") {
            resolved[role] = [];
            continue;
        }

        resolved[role] = [primaryFontId];
    }

    return resolved;
}

function resolveFontSystem(site: SiteConfig): ResolvedFontSystem {
    const fonts = site.fontSystem.fonts;
    const fontIds = Object.keys(fonts);

    if (fontIds.length === 0) {
        throw new Error("site.fontSystem.fonts must define at least one font.");
    }

    const availableFontIds = new Set(fontIds);
    const primaryFontId = fontIds[0];

    const fallback = {
        sans: site.fontSystem.fallback?.sans?.length
            ? site.fontSystem.fallback.sans
            : DEFAULT_FONT_FALLBACK.sans,
        serif: site.fontSystem.fallback?.serif?.length
            ? site.fontSystem.fallback.serif
            : DEFAULT_FONT_FALLBACK.serif,
        mono: site.fontSystem.fallback?.mono?.length
            ? site.fontSystem.fallback.mono
            : DEFAULT_FONT_FALLBACK.mono,
    };

    const roles = resolveRoleMap(site.fontSystem.roles, availableFontIds, primaryFontId);
    const languageRoles = Object.fromEntries(
        Object.entries(site.fontSystem.languageRoles ?? {}).map(([lang, roleMap]) => [
            lang,
            resolveRoleMap(
                {
                    ...roles,
                    ...roleMap,
                },
                availableFontIds,
                primaryFontId,
            ),
        ]),
    );

    return {
        fonts,
        roles,
        languageRoles,
        fallback,
    };
}

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

siteConfig.resolvedFontSystem = resolveFontSystem(siteConfig);

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
    avatar: config.profile.avatar
        ? (config.profile.avatar.startsWith("/") ? config.profile.avatar : `/${config.profile.avatar}`)
        : undefined,
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
