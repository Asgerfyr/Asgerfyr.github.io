export const CodeBlock = {
  render(props: Record<string, unknown> = {}): string {
    const lang = props.language as string | undefined;
    const langClass = lang ? `language-${lang}` : '';
    const code = (props.code as string) ?? '';

    return `
      <div class="bg-gray-800 text-white rounded-lg p-3 text-sm mb-4 overflow-x-auto">
        <pre><code class="${langClass}">${code}</code></pre>
      </div>
    `;
  },
};
