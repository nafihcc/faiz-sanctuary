import fs from "fs";
import path from "path";
import git from "isomorphic-git";

const dir = process.cwd();

function getAllFiles(currentDir, baseDir = currentDir) {
  const ignore = new Set([
    ".git",
    "node_modules",
    "dist",
    "dist-gh",
    "dist-ssr",
    ".output",
    ".vinxi",
    ".tanstack",
    ".nitro",
    ".wrangler",
    ".gradle",
    "build",
    ".idea",
    "deploy_new_repo.js",
    "commit_changes.js",
  ]);

  let results = [];
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignore.has(entry.name)) continue;
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      results.push(relPath);
    }
  }
  return results;
}

async function main() {
  console.log("1. Staging files...");
  const filesToAdd = getAllFiles(dir);
  console.log(`Found ${filesToAdd.length} files to track.`);
  for (const file of filesToAdd) {
    await git.add({ fs, dir, filepath: file });
  }

  console.log("2. Committing files...");
  const commitSha = await git.commit({
    fs,
    dir,
    message: "feat: professional Executive Studio redesign, native Android APK setup, Pray First Khushūʿ shield & Adhan alerts, unlimited install button",
    author: {
      name: "Mohammed Nafih C C",
      email: "nafihcc@users.noreply.github.com",
    },
  });
  console.log(`✓ Committed successfully with SHA: ${commitSha}`);
}

main().catch((err) => {
  console.error("❌ Commit error:", err);
  process.exit(1);
});
