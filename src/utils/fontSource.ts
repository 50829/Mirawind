function stripQueryAndHash(src: string): string {
    const queryIndex = src.indexOf("?");
    const hashIndex = src.indexOf("#");
    const cutIndex = [queryIndex, hashIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0];
    return cutIndex === undefined ? src : src.slice(0, cutIndex);
}

export function isCssFontSource(src: string): boolean {
    const normalized = src.trim().toLowerCase();
    const cleanPath = stripQueryAndHash(normalized);

    if (cleanPath.endsWith(".css")) {
        return true;
    }

    return (
        normalized.includes("fonts.googleapis.com") ||
        normalized.includes("fonts.gstatic.com") ||
        normalized.includes("unpkg.com")
    );
}

export function ensureGoogleDisplaySwap(src: string): string {
    if (!src.includes("fonts.googleapis.com")) {
        return src;
    }

    if (/[?&]display=/.test(src)) {
        return src;
    }

    return `${src}${src.includes("?") ? "&" : "?"}display=swap`;
}

export function extractHttpFontUrl(fontFaceBlock: string): string | null {
    const matches = [...fontFaceBlock.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/g)];

    for (const match of matches) {
        const url = match[2];
        if (/^https?:\/\//i.test(url)) {
            return url;
        }
    }

    return null;
}
