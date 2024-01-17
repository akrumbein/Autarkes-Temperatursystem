from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import time
import st7735
disp = st7735.ST7735(port=0, cs=0, dc="GPIO25", backlight=None,
rst="GPIO24", width=128, height=160, rotation=0, invert=False)

# Initialize display.
disp.begin()


WIDTH = disp.width
HEIGHT = disp.height

image = Image.open("deployrainbows.gif")

print("Drawing gif, press Ctrl+C to exit!")

frame = 0

while True:
    try:
        image.seek(frame)
        disp.display(image.resize((WIDTH, HEIGHT)))
        frame += 1
        time.sleep(0.05)

    except EOFError:
        frame = 0
