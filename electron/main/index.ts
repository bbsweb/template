import { access, readFile, writeFile } from "fs/promises"
import { join } from "path"
import { app, ipcMain, BrowserWindow, Menu, Tray } from "electron"
import type { Config } from "./type"

/** 是否最小化到托盘 */
let hide = true
/** 托盘 */
let tray: Tray | null = null

/** 初始化 */
const init = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js")
    }
  })

  /** 应用菜单 */
  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu)

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173") // Vite 开发服务器
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, "index.html"))
  }

  // 当最小化时改为隐藏到托盘
  win.on("minimize", () => {
    win.hide()
  })

  // 当用户按窗口关闭按钮时（通常希望隐藏而不是退出）
  win.on("close", (e) => {
    // 如果不是程序真正要退出（例如菜单里点 Quit），就隐藏窗口
    if (hide) {
      e.preventDefault()
      win.hide()
    }
  })

  const trayIcon = join(
    __dirname,
    process.platform === "win32" ? "icon.ico" : "icon.png"
  )

  tray = new Tray(trayIcon)

  /** 托盘菜单 */
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "显示",
      click: () => {
        win.show()
        win.focus()
      }
    },
    {
      label: "退出",
      click: () => {
        hide = false
        tray?.destroy()
        app.quit()
      }
    }
  ])
  tray.setContextMenu(trayMenu)

  // 单击：切换显示 / 隐藏
  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
      win.focus()
    }
  })
}

app.whenReady().then(init)

// 退出之前销毁托盘
app.on("before-quit", () => {
  hide = false
  if (tray) {
    tray.destroy()
    tray = null
  }
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) init()
})

/** 应用目录 */
const appPath = app.getAppPath()
/** 配置文件路径 */
const configPath = join(appPath, "config.json")
/** 默认配置 */
const defaultConfig: Config = {}

// 获取配置
ipcMain.handle("getConfig", () =>
  access(configPath)
    .then(() => readFile(configPath, "utf8"))
    .then((str) => JSON.parse(str))
    .catch(() => defaultConfig)
)

// 保存配置
ipcMain.handle("saveConfig", (_, config) =>
  writeFile(configPath, JSON.stringify(config), "utf8").catch((e) =>
    console.log(e)
  )
)
