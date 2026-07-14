with open("src/App.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if i >= 200 and i < 1100:
        if "return dict" in line or "};" in line and "localizeDynamicText" in lines[i-5:i+5]:
            print(f"Line {i+1}: {line.strip()}")
        if "return" in line and ("dict[" in line or "dict" in line) and i < 1500:
            print(f"Line {i+1}: {line.strip()}")
