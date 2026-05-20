#!/usr/bin/env python3
import re


def fix_mdx_codeblocks(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match code blocks with language specification
    pattern = r'```(\w+)\n(.*?)```'

    def replace_codeblock(match):
        language = match.group(1)
        code = match.group(2)

        # Only convert typescript and json code blocks that contain braces
        if language in ['typescript', 'javascript', 'json', 'python'] and ('{' in code or '}' in code):
            return f'<div className="bg-zinc-900 p-4 rounded-lg my-4 overflow-x-auto">\n<pre className="text-zinc-100 text-sm leading-relaxed">{`{code}`}</pre>\n</div>'
        else:
            return match.group(0)

    # Replace all matching code blocks
    fixed_content = re.sub(pattern, replace_codeblock,
                           content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)

    print(f"Fixed {file_path}")


if __name__ == '__main__':
    fix_mdx_codeblocks(
        'd:\\MyCode\\my-blog\\content\\blog\\agent-architecture.mdx')
