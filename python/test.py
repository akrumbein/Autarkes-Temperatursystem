from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import st7735
disp = st7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=160, height=128, rotation=0)

# Initialize display.
disp.begin()


WIDTH = disp.width
HEIGHT = disp.height

# Load default font.
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)

text = "better than nothing"

img = Image.new('RGB', (WIDTH, HEIGHT))

draw = ImageDraw.Draw(img)


draw.text((0,0), text, font=font, fill=(255, 255, 255))
disp.display(img)