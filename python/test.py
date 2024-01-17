from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import ST7735
disp = ST7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=160, height=128, rotation=0)

# Initialize display.
disp.begin()


WIDTH = disp.width
HEIGHT = disp.height

print(WIDTH)

# Load default font.
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)

text = "better\n than\n nothing\n"

img = Image.new('RGB', (HEIGHT, WIDTH))

draw = ImageDraw.Draw(img)


draw.text((5,5), text, font=font, fill=(255, 255, 255))
disp.display(img)