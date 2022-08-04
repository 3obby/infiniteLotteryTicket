import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

import board
import digitalio
import displayio
import terminalio
import rotaryio
import neopixel
import keypad

import time
import usb_cdc

from adafruit_bitmap_font import bitmap_font
from adafruit_display_text import label

kbd = Keyboard(usb_hid.devices)

key_pins = (board.KEY1, board.KEY2, board.KEY3, board.KEY4, board.KEY5, board.KEY6)
keys = keypad.Keys(key_pins, value_when_pressed=False, pull=True)

encoder = rotaryio.IncrementalEncoder(board.ROTA, board.ROTB)
button = digitalio.DigitalInOut(board.BUTTON)
button.switch_to_input(pull=digitalio.Pull.UP)

pixels = neopixel.NeoPixel(board.NEOPIXEL, 12, brightness=0.2)

last_position = None

KEYCODES = (
Keycode.Q,
Keycode.W,
Keycode.E,
Keycode.A,
Keycode.S,
Keycode.D,
)

KEYTEXT = (
"color change",
"mod decay rate (x/7)",
"resize (x/3)",
"mod spawn rate (x/5)",
"genesis",
"toggle speed",
)

key_locked = [
0,
0,
0,
0,
0,
0
]

textRows = ()

def setColor(rgba):
    r = rgba[:3]
    g = rgba[3:6]
    b = rgba[6:-3]
    a = rgba[9:]

    r=int(float(r))
    g=int(float(g))
    b=int(float(b))
    a=int(50)

    if not key_locked[0]:
        pixels[0] = (r,g,b,a)
    if not key_locked[1]:
        pixels[1] = (r,g,b,a)
    if not key_locked[2]:
        pixels[2] = (r,g,b,a)
    if not key_locked[3]:
        pixels[3] = (r,g,b,a)
    if not key_locked[4]:
        pixels[4] = (r,g,b,a)
    if not key_locked[5]:
        pixels[5] = (r,g,b,a)


display = board.DISPLAY

group = displayio.Group()

#begin
text = ""
text_area = label.Label(terminalio.FONT, text=text)
text_area.x = 0
text_area.y = 3
group.append(text_area)

text_area2 = label.Label(terminalio.FONT, text="   Spencer & Laura's")
text_area2.x = 0
text_area2.y = 13
group.append(text_area2)

text_area3 = label.Label(terminalio.FONT, text="       Infinite ")
text_area3.x = 0
text_area3.y = 23
group.append(text_area3)

text_area4 = label.Label(terminalio.FONT, text="    Lottery Ticket")
text_area4.x = 0
text_area4.y = 33
group.append(text_area4)

text_area5 = label.Label(terminalio.FONT, text=text)
text_area5.x = 0
text_area5.y = 43
group.append(text_area5)

text_area6 = label.Label(terminalio.FONT, text=text)
text_area6.x = 0
text_area6.y = 53
group.append(text_area6)

display.show(group)

time.sleep(3)

text_area3.text = "       Infinite* "
text_area6.text = "  (results may vary)"

time.sleep(2)

text_area3.text = "       Infinite "
text_area6.text = ""

signal_begin = 0;
ticks = 0;
walletsChecked = 0;

loadingTips = (
"loading alphabet",
"reading binaries",
"fixing orientation",
"flashing lights",
"drawing box: []",
"deleting bad files",
"thinking/praying",
"importing dry goods",
"unlocking USB",
"cashing out [($)]",
"awaiting data",
"hodling stronkly",
"eating bugs",
"sudo rm -rf-ing",

)

loadingTipsPos = 0;

def showPublicKey(text):
    global walletsChecked
    text_area2.text = ""
    text_area3.text = " -Generating Wallets-"
    text_area4.text = "  "+text
    text_area5.text = ""
    text_area6.text = f"{'#'+str(walletsChecked) : >20}"

def loopLED(ticks):

    pixels[int(ticks%7)] = (200,200,200)
    pixels[int((ticks-1)%7)] = (0,0,0)
    time.sleep(.08)
    if int((ticks-1)%7)==5:
        time.sleep(.5)
        loopLoading()

def loopLoading():
    global loadingTipsPos
    text_area6.text = ">"+f"{loadingTips[loadingTipsPos] : ^21}"
    loadingTipsPos=loadingTipsPos+1
    if loadingTipsPos==len(loadingTips):
        loadingTipsPos=0

while True:

    if signal_begin and encoder.position != 0:
        if encoder.position==1:
            kbd.send(16)
        else:
            kbd.send(17)
        encoder.position = 0

    event = keys.events.get()
    if event and signal_begin:
        if event.pressed:
            kbd.press(KEYCODES[event.key_number])
            key_locked[event.key_number] = 1
            text_area.text = f"{KEYTEXT[event.key_number] : ^22}"
            pixels[event.key_number] = (255,255,255)
        else:
            kbd.release(KEYCODES[event.key_number])
            pixels[event.key_number] = 0
            text_area.text = ""
            key_locked[event.key_number] = 0

    while usb_cdc.data.in_waiting:
        raw = usb_cdc.data.read(usb_cdc.data.in_waiting)
        text = raw.decode("utf-8")
        flag = text[:1]
        tlen = len(text)
        if flag == "c" and tlen==13:
            rgbcolor = text[1:]
            setColor(rgbcolor)
            if not signal_begin:
                signal_begin = 1
                text_area.text = ""
        elif flag == "0" and tlen<29:
            wc=text[18:]
            if(wc).isdigit():
                walletsChecked=int(float(wc))
            showPublicKey(text[:18])
            

    if signal_begin == 0:
        ticks = ticks+1
        if ticks==63:
            ticks=0
        text_area.text = "    --OS loading--"
        text_area2.text = ""
        loopLED(ticks)




