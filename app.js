const stations = [
  { name: 'Midnight Study', sub: 'lofi · 72 BPM', icon: '☾', color: '#8e91dc', track: 'File Mp3/FKJ _ Ylang Ylang EP (Live Session) [pfU0QORkRpY].mp3' },
  { name: 'Rainy Window', sub: 'ambient · 58 BPM', icon: '⌁', color: '#71b9ce', track: 'File Mp3/A Late Night R B Experience in Brooklyn Bryson Tiller, Daniel Caesar, Snoh, SZA Playlist.mp3' },
  { name: 'Café Closing', sub: 'jazzhop · 84 BPM', icon: '☕', color: '#d9906d', track: 'File Mp3/Just One More Drink -- Jazz Noir [7gtIh5dF9Xk].mp3' },
  { name: 'Sunday Morning', sub: 'acoustic · 68 BPM', icon: '☼', color: '#d6bd72', track: 'File Mp3/wave to earth playlist.𝜗𝜚 ࣪˖ ִ𐙚.mp3' }
];
const audioVersion = '20260903-1';
let stationIndex = 0;
let playing = false;
const $ = (id) => document.getElementById(id);
const musicAudio = $('musicAudio');
const rainAudio = $('rainAudio');
rainAudio.src = `File Mp3/เสียงฝนตก บนหลังคา ฝนตกเบาๆ แค่1ชั่วโมงนอนหลับสบาย ผ่อนคลาย [MjZbS3xj-Tk].mp3?v=${audioVersion}`;
rainAudio.volume = 0.24;
rainAudio.pause();

function renderStations() {
  $('stations').innerHTML = stations.map((station, index) => `
    <button class="station ${index === stationIndex ? 'selected' : ''}" type="button" data-index="${index}">
      <span class="station-art" style="--station-color:${station.color}">${station.icon}</span>
      <strong>${station.name}</strong><small>${station.sub}</small>
    </button>`).join('');
  document.querySelectorAll('.station').forEach((button) => button.addEventListener('click', () => selectStation(Number(button.dataset.index))));
}
function selectStation(index) {
  stationIndex = (index + stations.length) % stations.length;
  const station = stations[stationIndex];
  $('trackTitle').textContent = station.name;
  $('trackArtist').textContent = `ไฟล์เสียงในเครื่อง · ${station.sub.split('·')[1].trim()}`;
  musicAudio.src = `${station.track}?v=${audioVersion}`;
  renderStations();
  if (playing) {
    musicAudio.play().catch(() => { $('statusText').textContent = 'ไม่สามารถเล่นไฟล์เสียงนี้ได้'; });
  }
}
function togglePlay() {
  playing = !playing;
  $('playIcon').textContent = playing ? 'Ⅱ' : '▶';
  $('playButton').setAttribute('aria-label', playing ? 'หยุดเพลง' : 'เล่นเพลง');
  if (playing) {
    musicAudio.play().then(() => { $('statusText').textContent = 'กำลังเล่นเพลง'; }).catch(() => {
      playing = false;
      $('playIcon').textContent = '▶';
      $('playButton').setAttribute('aria-label', 'เล่นเพลง');
      $('statusText').textContent = 'ไม่สามารถเล่นไฟล์เสียงได้';
    });
  } else {
    musicAudio.pause();
    $('statusText').textContent = 'หยุดเพลงชั่วคราว';
  }
}
renderStations();
musicAudio.src = `${stations[stationIndex].track}?v=${audioVersion}`;
musicAudio.addEventListener('error', () => {
  $('statusText').textContent = 'ไม่พบไฟล์เสียง · เปิดเว็บผ่าน local server เพื่อเล่นไฟล์ในเครื่อง';
});
rainAudio.addEventListener('error', () => {
  $('statusText').textContent = 'ไม่พบไฟล์เสียงฝน · ตรวจสอบไฟล์ในโฟลเดอร์โปรเจกต์';
});
$('playButton').addEventListener('click', togglePlay);
$('backButton').addEventListener('click', () => selectStation(stationIndex - 1));
$('nextButton').addEventListener('click', () => selectStation(stationIndex + 1));
$('randomButton').addEventListener('click', () => selectStation(Math.floor(Math.random() * stations.length)));
$('themeButton').addEventListener('click', () => document.body.classList.toggle('light'));
$('motionToggle').addEventListener('change', (event) => document.body.classList.toggle('reduced-motion', event.target.checked));
$('rainToggle').addEventListener('change', (event) => {
  if (event.target.checked) {
    rainAudio.play().catch(() => {
      $('statusText').textContent = 'ไม่สามารถเล่นเสียงฝนได้';
    });
  } else {
    rainAudio.pause();
    $('statusText').textContent = playing ? 'กำลังเล่นเพลง · ปิดเสียงฝนแล้ว' : 'ปิดเสียงฝนแล้ว';
  }
});
['rain'].forEach((type) => {
  $(`${type}Volume`).addEventListener('input', (event) => {
    $(`${type}Value`).textContent = `${event.target.value}%`;
    if (type === 'rain') rainAudio.volume = Number(event.target.value) / 100;
  });
});

// Rain graph canvas animation
(function(){
  const canvas = $('rainGraph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=0,h=0;
  function resize(){
    w = canvas.width = canvas.clientWidth * devicePixelRatio;
    h = canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const drops = [];
  function spawnDrop(){
    const x = Math.random() * canvas.clientWidth;
    const len = 6 + Math.random()*14;
    const speed = 1 + Math.random()*6;
    drops.push({x, y: -10, len, speed, alpha: 0.6 + Math.random()*0.4});
  }

  function update(){
    const density = Number($('rainVolume').value) / 100; // 0..1
    const targetCount = Math.round(80 * density);
    while(drops.length < targetCount) spawnDrop();
    for(let i=drops.length-1;i>=0;i--){
      const d = drops[i];
      d.y += d.speed;
      d.x += 0.3 * Math.sin(d.y/10);
      if (d.y - d.len > canvas.clientHeight) drops.splice(i,1);
    }
  }

  function draw(){
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);
    ctx.lineWidth = 1;
    for(const d of drops){
      ctx.beginPath();
      ctx.strokeStyle = `rgba(167,221,255,${d.alpha})`;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 0.8, d.y - d.len);
      ctx.stroke();
    }
  }

  function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
  }
  // start loop
  loop();
})();
