from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

src = Path(r"F:\academy irannejad\academy-web\public\brand\hooshay.jpg")
out = Path(r"F:\academy irannejad\academy-web\public\brand\hooshay.png")

img = Image.open(src).convert("RGBA")
arr = np.array(img)
h, w = arr.shape[:2]
rgb = arr[:, :, :3].astype(np.int16)

corners = np.vstack(
    [
        rgb[0:8, 0:8].reshape(-1, 3),
        rgb[0:8, -8:].reshape(-1, 3),
        rgb[-8:, 0:8].reshape(-1, 3),
        rgb[-8:, -8:].reshape(-1, 3),
        rgb[0:6, w // 2 - 8 : w // 2 + 8].reshape(-1, 3),
    ]
)
bg = np.median(corners, axis=0)

hard = 38
soft = 58

diff = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
visited = np.zeros((h, w), dtype=bool)
is_bg = np.zeros((h, w), dtype=bool)

q = deque()
for x in range(w):
    q.append((0, x))
    q.append((h - 1, x))
for y in range(h):
    q.append((y, 0))
    q.append((y, w - 1))

while q:
    y, x = q.popleft()
    if visited[y, x]:
        continue
    visited[y, x] = True
    if diff[y, x] > soft:
        continue
    is_bg[y, x] = True
    if y > 0:
        q.append((y - 1, x))
    if y + 1 < h:
        q.append((y + 1, x))
    if x > 0:
        q.append((y, x - 1))
    if x + 1 < w:
        q.append((y, x + 1))

alpha = np.full((h, w), 255, dtype=np.uint8)
alpha[is_bg & (diff <= hard)] = 0
fade = is_bg & (diff > hard) & (diff <= soft)
alpha[fade] = np.clip(((diff[fade] - hard) / (soft - hard) * 255), 0, 255).astype(np.uint8)

arr[:, :, 3] = alpha
Image.fromarray(arr).save(out, "PNG")
print(f"saved {out} transparent={(alpha == 0).sum()} faded={fade.sum()} kept={(alpha == 255).sum()}")
