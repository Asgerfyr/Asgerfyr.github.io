export const CodeBlock = {
  render(props: Record<string, unknown>): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'bg-gray-800 text-white rounded-lg p-3 text-sm mb-4 overflow-x-auto';
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    const lang = props.language as string | undefined;
    if (lang) code.className = `language-${lang}`;
    code.textContent = (props.code as string) ?? '';
    pre.appendChild(code);
    wrapper.appendChild(pre);
    return wrapper;
  },
};
