import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const child = spawn(
  process.execPath,
  [
    resolve(root, 'node_modules/wrangler/bin/wrangler.js'),
    'dev',
    '--config',
    'dist/server/wrangler.json',
    ...process.argv.slice(2),
  ],
  {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      WRANGLER_WRITE_LOGS: 'false',
      WRANGLER_LOG_PATH: resolve(root, '.wrangler/logs'),
      MINIFLARE_REGISTRY_PATH: resolve(root, '.wrangler/registry'),
      WRANGLER_REGISTRY_PATH: resolve(root, '.wrangler/registry'),
      WRANGLER_SEND_METRICS: 'false',
      ...(process.env.CODEX_SANDBOX ? { CHOKIDAR_USEPOLLING: 'true' } : {}),
    },
  },
);
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => child.kill(signal));
