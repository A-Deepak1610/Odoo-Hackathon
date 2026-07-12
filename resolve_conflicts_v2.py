import os
import re

def resolve_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<<<<<<< HEAD' not in content:
        return False
        
    # Split the file by lines to handle multiple conflicts accurately without regex DOTALL greediness issues
    lines = content.split('\n')
    new_lines = []
    
    in_head = False
    in_theirs = False
    
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_head = True
            continue
        elif line.startswith('======='):
            if in_head:
                in_head = False
                in_theirs = True
                continue
        elif line.startswith('>>>>>>> '):
            if in_theirs:
                in_theirs = False
                continue
                
        if in_head:
            # We skip the HEAD block
            pass
        elif in_theirs:
            # We keep the 'theirs' block
            new_lines.append(line)
        else:
            # Normal code
            new_lines.append(line)
            
    new_content = '\n'.join(new_lines)
    
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

