import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapter(),
    files: {
      serviceWorker: 'src/service-worker.ts',
    },
    vite: {
      build: {
        brotliSize: false,
      },
      resolve: {
        alias: {
          '@ts': resolve('./src/ts'),
        },
      },
    },
  },
};

export default config;
