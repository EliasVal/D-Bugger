<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  export let projectName;
  export let projectId;
</script>

<div
  class="projectCard border rounded-md border-gray-900 border-dotted w-48 h-28 p-2 flex flex-col justify-between hover:cursor-pointer"
  on:click={() => goto(`${base}/project/${projectId}`)}
>
  <h1>{projectName}</h1>
  <p class="text-gray-500 self-end font-mono text-xs">
    {projectId ? `ID: ${projectId}` : ''}
  </p>
</div>
