module.exports = {
  apps: [
    {
      name: "prod-server",
      script: "index.js",
      instances: 2,
      exec_mode: "cluster",
    }
  ]
} 
