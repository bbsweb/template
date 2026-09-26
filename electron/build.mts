import { readdirSync, unlinkSync } from "fs"
import { join } from "path"
import { fileURLToPath } from "url"
import { packager } from "@electron/packager"

const dir = fileURLToPath(new URL(".", import.meta.url))

packager({
  asar: true,
  icon: join(
    dir,
    "public",
    process.platform === "win32" ? "icon.ico" : "icon.png"
  ),
  dir,
  platform: "win32",
  arch: "x64",
  ignore: (filePath) => {
    if (filePath === "") return false // 不忽略根目录
    if (filePath === "/package.json") return false // 不忽略 package.json
    if (filePath.startsWith("/dist")) return false // 不忽略 dist 及其中所有文件
    return true // 忽略所有其它文件/目录
  },
  out: join(dir, "dist", "app"),
  overwrite: true
}).then((paths) => {
  const [path] = paths
  unlinkSync(join(path, "LICENSE"))
  unlinkSync(join(path, "LICENSES.chromium.html"))
  unlinkSync(join(path, "version"))

  const entries = readdirSync(join(path, "locales"))
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry !== "en-US.pak") unlinkSync(join(path, "locales", entry))
  }
})
