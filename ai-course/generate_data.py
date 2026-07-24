#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate data.js by reading module JSON files from the data/ directory.
Each module is stored as module1.json through module6.json.
"""

import json
import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')
OUTPUT_PATH = os.path.join(SCRIPT_DIR, 'js', 'data.js')


def main():
    modules = []
    for i in range(1, 7):
        path = os.path.join(DATA_DIR, f'module{i}.json')
        print(f"Loading {path}...", file=sys.stderr)
        with open(path, 'r', encoding='utf-8') as f:
            module = json.load(f)
        ep_count = len(module['episodes'])
        print(f"  Module {module['id']} ({module['title']}): {ep_count} episodes", file=sys.stderr)
        modules.append(module)

    data = {"modules": modules}

    total_episodes = sum(len(m['episodes']) for m in modules)
    print(f"Total: {total_episodes} episodes", file=sys.stderr)

    js_output = "const COURSE_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";"

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(js_output)

    print(f"\nSuccessfully wrote {OUTPUT_PATH}", file=sys.stderr)
    print(f"File size: {len(js_output)} characters", file=sys.stderr)
    print("DONE")


if __name__ == '__main__':
    main()
