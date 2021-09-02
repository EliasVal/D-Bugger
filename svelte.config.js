import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapter({}),
    paths: {
      base: '/test',
    },
    appDir: 'internal',
    ssr: false,
    vite: {
      build: {
        chunkSizeWarningLimit: 1000,
      },
      resolve: {
        alias: {
          '@ts': resolve('./src/ts'),
          '@base': resolve('/test'),
        },
      },
    },
  },
};

export default config;
