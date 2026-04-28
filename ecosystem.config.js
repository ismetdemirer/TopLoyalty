module.exports = {
  apps: [
    {
      name: 'toployalty',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: '/Users/raspy/raspy-prod/TopLoyalty',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
    },
  ],
}
