function Ticker(elem) {
    elem.lettering();
    this.done = false;
    this.cycleCount = 3;
    this.cycleCurrent = 0;
    this.chars = 'abcdefghijklmnopqurstuvwxyz1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');
    this.charsCount = this.chars.length;
    this.letters = elem.find('span');
    this.letterCount = this.letters.length;
    this.letterCurrent = 0;
    this.letters.each(function () {
        var $this = $(this);
        $this.attr('data-orig', $this.text());
        console.log($this.text());
        
        $this.text('-');
    });
}

Ticker.prototype.getChar = function () {
    return this.chars[Math.floor(Math.random() * this.charsCount)];
};

Ticker.prototype.reset = function () {
    this.done = false;
    this.cycleCurrent = 0;
    this.letterCurrent = 0;
    this.letters.each(function () {
        var $this = $(this);
        $this.text($this.attr('data-orig'));
        $this.removeClass('done');
    });
    this.loop();
};

Ticker.prototype.loop = function () {
    var self = this;

    this.letters.each(function (index, elem) {
        var $elem = $(elem);
        
        if (index >= self.letterCurrent) {
            if ($elem.text() !== ' ') {
                $elem.text(self.getChar());
                $elem.css('opacity', Math.random());
            }
        }
    });

    if (this.cycleCurrent < this.cycleCount) {
        this.cycleCurrent++;
    } else if (this.letterCurrent < this.letterCount) {
        var currLetter = this.letters.eq(this.letterCurrent);
        this.cycleCurrent = 0;
        currLetter.text(currLetter.attr('data-orig')).css('opacity', 1).addClass('done');
        this.letterCurrent++;
    } else {
        this.done = true;
    }

    if (!this.done) {
        requestAnimationFrame(function () {
            self.loop();
        });
    } else {
        setTimeout(function () {
            self.reset();
        }, 1000);
    }
};


function restart() {
    $words = $('.word');
    $words.html("0x5shf");
}

$words = $('.word');

$words.each(function () {
    

    var $this = $(this),
        ticker = new Ticker($this).reset();
    $this.data('ticker', ticker);
});


window.addEventListener( 'click', restart );