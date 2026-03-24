#!/usr/bin/env node

/**
 * Quick Start Script
 * Run this to verify project structure and dependencies
 */

import * as fs from "fs";
import * as path from "path";

const requiredFiles = [
  // Pages
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/blog/[slug]/not-found.tsx",

  // Components
  "src/components/ui/button.tsx",
  "src/components/ui/card.tsx",
  "src/components/ui/badge.tsx",
  "src/components/ui/skeleton.tsx",
  "src/components/navigation.tsx",

  // Library
  "src/lib/types.ts",
  "src/lib/contentful.ts",
  "src/lib/utils.ts",

  // Config
  ".env.local.example",
  "tsconfig.json",
  "next.config.ts",
  "tailwind.config.js",
  "eslint.config.mjs",
  "package.json",

  // Documentation
  "README.md",
  "DEPLOYMENT.md",
  "CONTRIBUTING.md",
  "CHECKLIST.md",
];

const missingFiles: string[] = [];

console.log("📋 Project Structure Verification\n");
console.log("Checking required files...\n");

requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
    missingFiles.push(file);
  }
});

console.log("\n" + "=".repeat(50));

if (missingFiles.length === 0) {
  console.log("✨ All required files present!\n");
  console.log("Next steps:");
  console.log("1. npm install");
  console.log("2. cp .env.local.example .env.local");
  console.log("3. Fill in CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN");
  console.log("4. npm run dev");
  console.log("5. Visit http://localhost:3000");
} else {
  console.log(`\n⚠️  Missing ${missingFiles.length} file(s):`);
  missingFiles.forEach((file) => console.log(`   - ${file}`));
}

console.log("\n" + "=".repeat(50));
console.log("📚 Documentation Files:");
console.log("   - README.md: Full setup guide");
console.log("   - DEPLOYMENT.md: Vercel deployment steps");
console.log("   - CONTRIBUTING.md: Development guidelines");
console.log("   - CHECKLIST.md: Complete feature checklist");
