from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import ST7735
import sys

if len(sys.argv) > 2:
    temp = sys.argv[1]
    carbon = sys.argv[2]
else:
    exit()

disp = ST7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=125, height=155, rotation=90)

WIDTH = disp.width
HEIGHT = disp.height

# Load default font.
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)

img = Image.new('RGB', (WIDTH, HEIGHT), fill=(255, 255, 255))

draw = ImageDraw.Draw(img)

draw.text((5,5), "Temperatur: " + temp + "°C/nCO2: " + carbon + " ppm", font=font, fill=(255, 255, 255))
disp.display(img)