import { spawn } from "child_process"

/** 执行命令 */
const run = (command: string) => {
  const shell = process.platform === "win32" ? "cmd" : "sh"
  const shellFlag = process.platform === "win32" ? "/c" : "-c"
  const child = spawn(shell, [shellFlag, command], {
    env: {
      ...process.env,
      NODE_ENV: "development"
    },
    stdio: ["ignore", "pipe", "pipe"]
  })

  child.on("error", console.error)

  child.stdout.on("data", (chunk) => {
    const lines = chunk.toString().split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length === 0) continue
      process.stdout.write(`\x1b[0m ${lines[i]}\n`)
    }
  })

  // child.stderr.on("data", (chunk) => {
  //   const lines = chunk.toString().split(/\r?\n/)
  //   for (let i = 0; i < lines.length; i++) {
  //     if (lines[i].length === 0) continue
  //     process.stdout.write(`\x1b[0m ${lines[i]}\n\n`)
  //   }
  // })

  child.on("exit", (code, signal) => {
    const what = signal ? `signal ${signal}` : `exit ${code}`
    process.stdout.write(`\x1b[35m[${what}]\x1b[0m \n`)
  })

  return child
}

const processVite = run("npm run dev:vite")
const processElectron = run("npm run dev:electron")

/** 关闭所有进程 */
const shutdown = () => {
  try {
    processVite.kill()
    processElectron.kill()
  } catch (e) {
    console.log(e)
  }
}

// 捕获父进程信号
process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
process.on("SIGHUP", shutdown)
// 捕获未知错误
process.on("uncaughtException", shutdown)
