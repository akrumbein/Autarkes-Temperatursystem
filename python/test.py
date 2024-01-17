from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import st7735

# Create TFT LCD display class.
disp = st7735.ST7735(
    port=0,
    cs=st7735.BG_SPI_CS_FRONT,  # BG_SPI_CS_BACK or BG_SPI_CS_FRONT. BG_SPI_CS_FRONT (eg: CE1) for Enviro Plus
    dc="PIN21",                 # "GPIO9" / "PIN21". "PIN21" for a Pi 5 with Enviro Plus
    backlight="PIN32",          # "PIN18" for back BG slot, "PIN19" for front BG slot. "PIN32" for a Pi 5 with Enviro Plus
    rotation=90,
    spi_speed_hz=4000000
)


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
