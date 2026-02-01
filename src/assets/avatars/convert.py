from pathlib import Path

from PIL import Image

# Папка с изображениями (текущая)
folder = Path(".")

# Разрешённые расширения исходников
extensions = (".png", ".jpg", ".jpeg", ".webp")

for file in folder.iterdir():
    if file.is_file() and file.suffix.lower() in extensions:
        try:
            with Image.open(file) as img:
                # Уменьшение с сохранением пропорций до 50x50
                img.thumbnail((50, 50), Image.LANCZOS)

                # Новый путь с расширением .webp
                out_file = file.with_suffix(".webp")

                # Сохранение в WebP с максимальным сжатием
                img.save(
                    out_file,
                    format="WEBP",
                    quality=3, # низкое качество для маленького размера
                    method=6, # максимальное сжатие
                    optimize=True,
                )

            # Удаляем исходник, если это был не .webp или перезаписываем существующий
            if file != out_file:
                file.unlink()

            print(f"Converted and removed: {file.name} → {out_file.name}")

        except Exception as e:
            print(f"Failed: {file.name} ({e})")
