module.exports = {
  apps: [
    {
      name: "client",
      cwd: "./client",
      script: "npm",
      args: "start",
      ignore_watch: ['.']
    },
    {
      name: "server",
      cwd: "./",
      script: "npm",
      args: "start",
      ignore_watch: [
        "client",
        "client/*",
        "client/**/*"
      ]
    }
  ]
}
