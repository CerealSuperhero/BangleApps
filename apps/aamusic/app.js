var storage = require('Storage');

const settings = storage.readJSON('setting.json', 1) || { HID: false };

var sendHid, next, prev, toggle, up, down, profile, timer;
var changeTrack = true;


var toggleControls = function () {
    changeTrack = false;
    //E.showMessage('Volume');
    setTimer();
}

var resetControls = function () {
    changeTrack = true;
    //E.showMessage('reset');
    drawApp();
    //setTimeout(drawApp, 1000);
}

var setTimer = function () {
    timer = setTimeout(resetControls, 5000);
}

var resetTimer = function () {
    clearTimeout(timer);
    setTimer();
}

if (settings.HID) {
    profile = 'Music';
    sendHid = function (code, cb) {
        try {
            NRF.sendHIDReport([1, code], () => {
                NRF.sendHIDReport([1, 0], () => {
                    if (cb) cb();
                });
            });
        } catch (e) {
            print(e);
        }
    };
    next = function (cb) { sendHid(0x01, cb); };
    prev = function (cb) { sendHid(0x02, cb); };
    toggle = function (cb) { sendHid(0x10, cb); };
    up = function (cb) { sendHid(0x40, cb); };
    down = function (cb) { sendHid(0x80, cb); };
} else {
    E.showMessage('HID disabled');
    setTimeout(load, 1000);
}

function drawApp() {
    g.clear();
    g.setFont("6x8", 2);
    g.setFontAlign(0, 0);
    g.drawString(profile, 120, 120);
    const d = g.getWidth() - 18;

    function c(a) {
        return {
            width: 8,
            height: a.length,
            bpp: 1,
            buffer: (new Uint8Array(a)).buffer
        };
    }

    g.drawImage(c([16, 56, 124, 254, 16, 16, 16, 16]), d, 40);
    g.drawImage(c([16, 16, 16, 16, 254, 124, 56, 16]), d, 194);
    g.drawImage(c([0, 8, 12, 14, 255, 14, 12, 8]), d, 116);
}


function drawAppVolume() {
    g.clear();
    g.setFont("6x8", 2);
    g.setFontAlign(0, 0);
    g.drawString("volume", 120, 120);
    const d = g.getWidth() - 18;

    function c(a) {
        return {
            width: 8,
            height: a.length,
            bpp: 1,
            buffer: (new Uint8Array(a)).buffer
        };
    }

    g.drawImage(c([0, 8, 12, 14, 15, 14, 12, 8]), d-10, 116);
    g.drawImage(c([102, 102, 102, 102, 102, 102, 102, 102]), d, 116);


    g.drawImage(c([4, 34, 105, 229, 225, 105, 34, 4]), d, 40);

    g.drawImage(c([0, 32, 104, 228, 228, 104, 32, 0]), d, 194);


}

if (next) {
    setWatch(function (e) {
        if (changeTrack) {
            E.showMessage('prev');
            setTimeout(drawApp, 1000);
            prev(() => { });
        } else {
            resetTimer();
            E.showMessage('up');
            setTimeout(drawAppVolume, 1000);
            up(() => { });
        }
    }, BTN1, { edge: "falling", repeat: true, debounce: 50 });

    setWatch(function (e) {
        if (changeTrack) {
            E.showMessage('next');
            setTimeout(drawApp, 1000);
            next(() => { });
        } else {
            resetTimer();
            E.showMessage('down');
            setTimeout(drawAppVolume, 1000);
            down(() => { });
        }
    }, BTN3, { edge: "falling", repeat: true, debounce: 50 });

    setWatch(function (e) {
        if (changeTrack) {
            toggleControls();
            drawAppVolume();
        } else {
            resetTimer();
            E.showMessage('play/pause')
            setTimeout(drawAppVolume, 1000);
            toggle();
        }
    }, BTN2, { edge: "falling", repeat: true, debounce: 50 });

    drawApp();
}

/* play pause symbol 
g.drawImage(c([0, 8, 12, 14, 15, 14, 12, 8]), d-10, 116);
g.drawImage(c([102, 102, 102, 102, 102, 102, 102, 102]), d, 116);
 */

 /* vol up 
 g.drawImage(c([4, 34, 105, 229, 225, 105, 34, 4]), d, 40);
  */

/* vol down 
g.drawImage(c([0, 32, 104, 228, 228, 104, 32, 0]), d, 194);
 */