var c = document.createElement('canvas'),
  ctx = c.getContext('2d'),
  sizeArr = [4, 8, 16],
  size = 8,
  cols = 400 / size,
  rows = 1280 / size,
  count = cols * rows,
  w = cols * size,
  h = rows * size,
  dpr = window.devicePixelRatio,
  sizeDraw = size - 1,
  cells = [],
  simsin = [],
  tick = 0,
  tickr = 0,
  pi = 3.141,
  i, j, cell, neighborCount, x, y, colors = { r: 0, g: 0, b: 0, a: 0 }, offsets = { r: 0, b: 0, g: 0, a: 0 },
  updown = true,
  seed = Date.now(),
  seedlength = seed.toString().length,
  seedindex = 0,
  seedarr = ("" + seed).split(""),
  simindex = 0,
  fading = [0, 0.01, 0.03, 0.05, 0.5, 0.75, 1],
  fadingIndex = 2,
  spawnRate = [0, 1, 2, 5, 9],
  spawnIndex = 2,
  intervalTime=0,
  alertIndex=7,
  alertArr=[
    "What is this thing?"+"<br />"+"<br />"+"(1/6)"+"<br />"+"<br />"+"Basically, I'm an infinite digital lottery ticket that's nice to look at. Think of me as about 86,000 scratch-offs every day."+"<br />"+"<br />",
    "How does it work?"+"<br />"+"<br />"+"(2/6)"+"<br />"+"<br />"+"I use data from these chaotic cells to generate randomness. That randomness feeds the creation of ethereum wallets."+"<br />"+"<br />",
    "What are our odds of winning?"+"<br />"+"<br />"+"(3/6)"+"<br />"+"<br />"+"NEVER TELL ME THE ODDS! This lottery will have a lot of \'losers\'. There are, however, quite a few wallets with >$100,000,000 worth of ethereum..."+"<br />"+"<br />",
    "What happens if it \'wins\'?"+"<br />"+"<br />"+"(4/6)"+"<br />"+"<br />"+"I'll email you! I'll also send an email every time I'm turned on, so you can be sure you're hearing from me."+"<br />"+"<br />",
    "What up with the keypad?"+"<br />"+"<br />"+"(5/6)"+"<br />"+"<br />"+"Every button drastically alters the entropy, as does the time, the state of the game, and a super secret phrase... feel free to mash 'em!"+"<br />"+"<br />",
    "What else do I need to know?"+"<br />"+"<br />"+"(6/6)"+"<br />"+"<br />"+"If the \'#\' is increasing on the keypad below, I'm working optimally. The speed of the patterns don't affect the speed of wallet generation."+"<br />"+"<br />",
    "to bence and larz:"+"<br />"+"<br />"+"(7/28/2022)"+"<br />"+"<br />"+"Gratz on the marriage! I'm so excited to see y'all grow together; like two trees turning into an even stronger tree. Man, we should all go camping!"+"<br />"+"<br />"
  ];

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function loopThruArr(index, arr) {
  // console.log('old: '+arr[index]);
  // console.log('new: '+arr[(index+1)%(arr.length)]);


  return ((index + 1) % (arr.length));
}

function spawnround(i) {
  for (j = 0; j < 9; j++) {
    if (j != 4) {
      x = (i % cols) - 1 + j % 3;
      y = Math.floor(i / cols) - 1 + Math.floor(j / 3);
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        cells[y * cols + x][0]=1;
      }
    }
  }
}

function keyq() {
  offsets.r = randomIntFromInterval(0, 1007);
  offsets.b = randomIntFromInterval(0, 1007);
  offsets.g = randomIntFromInterval(0, 1007);
  offsets.a = randomIntFromInterval(0, 1007);
}

function keyw() {
  fadingIndex = loopThruArr(fadingIndex, fading);
}

function keye() {
  size = sizeArr[loopThruArr(sizeArr.indexOf(size), sizeArr)];

  cols = 400 / size;
  rows = 1280 / size;
  w = cols * size;
  h = rows * size;
  sizeDraw = size - 1;
  cells = [];
  count = cols * rows;

  init();
}

function keya() {
  chosenCell = Math.floor(Math.random() * count);
  spawnround(chosenCell);
}

function keys() {
  //ctx.clearRect(0, 0, w, h);
  for (i = 0; i < count; i++) {
    cells[i][0] = Math.round((Math.random()-0.7));
  }
  tick = 0;
  
}

function tempAlert(msg,duration)
    {
      console.log(alertIndex);
      
     var el = document.createElement("div");
     el.setAttribute("style","font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto;color:white;transform:translate(-50%,-50%);border:none;box-shadow: 4px 4px orange;background-color:LightSlateGray;position:absolute;top:50%;left:50%;padding:12px;text-align:center;height:200px;width:260px;vertical-align: middle;");
     el.innerHTML = msg;
     setTimeout(function(){
      el.parentNode.removeChild(el);
     },duration);
     document.body.appendChild(el);
    }

document.addEventListener('keydown', (event) => {
  var name = event.key;
  //var code = event.code;
  // Alert the key name and key code on keydown
  //alert(`Key pressed ${name} \r\n Key code value: ${code}`);
  if (name == 'q') {//rgb change done
    keyq();
  }
  if (name == 'w') {//fading change done
    keyw();
  }
  if (name == 'e') {//gridsize change done
    keye();
  }
  if (name == 'a') {//spawn rate done
    keya();
  }
  if (name == 's') {//superSpawn (killem!)
    keys();
  }
  if (name == 'd') {//simplePreset (game of life with rate slow)
    if(intervalTime){
      intervalTime=0;
    }
    else{
      intervalTime=500
    }
  }
  if(name=='m'){//scroll popup
    alertIndex--;
    if(alertIndex<0){
      alertIndex=parseInt(alertArr.length)-1;
    }
    tempAlert(alertArr[alertIndex],8000);
  }
  if(name=='n'){//scroll popup
    
    alertIndex++;
    if(alertIndex>=parseInt(alertArr.length)){
      alertIndex=0;
    }
    tempAlert(alertArr[alertIndex],8000);
  }
}, false);

function myKeyPress(e) {
  var keynum;

  if (window.event) { // IE                  
    keynum = e.keyCode;
  } else if (e.which) { // Netscape/Firefox/Opera                 
    keynum = e.which;
  }

  alert(String.fromCharCode(keynum));
}

function smoothColors(value) {
  var combo = (value | 0);
  if (combo < 256) {
    return combo;
  }
  else {
    return 256 - (256 - combo);
  }
}

function reseed() {
  seed = Date.now();
  seedlength = seed.toString().length;
  seedindex = 0;
  seedarr = ("" + seed).split("");
}

function getColors() {
  if (seedindex < seedlength) {
    if (seedarr[seedindex] < 3) {
      offsets.r += 1;
      if (offsets.r > 1007) {
        offsets.r = 0;
      }
    }
    else if (seedarr[seedindex] < 6) {
      offsets.b += 1;
      if (offsets.b > 1007) {
        offsets.b = 0;
      }
    }
    else if (seedarr[seedindex] < 9) {
      offsets.g += 1;
      if (offsets.g > 1007) {
        offsets.g = 0;
      }
    }
    else {
      offsets.a += 1;
      if (offsets.a > 1007) {
        offsets.a = 0;
      }
    }
  }
  else {
    reseed();
  }

  // colors.r = smoothColors(getSine(offsets.r));
  // colors.b = smoothColors(getSine(offsets.b));
  // colors.g = smoothColors(getSine(offsets.g));

  colors.r = getSine(offsets.r);
  colors.b = getSine(offsets.b);
  colors.g = getSine(offsets.g);
  colors.a = getSine(offsets.a);

  seedindex++;

}

function getSine(offset) {//produces something between 1 and 510, cyclical
  simindex++;
  if (simindex > 1007) {
    simindex = 0;
  }
  output = ~~((simsin[(simindex + offset) % simsin.length] * 255));
  //output = (~~(((Math.cos(((2 * pi * (tick / 1000)-offset))) * .35) + .65) * 510));

  return output;
}

function init() {
  c.width = w * dpr;
  c.height = h * dpr;
  c.style.width = w + 'px';
  c.style.height = h + 'px';
  ctx.scale(dpr, dpr);
  simsin=[];

  for (i = 0; i < count; i++) {
    cells.push([0, 0]);
  }
  var bottom = 0;
  for (let index = 0; !bottom; index++) {
    var newnum = (((Math.cos((2 * pi * (index / 1000))) * .45) + .55)).toFixed(3) - 0;
    if (simsin.length - 0 < 2) {
      simsin.push(newnum);
    }
    else if (simsin[(simsin.length - 1)] > simsin[(simsin.length - 2)]) {
      bottom = 1;
    }
    else {
      if (!bottom) {
        simsin.push(newnum);
      }
    }
  }
  simsin.pop();
  simsin = simsin.concat(simsin.slice().reverse());
  simsin.pop();
  simsin.pop();
  simsin.pop();
  simsin.pop();
  simsin.pop();
  simsin.pop();
  simsin.pop();
  simsin.pop();

  restart();
}

function restart() {
  ctx.clearRect(0, 0, w, h);
  for (i = 0; i < count; i++) {
    cells[i][0] = Math.round(Math.random());
  }
  tick = 0;
}

function getNeighborCount(i) {
  neighborCount = 0;
  for (j = 0; j < 9; j++) {
    if (j != 4) {
      x = (i % cols) - 1 + j % 3;
      y = Math.floor(i / cols) - 1 + Math.floor(j / 3);
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        if (cells[y * cols + x][0]) {
          neighborCount++;
        }
      }
    }
  }
  return neighborCount;
}

function step() {
  for (i = 0; i < count; i++) {
    cells[i][1] = getNeighborCount(i);
  }
  for (i = 0; i < count; i++) {
    cell = cells[i];
    if (cell[0]) {
      if (cell[1] < 2) {
        cell[0] = 0;
      } else if (cell[1] > 3) {
        cell[0] = 0;
      }
    } else {
      if (cell[1] === 3) {
        cell[0] = 1;
      }
    }
  }
}

function draw() {
  ctx.beginPath();
  for (i = 0; i < count; i++) {
    if (cells[i][0]) {
      ctx.rect((i % cols) * size, ~~(i / cols) * size, sizeDraw, sizeDraw);
    }
  }

  getColors();

  ctx.fillStyle = 'rgb(' + colors.r + ',' + colors.g + ',' + colors.b + ',1)';
  //console.log("col: "+colors.r, colors.g, colors.b);
  
  ctx.fill();
}

function darkenDead() {
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.fillStyle = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',' + fading[fadingIndex] + ')';
  ctx.fill();
}

function loop() {

  setTimeout(function () {

    requestAnimationFrame(loop);
    step();
    darkenDead();
    draw();

    passRGBA();
  }, 0 | intervalTime); // How long you want the delay to be, measured in milliseconds.

  if (updown) {
    tick++;
  }
  else {
    tick--;
  }
  if (tick == 100) {
    updown = false;
  }
  if (tick > 0) {
    updown = true;
  }
  if (tick % 3 == 0) {
    respawn();
  }
}

function respawn() {
  if(size != 16){
    for (let index = 0; index < spawnIndex*2; index++) {
      chosenCell = Math.floor(Math.random() * count);
      cells[chosenCell][0]=1;
    }
  }
  else{
    for (let index = 0; index < spawnIndex*3; index++) {
      chosenCell = Math.floor(Math.random() * count);
      cells[chosenCell][0]=1;
    }
  }
}

function passRGBA() {

  xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://localhost:666/rgb', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

  var payload = "rgba=c";//c=color when ingested by rp2040

  payload+=String(colors.r).padStart(3, '0');
  payload+=String(colors.g).padStart(3, '0');
  payload+=String(colors.b).padStart(3, '0');
  payload+=String(colors.a).padStart(3, '0');

  //console.log(payload);
  
  xhr.send(payload);
  
  // xhr.onload = function () {
  //   console.log(xhr.response);
  // }
}

//window.addEventListener('click', respawn);

document.body.appendChild(c);
init();
loop();