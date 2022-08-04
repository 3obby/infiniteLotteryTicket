const Web3 = require('web3');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport');

const config = require('./config.json');

//Ethereum
const web3 = new Web3(new Web3.providers.HttpProvider(config.infuraAPIkey));

function makeWallet(entropy) {
    return web3.eth.accounts.create(entropy);
}

async function checkBalance(account) {
    var bal = await web3.eth.getBalance(account.address);
    if (bal > 0) {
        emailFoundEthereum(account.address, account.privateKey);
    }
}

var lastSentTime = new Date() / 1000;

var walletsTotal=0;

function ethLoop(dataString) {
    if (((new Date() / 1000) - lastSentTime)>1) {
        
        var entropy = "itsMorbinTime";
        entropy += lastSentTime.toString();
        entropy += dataString.substring(1);

        account = makeWallet(entropy);
        var addr = account.address;
        var addrShort = addr.substring(0,7)+".. .."+addr.substring(36,42);
        console.log("sending " + addrShort);
        console.log(addrShort);
        walletsTotal++;
        sendToUSB(addrShort+""+walletsTotal);
        checkBalance(account);
        lastSentTime = new Date().getTime() / 1000;
    }
}

//EMAIL

async function emailTurnedOn() {
    const auth = {
        auth: {
            api_key: config.mailgunAPIkey,
            domain: config.mailgunDomain
        }
    }

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));

    var publicKey = "0xExamplePublicKey";
    var privateKey = "xxExamplePrivateKey"
    nodemailerMailgun.sendMail({
        from: 'ethereum@3obby.com',
        to: [config.emailRecipient1,config.emailRecipient2,config.emailRecipient3],
        subject: 'I\'m alive!',
        html: '<p>Thanks for turning me on! I\'ll work diligently to try to find some Ethereum for you. When I find some, I\'ll email you the private key! </p><br><p>Example Public Key: '+publicKey+' <br>Example Private Key: '+privateKey+'</p>'
    }, (err, info) => {
        if (err) {
            console.log(`Email Error: ${err}`);
        }
        else {
            console.log(`Email Sent`);
        }
    });
}

async function emailFoundEthereum(publicKey, privateKey) {
    const auth = {
        auth: {
            api_key: config.mailgunAPIkey,
            domain: config.mailgunDomain
        }
    }

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));

    nodemailerMailgun.sendMail({
        from: 'ethereum@3obby.com',
        to: [config.emailRecipient1,config.emailRecipient2,config.emailRecipient3],
        subject: 'HOLY SH*T! I FOUND SOME ETHEREUM',
        html: '<p>This is crazy! I think I found a wallet with some Ethereum in it. <br> Public Key: '+publicKey+' <br>Private Key: '+privateKey+'</p>'
    }, (err, info) => {
        if (err) {
            console.log(`Email Error: ${err}`);
        }
        else {
            console.log(`Email Sent`);
        }
    });
}

emailTurnedOn().catch(console.error);

//API
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/rgb', (req, res) => {
    res.send("RGB endpoint responded \'ok\'");
    var dataString = JSON.parse(JSON.stringify(req.body)).rgba;

    var check = openPort();
    if (check) {
        sendToUSB(dataString);
    }

    ethLoop(dataString);
})

app.get("/api", (req, res) => {
    res.json({ "users": ["userone", "usertwo"] })
})

app.listen(666, () => { console.log("server up on port 666") })

//USB-Serial


//COMPORT = "/dev/ttyACM0"; for linux
COMPORT = "COM3";

var port = new SerialPort({ path: COMPORT, baudRate: 9600, autoOpen: false }).on("error", function (error) {
    console.log(error + " info");
});

port.open();
function openPort() {
    if (port.port) {
        return 1;
    }
    else {
        console.log("attempting to open port");
        try {
            port.open();
        } catch (error) {

        }
        if (port.port) {
            console.log("port opened up");
            return 1;
        }
        else {
            console.log("port did not open");
            return 0;
        }
    }
}

function sendToUSB(dataString) {
    port.write(dataString, function (err) {
        if (err) {
            console.log('ERR: ' + err);

            if (COMPORT == "/dev/ttyACM0") {
                COMPORT = "/dev/ttyACM1";
            }
            else {
                COMPORT = "/dev/ttyACM0";
            }
            port = new SerialPort({ path: COMPORT, baudRate: 9600, autoOpen: false }).on("error", function (error) {
                console.log(error + "asdf");
            });
            port.flush(function(err,results){});
        }
    });
    port.flush(function (err, results) { });
}