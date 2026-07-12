import os
import re

def resolve_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<<<<<<< HEAD' not in content:
        return False
        
    # Regex to match the conflict block
    # (?s) makes . match newlines
    # We want to replace the whole block with just the 'theirs' part
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> [a-f0-9]+(\n|$)', re.DOTALL)
    
    new_content = pattern.sub(r'\2\n', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css')):
            path = os.path.join(root, file)
            if resolve_file(path):
                print(f"Resolved conflicts in {path}")

