from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import ST7735
disp = ST7735.ST7735(port=0, cs=0, dc=25, backlight=None,
rst=24, width=128, height=160, rotation=0, invert=False)


WIDTH = disp.width
HEIGHT = disp.height
img = Image.new('RGB', (WIDTH, HEIGHT))
draw = ImageDraw.Draw(img)
# Load default font.
font = ImageFont.load_default()
# Write some text
draw.text((5, 5), "Hello from AZ-delivery!", font=font,
fill=(255, 255, 255))
# display!
disp.display(img)
