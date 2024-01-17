from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import ST7735
disp = ST7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=125, height=155, rotation=0)

# Initialize display.
disp.begin()


WIDTH = disp.width
HEIGHT = disp.height

print(WIDTH)

# Load default font.
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)

text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."

img = Image.new('RGB', (WIDTH, HEIGHT))

draw = ImageDraw.Draw(img)


draw.text((5,5), text, font=font, fill=(255, 255, 255))
disp.display(img)