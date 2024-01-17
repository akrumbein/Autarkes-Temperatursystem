from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import ST7735

disp = ST7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=125, height=155, rotation=90)

# Initialize display.
disp.begin()



WIDTH = disp.width
HEIGHT = disp.height

print(WIDTH)

# Load default font.
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)

img = Image.new('RGB', (WIDTH, HEIGHT))

draw = ImageDraw.Draw(img)

disp.display(img)