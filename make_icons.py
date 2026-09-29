from pathlib import Path
import math
import struct
import zlib


def png(path: Path, size: int) -> None:
    colors = ((105, 221, 189, 255), (242, 174, 130, 255), (154, 174, 255, 255))
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            nx, ny = (x + .5) / size - .5, (y + .5) / size - .5
            radius = math.hypot(nx, ny)
            angle = (math.degrees(math.atan2(ny, nx)) + 360) % 360
            corner = max(abs(nx)-.27, 0)**2 + max(abs(ny)-.27, 0)**2
            if corner > .22**2:
                color = (0, 0, 0, 0)
            else:
                color = (int(17 + 8 * (1 - ny)), int(27 + 9 * (1 - ny)), int(45 + 12 * (1 - ny)), 255)
                if abs(radius - .305) < .048:
                    color = (38, 58, 83, 255)
                    for index, (start, end) in enumerate(((112, 248), (292, 428), (42, 138))):
                        if start <= angle <= end or start <= angle + 360 <= end:
                            color = colors[index]
                if radius < .141:
                    color = (17, 28, 48, 255)
                if radius < .055:
                    color = (235, 242, 255, 255)
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
