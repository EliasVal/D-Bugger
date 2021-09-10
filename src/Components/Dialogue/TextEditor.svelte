<script lang="ts">
  import {
    faBold,
    faCode,
    faEye,
    faFileCode,
    faItalic,
    faKeyboard,
    faLink,
  } from '@fortawesome/free-solid-svg-icons';

  import { CloseLoading, DisplayLoading } from '@ts/utils';

  import 'highlight.js/styles/atom-one-dark.css';

  import type { DialogueField } from 'src/global';

  import { onMount } from 'svelte';

  export let field: DialogueField;

  let hljs;
  let sanitizeHtml;
  let converter;
  let icon;

  export let styling = null;
  let text;

  let elm: HTMLTextAreaElement;
  let selectedText: string;
  let showingEditor = true;
  let wrapCodeBlocks = false;
  let finishedLoading = false;

  onMount(async () => {
    text = field?.initialValue ?? '';

    DisplayLoading();
    hljs = (await import('highlight.js/lib/common')).default;
    sanitizeHtml = await import('sanitize-html/index');
    converter = new (await import('showdown')).Converter();
    icon = (await import('@fortawesome/fontawesome-svg-core')).icon;
    finishedLoading = true;
    CloseLoading();
  });

  const styles = {
    bold: '**',
    italic: '_',
    code: '`',
    codeBlock: '```',
    link: '[Text](link)',
  };
  function StyleText(style) {
    // Get selection positions. if both are equal, no text is selected
    var startPos = elm.selectionStart;
    var endPos = elm.selectionEnd;

    let resultText;
    switch (style) {
      case 'bold':
      case 'italic':
      case 'code':
        // If no text was selected
        if (startPos == endPos) {
          // Check if There's any text in the textarea, if yes, add the styling to it
          if (text) {
            if (startPos != 0) {
              resultText = `${text.substring(0, startPos)}${styles[style]}${style}${
                styles[style]
              }${text.substring(startPos)}`;
            } else {
              resultText = `${text}${styles[style]}${style}${styles[style]}`;
            }
          } else {
            // If not, just put the styling there.
            resultText = `${styles[style]}${style}${styles[style]}`;
          }
        } else {
          // If some text was selected
          selectedText = `${styles[style]}${text.substring(startPos, endPos)}${styles[style]}`;
          resultText = text.substring(0, startPos) + selectedText + text.substring(endPos);
        }
        break;
      case 'codeBlock':
        // Check if There's any text in the textarea, if yes, add the styling to it
        if (text) {
          if (startPos != 0) {
            resultText = `${text.substring(0, startPos)}\n${styles[style]}\n${style}\n${
              styles[style]
            }\n${text.substring(startPos)}`;
          } else {
            resultText = `${text}\n${styles[style]}\n${style}\n${styles[style]}\n`;
          }
        } else {
          // If not, just put the styling there.
          resultText = `${styles[style]}\n${style}\n${styles[style]}\n`;
        }
        break;
      case 'link':
        // Check if There's any text in the textarea, if yes, add the styling to it
        if (text) {
          if (startPos != 0) {
            resultText = `${text.substring(0, startPos)}${styles[style]}${text.substring(
              startPos,
            )}`;
          } else {
            resultText = `${text}${styles[style]}`;
          }
        } else {
          // If not, just put the styling there.
          resultText = `${styles[style]}`;
        }
        break;
    }

    text = resultText;
    elm.focus();
  }
  const highlightCode = (code) => {
    if (code == undefined) return '';
    // iterate through each codeblock
    code = code.replace(/<pre><code>.*<\/code><\/pre>/gms, (match) => {
      // Remove pre and code tags from string
      match = match.replace(/(<pre><code>)|(<\/code><\/pre>)/gms, '');
      // Unescape HTML Entities
      match = new DOMParser().parseFromString(match, 'text/html').documentElement.textContent;
      // Add pre and code tags back, along with wrapping / scrolling
      let highlighted = `<pre style="${
        wrapCodeBlocks ? 'overflow-x: scroll' : 'white-space: pre-wrap'
      }"><code>${hljs.highlightAuto(match).value}</pre></code>`;

      return highlighted;
    });

    // Sanitize HTML.
    // ! READ THE README.MD
    code = sanitizeHtml(code, {
      allowedTags: ['pre', 'span', 'code', 'a', 'i', 'b', 'strong', 'em', 'p'],
      allowedAttributes: {
        pre: ['style'],
        a: ['href'],
        span: ['class'],
      },
    });
    return code;
  };
</script>

<!--
	All the buttons have type="button" because they submit the form when clicked for some reason.
	man html is weird.
	https://stackoverflow.com/questions/6617212/add-regular-button-inside-form-that-does-not-perform-a-submit
-->
{#if finishedLoading}
  <div class="w-full flex bg-gray-300 py-1 rounded-t-md">
    <button type="button" class="flex-grow" on:click={() => (showingEditor = true)}>
      {@html icon(faKeyboard).html} Editor
    </button>
    <span class="border-r border-gray-700" />
    <button type="button" class="flex-grow" on:click={() => (showingEditor = false)}>
      {@html icon(faEye).html} Preview
    </button>
  </div>
  <div class:block={showingEditor} class:hidden={!showingEditor}>
    <div class="editorToolbar w-full bg-gray-400 flex justify-start py-0.5">
      <button type="button" class="flex-1" title="Bold" on:click={() => StyleText('bold')}>
        {@html icon(faBold).html}
      </button>
      <button type="button" class="flex-1" title="Italic" on:click={() => StyleText('italic')}>
        {@html icon(faItalic).html}
      </button>
      <button type="button" class="flex-1" title="Code" on:click={() => StyleText('code')}>
        {@html icon(faCode).html}
      </button>
      <button
        type="button"
        class="flex-1"
        title="Code Block"
        on:click={() => StyleText('codeBlock')}
      >
        {@html icon(faFileCode).html}
      </button>
      <button type="button" class="flex-1" title="Link" on:click={() => StyleText('link')}>
        {@html icon(faLink).html}
      </button>
    </div>
    <textarea
      class={(styling ? styling : ' outline-none border border-black rounded-sm') +
        ' w-full resize-none p-1 h-80'}
      bind:value={text}
      bind:this={elm}
    />
  </div>
  {#if !showingEditor}
    <div class="preview bg-gray-400 rounded-b-md">
      <div class="overflow-y-auto">
        <p>
          <span>
            <label for="">Disable Code-Block wrapping</label>
            <input type="checkbox" name="" id="" bind:checked={wrapCodeBlocks} />
          </span>
          <br />
          {#key wrapCodeBlocks}
            {@html highlightCode(converter.makeHtml(text))}
          {/key}
        </p>
      </div>
    </div>
  {/if}
{/if}

<style global>
  .editorToolbar button:nth-child(even) {
    border-left: 1px solid black;
    border-right: 1px solid black;
  }

  .preview p a,
  .preview p a:visited {
    text-decoration: underline !important;
    color: #1d4ed8 !important;
  }

  .preview p pre {
    margin: 0.125rem 0;
    background-color: #111827;
    padding: 0.375rem;
    color: white;
    border-radius: 0.125rem;
  }

  .preview code {
    background-color: #111827;
    color: white;
    border-radius: 0.125rem;
  }

  .preview {
    max-height: 50vh;
    padding: 0.375rem;
  }

  .preview *:not(pre) {
    max-height: 49vh;
  }

  .preview div > p {
    min-height: 10vh;
  }

  .preview div > p > p {
    margin-top: 0.15rem;
  }
</style>
