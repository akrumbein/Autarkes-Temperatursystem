from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import time
import st7735
disp = st7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=160, height=128, rotation=0,
    spi_speed_hz=4000000, invert=False)

# Initialize display.
disp.begin()


WIDTH = disp.width
HEIGHT = disp.height

img = Image.new('RGB', (WIDTH, HEIGHT), color=(0, 0, 0))

draw = ImageDraw.Draw(img)
# Load default font.
font = ImageFont.load_default()

while True:
    draw.rectangle((0, 0, 160, 80), (0, 0, 0))
    draw.text((5, 5), "SIEHT MAN DAS?", font=font, fill=(255, 255, 255))
    disp.display(img)
