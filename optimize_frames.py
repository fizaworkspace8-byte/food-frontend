import os
from PIL import Image

# --- CONFIGURATION ---
INPUT_FOLDER = r'C:\Users\SOFTEC PC\Desktop\3D Animated Cafe\fast-food-blog\frontend\public\burger-frames'
OUTPUT_FOLDER = r'C:\Users\SOFTEC PC\Desktop\3D Animated Cafe\fast-food-blog\frontend\public\burger-frames-optimized'
QUALITY = 60 # Balanced quality for WebP

def process_burger_frames():
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    files = [f for f in os.listdir(INPUT_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    print(f"Found {len(files)} frames. Starting conversion...")

    for filename in files:
        with Image.open(os.path.join(INPUT_FOLDER, filename)) as img:
            # Maintain the exact filename but change extension to .webp
            name_without_ext = os.path.splitext(filename)[0]
            img.save(os.path.join(OUTPUT_FOLDER, f"{name_without_ext}.webp"), "WEBP", quality=QUALITY)
    
    print(f"Done! Now rename '{OUTPUT_FOLDER}' to 'burger-frames' in your public folder.")

if __name__ == "__main__":
    process_burger_frames()