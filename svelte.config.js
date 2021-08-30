import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: node({ out: './build', precompress: true }),
    ssr: false,
    vite: {
      build: {
        chunkSizeWarningLimit: 1000,
      },
    },
  },
};

export default config;
