module.exports = {
    apps: [
        {
            name: "client",
            cwd: "./client",
            script: "npm",
            args: "start",
        },
        {
            name: "server",
            cwd: "./",
            script: "npm",
            args: "start",
        }
    ]
}