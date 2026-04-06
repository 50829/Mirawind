import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import * as fs from "node:fs";
import path from "node:path";
import { defaultFavicons } from "@constants/icon";
import type { APIContext, GetStaticPaths } from "astro";
import satori from "satori";
import sharp from "sharp";
import { profileConfig, siteConfig } from "@/config";
import {
	ensureGoogleDisplaySwap,
	extractHttpFontUrl,
	isCssFontSource,
} from "@/utils/fontSource";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = "normal" | "italic";
interface FontOptions {
	data: Buffer | ArrayBuffer;
	name: string;
	weight?: Weight;
	style?: FontStyle;
	lang?: string;
}
export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
	if (!siteConfig.generateOgImages) {
		return [];
	}

	const allPosts = await getCollection("posts");
	const publishedPosts = allPosts.filter((post) => !post.data.draft);

	return publishedPosts.map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
};

let fontCache: {
	key: string;
	family: string;
	regular: Buffer | null;
	bold: Buffer | null;
} | null = null;

function resolvePublicAssetPath(src: string): string {
	return path.resolve(process.cwd(), "public", src.replace(/^\/+/, ""));
}

function readPublicAssetBuffer(src: string | undefined): Buffer | null {
	if (!src) {
		return null;
	}

	const assetPath = resolvePublicAssetPath(src);

	try {
		return fs.readFileSync(assetPath);
	} catch (err) {
		console.warn(`Failed to read public asset: ${src}`, err);
		return null;
	}
}

function pickOgFontConfig() {
	const resolved = siteConfig.resolvedFontSystem;
	if (!resolved) {
		return null;
	}

	const candidateIds = [
		...resolved.roles.heading,
		...resolved.roles.body,
		...Object.keys(resolved.fonts),
	];

	for (const fontId of candidateIds) {
		const font = resolved.fonts[fontId];
		if (font?.src && font.family) {
			return {
				key: fontId,
				family: font.family,
				src: font.src,
			};
		}
	}

	return null;
}

async function loadOgFontsFromConfig() {
	const fontConfig = pickOgFontConfig();
	if (!fontConfig) {
		return { family: "sans-serif", regular: null, bold: null };
	}

	const cacheKey = `${fontConfig.key}:${fontConfig.family}:${fontConfig.src}`;

	if (fontCache?.key === cacheKey) {
		return fontCache;
	}

	try {
		if (!isCssFontSource(fontConfig.src)) {
			const localFontPath = resolvePublicAssetPath(fontConfig.src);
			const buffer = fs.readFileSync(localFontPath);
			fontCache = {
				key: cacheKey,
				family: fontConfig.family,
				regular: buffer,
				bold: buffer,
			};
			return fontCache;
		}

		const cssUrl = ensureGoogleDisplaySwap(fontConfig.src);

		const cssResp = await fetch(cssUrl);
		if (!cssResp.ok) {
			throw new Error("Failed to fetch font css");
		}
		const cssText = await cssResp.text();

		const getUrlForWeight = (weight: number) => {
			const blockRe = new RegExp(
				`@font-face\\s*{[^}]*font-weight:\\s*${weight}[^}]*}`,
				"g",
			);
			const match = cssText.match(blockRe);
			if (!match || match.length === 0) {
				return null;
			}
			return extractHttpFontUrl(match[0]);
		};

		const regularUrl = getUrlForWeight(400) ?? getUrlForWeight(500);
		const boldUrl = getUrlForWeight(700) ?? getUrlForWeight(600) ?? regularUrl;

		if (!regularUrl || !boldUrl) {
			throw new Error("No downloadable font URL found in css");
		}

		const [rResp, bResp] = await Promise.all([
			fetch(regularUrl),
			fetch(boldUrl),
		]);
		if (!rResp.ok || !bResp.ok) {
			throw new Error("Failed to download font files");
		}

		fontCache = {
			key: cacheKey,
			family: fontConfig.family,
			regular: Buffer.from(await rResp.arrayBuffer()),
			bold: Buffer.from(await bResp.arrayBuffer()),
		};
		return fontCache;
	} catch (err) {
		console.warn("Error loading OG fonts from fontSystem:", err);
		fontCache = {
			key: cacheKey,
			family: fontConfig.family,
			regular: null,
			bold: null,
		};
		return fontCache;
	}
}

export async function GET({
	props,
}: APIContext<{ post: CollectionEntry<"posts"> }>) {
	const { post } = props;

	const {
		family: ogFontFamily,
		regular: fontRegular,
		bold: fontBold,
	} = await loadOgFontsFromConfig();

	const iconSrc = siteConfig.favicon[0]?.src ?? defaultFavicons[0].src;
	const iconBuffer = readPublicAssetBuffer(iconSrc);
	if (!iconBuffer) {
		throw new Error(`OG icon asset not found: ${iconSrc}`);
	}
	const iconBase64 = `data:image/png;base64,${iconBuffer.toString("base64")}`;

	// Avatar falls back to icon when not configured or unreadable.
	const avatarBuffer =
		readPublicAssetBuffer(profileConfig.avatar) ?? iconBuffer;
	const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString("base64")}`;

	const hue = siteConfig.themeColor.hue;
	const primaryColor = `hsl(${hue}, 90%, 65%)`;
	const textColor = "hsl(0, 0%, 95%)";

	const subtleTextColor = `hsl(${hue}, 10%, 75%)`;
	const backgroundColor = `hsl(${hue}, 15%, 12%)`;

	const pubDate = post.data.published.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const description = post.data.description;

	const template = {
		type: "div",
		props: {
			style: {
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: backgroundColor,
				fontFamily: `"${ogFontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
				padding: "60px",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							width: "100%",
							display: "flex",
							alignItems: "center",
							gap: "20px",
						},
						children: [
							{
								type: "img",
								props: {
									src: iconBase64,
									width: 48,
									height: 48,
									style: { borderRadius: "10px" },
								},
							},
							{
								type: "div",
								props: {
									style: {
										fontSize: "36px",
										fontWeight: 600,
										color: subtleTextColor,
									},
									children: siteConfig.title,
								},
							},
						],
					},
				},

				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							flexGrow: 1,
							gap: "20px",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "flex-start",
									},
									children: [
										{
											type: "div",
											props: {
												style: {
													width: "10px",
													height: "68px",
													backgroundColor: primaryColor,
													borderRadius: "6px",
													marginTop: "14px",
												},
											},
										},
										{
											type: "div",
											props: {
												style: {
													fontSize: "72px",
													fontWeight: 700,
													lineHeight: 1.2,
													color: textColor,
													marginLeft: "25px",
													display: "-webkit-box",
													overflow: "hidden",
													textOverflow: "ellipsis",
													lineClamp: 3,
													WebkitLineClamp: 3,
													WebkitBoxOrient: "vertical",
												},
												children: post.data.title,
											},
										},
									],
								},
							},
							description && {
								type: "div",
								props: {
									style: {
										fontSize: "32px",
										lineHeight: 1.5,
										color: subtleTextColor,
										paddingLeft: "35px",
										display: "-webkit-box",
										overflow: "hidden",
										textOverflow: "ellipsis",
										lineClamp: 2,
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
									},
									children: description,
								},
							},
						],
					},
				},
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "20px",
									},
									children: [
										{
											type: "img",
											props: {
												src: avatarBase64,
												width: 60,
												height: 60,
												style: { borderRadius: "50%" },
											},
										},
										{
											type: "div",
											props: {
												style: {
													fontSize: "28px",
													fontWeight: 600,
													color: textColor,
												},
												children: profileConfig.name,
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									style: { fontSize: "28px", color: subtleTextColor },
									children: pubDate,
								},
							},
						],
					},
				},
			],
		},
	};

	const fonts: FontOptions[] = [];
	if (fontRegular) {
		fonts.push({
			name: ogFontFamily,
			data: fontRegular,
			weight: 400,
			style: "normal",
		});
	}
	if (fontBold) {
		fonts.push({
			name: ogFontFamily,
			data: fontBold,
			weight: 700,
			style: "normal",
		});
	}

	const svg = await satori(template, {
		width: 1200,
		height: 630,
		fonts,
	});

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
