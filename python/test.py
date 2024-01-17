from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import time
import st7735
disp = st7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=128, height=160, rotation=90,
    spi_speed_hz=4000000)

# Initialize display.
disp.begin()


WIDTH = disp.width
HEIGHT = disp.height

img = Image.new('RGB', (WIDTH, HEIGHT), color=(0, 0, 0))

draw = ImageDraw.Draw(img)

font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 30)

x1, y1, x2, y2 = font.getbbox("SIEHT MAN DAS?")
size_x = x2 - x1
size_y = y2 - y1

text_x = 160
text_y = (80 - size_y) // 2

t_start = time.time()

while True:
    x = (time.time() - t_start) * 100
    x %= (size_x + 160)
    draw.rectangle((0, 0, 160, 80), (0, 0, 0))
    draw.text((int(text_x - x), text_y), "SIEHT MAN DAS?", font=font, fill=(255, 255, 255))
    disp.display(img)
