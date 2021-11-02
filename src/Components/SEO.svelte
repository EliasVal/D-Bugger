<script>
  export let title = 'D-Bugger';
  export let description =
    'Keep track of bugs while keeping costs to a low. Made for teams small and big, lone developers, etc.';
  export let url = 'https://dbugger.me';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://dbugger.me/resources/images/banner.png" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={url} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content="https://dbugger.me/resources/images/banner.png" />
</svelte:head>
