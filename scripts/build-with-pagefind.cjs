/* This is a script to build the site with Pagefind */

const { execSync } = require("node:child_process");
const { existsSync } = require("node:fs");

// Detect the platform
function detectPlatform() {
	// Check environment variables
	if (process.env.VERCEL) {
		return "vercel";
	}
	if (process.env.CF_PAGES) {
		return "cloudflare";
	}
	if (process.env.NETLIFY) {
		return "netlify";
	}
	if (process.env.GITHUB_ACTIONS) {
		return "github";
	}

	// Check if specific directories exist
	if (existsSync(".vercel")) {
		return "vercel";
	}

	// Default to standard dist directory
	return "default";
}

// Get Pagefind output directory
function getPagefindOutputDir(platform) {
	const outputDirs = {
		vercel: ".vercel/output/static",
		cloudflare: "dist",
		netlify: "dist",
		github: "dist",
		default: "dist",
	};

	return outputDirs[platform] || "dist";
}

// Main function
function main() {
	const platform = detectPlatform();
	const outputDir = getPagefindOutputDir(platform);

	console.log(`🚀 Detected deployment platform: ${platform}`);
	console.log(`📁 Pagefind output directory: ${outputDir}`);

	try {
		// Run Astro build
		console.log("🔨 Running Astro build...");
		execSync("npx astro build".trim(), {
			stdio: "inherit",
			cwd: process.cwd(), // Ensure in the correct directory
		});

		// Check if output directory exists
		if (!existsSync(outputDir)) {
			console.error(`❌ Output directory does not exist: ${outputDir}`);
			process.exit(1);
		}

		// Run Pagefind
		console.log("🔍 Running Pagefind search index generation...");
		execSync(`npx pagefind --site ${outputDir}`, {
			stdio: "inherit",
			cwd: process.cwd(), // Ensure in the correct directory
		});

		console.log("✅ Build completed!");
		console.log(`📊 Search index generated at: ${outputDir}/pagefind/`);
	} catch (error) {
		console.error("❌ Build failed:", error.message);
		process.exit(1);
	}
}

main();
