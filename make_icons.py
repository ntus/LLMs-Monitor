from pathlib import Path
import math
import struct
import zlib


def png(path: Path, size: int) -> None:
    colors = ((109, 216, 191, 255), (237, 166, 129, 255), (147, 179, 255, 255))
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            nx, ny = (x + .5) / size - .5, (y + .5) / size - .5
            radius = math.hypot(nx, ny)
            angle = (math.degrees(math.atan2(ny, nx)) + 360) % 360
            color = (9, 16, 27, 255)
            if abs(radius - .31) < .055:
                for index, (start, end) in enumerate(((285, 355), (45, 115), (165, 235))):
                    if start <= angle <= end:
                        color = colors[index]
            if radius < .075:
                color = (234, 240, 255, 255)
            if x in (0, size - 1) or y in (0, size - 1):
                color = (51, 67, 94, 255)
            row.extend(color)
        rows.append(bytes(row))
    raw = b''.join(rows)
    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff)
    payload = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    path.write_bytes(payload)


target = Path(__file__).parent / 'extension' / 'icons'
target.mkdir(parents=True, exist_ok=True)
for dimension in (16, 32, 48, 128):
    png(target / f'icon{dimension}.png', dimension)
