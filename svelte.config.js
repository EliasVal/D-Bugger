import preprocess from 'svelte-preprocess';
import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';
import multiAdapter from '@macfja/svelte-multi-adapter';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: multiAdapter([staticAdapter(), nodeAdapter()]),
    files: {
      serviceWorker: 'src/service-worker.ts',
    },
    vite: {
      build: {
        brotliSize: false,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
          },
          format: {
            comments: false,
          },
        },
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
