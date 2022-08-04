# infiniteLotteryTicket
An interactive art project that could make you a billionaire overnight! I made this as a gift for a wedding. It was either this, or oven mitts from the registry :)

  * On the top display, [Conway's Game of Life](https://codepen.io/3obby/pen/zYWrRNX) flows beautifully, and can be interacted with via the keypad below.
  * In the background, a node.js server is using the ever-changing elements of the game as a random number generator to create ethereum wallets.
  * Once the wallet is made, an API call is made to Infura.io to check the wallet balance to see if the 'lottery ticket' generated was a winner.
  * The output of the ethereum wallet generation is displayed on the keypad screen, and the infiniteLotteryTicket emails the owners upon boot+winning.
  
![](https://github.com/3obby/infiniteLotteryTicket/blob/master/images/lotteryTicket.jpg)

Tech Stack:
* React JS front-end to render the game of life (basically barebones html+css+JS)
* Node.js back-end to recieve data/generate ethereum wallets/send emails/interact with keypad
* Raspbian OS running on a raspi 3A+
* [RP2040/5100 macropad from adafruit](https://learn.adafruit.com/adafruit-macropad-rp2040) (cut in half) running circuitpy for the user input and display

In this repo, you'll find all the code/files you need to build this yourself.
   * Raspberri Pi 3 A+ (plus SD card/AC adapter)
   * Waveshare 7.9inch Capacitive Touch Screen (400x1280px)
   * 3D files to print the base (I used Shapeways Black PA12)

![](https://github.com/3obby/infiniteLotteryTicket/blob/master/images/lotteryTicketBack.jpg)

In raspbian, I'm using PM2 to run the node.js server, and have a bash script set up that starts everything up upon boot, meaning there's no configuration necessary.
I've spent some time tracking the memory used by this app, and it seems to be stable. I expect it'll run forever.

Special thanks to my buddy Alec that helped me design and develop the 3D parts! Couldn't have done it without you, my man!
