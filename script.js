/* =====================================================
   Be My Valentine — Pixel RPG Quest
   script.js
   =====================================================

   ✏️  TO PERSONALIZE:
   Change CRUSH_NAME below. Leave it as "" to keep it generic.
   ===================================================== */

const CRUSH_NAME = "";   // e.g. "Sam"

document.addEventListener('DOMContentLoaded', () => {

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- pixel-art asset generators ---------- */
  function heartSVG(color){
    const c = color.replace('#','%23');
    return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='6' shape-rendering='crispEdges' viewBox='0 0 7 6'%3E%3Cpath fill='"+c+"' d='M1 0h2v1H1zM4 0h2v1H4zM0 1h7v2H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z'/%3E%3C/svg%3E\")";
  }
  function cloudSVG(){
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32' shape-rendering='crispEdges' viewBox='0 0 16 8'%3E%3Cpath fill='%23ffffff' d='M6 2h4v1H6zM3 5h11v2H3z'/%3E%3C/svg%3E";
  }

  /* ---------- clouds ---------- */
  (function initClouds(){
    const clouds = [
      { el:'cloud1', top:'12vh', w:170, dur:60  },
      { el:'cloud2', top:'26vh', w:120, dur:85  },
      { el:'cloud3', top:'6vh',  w:220, dur:105 }
    ];
    clouds.forEach(cf => {
      const el = document.getElementById(cf.el);
      if(!el) return;
      el.style.top = cf.top;
      el.style.width = cf.w + 'px';
      el.style.height = (cf.w/2) + 'px';
      el.style.backgroundImage = "url(\"" + cloudSVG() + "\")";
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.imageRendering = 'pixelated';
      el.style.animationDuration = cf.dur + 's';
      el.style.animationDelay = (-Math.random()*cf.dur) + 's';
      if(reduced){ el.style.left = (Math.random()*60 + 10) + '%'; }
    });
  })();

  /* ---------- rising hearts ---------- */
  (function initAmbient(){
    if(reduced) return;
    const ambient = document.getElementById('ambient');
    if(!ambient) return;
    const colors = ['#ff5470','#ff8fa3','#ffcf3d','#ff5470'];
    const count = window.innerWidth < 600 ? 9 : 16;
    for(let i=0;i<count;i++){
      const h = document.createElement('div');
      h.className = 'fh';
      h.style.left = Math.random()*100 + '%';
      const s = 14 + Math.random()*18;
      h.style.width = s + 'px';
      h.style.height = (s*0.86) + 'px';
      h.style.backgroundImage = heartSVG(colors[Math.floor(Math.random()*colors.length)]);
      const dur = 11 + Math.random()*13;
      h.style.animationDuration = dur + 's';
      h.style.animationDelay = (-Math.random()*dur) + 's';
      ambient.appendChild(h);
    }
  })();

  /* ---------- personalize ---------- */
  const subtitle = document.querySelector('#questScreen .subtitle');
  if(subtitle && CRUSH_NAME.trim()){
    subtitle.textContent = CRUSH_NAME.trim() + ", a wild question appeared!";
  }

  /* ---------- element refs ---------- */
  const arena     = document.getElementById('arena');
  const yesBtn    = document.getElementById('yesBtn');
  const noBtn     = document.getElementById('noBtn');
  const hpFill    = document.getElementById('hpFill');
  const dialogue  = document.getElementById('dialogue');
  const coinCount = document.getElementById('coinCount');
  const skipBtn   = document.getElementById('skipBtn');

  const questScreen   = document.getElementById('questScreen');
  const victoryScreen = document.getElementById('victoryScreen');
  const declineScreen = document.getElementById('declineScreen');
  const expFill       = document.getElementById('expFill');
  const epilogueText  = document.getElementById('epilogueText');
  const againBtn      = document.getElementById('againBtn');
  const reconsiderBtn = document.getElementById('reconsiderBtn');

  /* ---------- battle text ---------- */
  const lines = [
    "No-Slime dodged! It's suspiciously fast.",
    "Your attack missed! No-Slime giggles.",
    "It's not very effective… because NO isn't an option.",
    "No-Slime used Evade! (again)",
    "Critical miss! The NO button was never real.",
    "You can't hit what refuses to be clicked.",
    "No-Slime fled 2 pixels to the left.",
    "Error: No.exe has left the battlefield.",
    "The council of Cupids blocked your NO.",
    "No-Slime is running low on excuses…",
    "Nice reflexes! Shame the button has better ones.",
    "Task failed successfully."
  ];

  const epilogues = [
    "SAVE DATA UPDATED. A new co-op campaign begins. Difficulty: adorable.",
    "New party member joined! Special ability: making ordinary days better.",
    "Achievement get: 'Said Yes.' Reward is currently loading… (it's plans, cute ones).",
    "Quest log: one (1) heart secured. Region unlocked: Wherever You Two Go Next."
  ];

  function setDialogue(text){
    dialogue.innerHTML = text + ' <span class="cursor">▶</span>';
  }

  /* ---------- dodge mechanic ---------- */
  let attempts = 0;
  let noDead = false;
  const HITS_TO_KILL = 6;

  function dodge(){
    if(noDead) return;
    attempts++;

    if(!reduced){
      const r = arena.getBoundingClientRect();
      const maxX = Math.max(r.width  - noBtn.offsetWidth,  0);
      const maxY = Math.max(r.height - noBtn.offsetHeight, 0);
      noBtn.style.position = 'absolute';
      noBtn.style.left = (Math.random()*maxX) + 'px';
      noBtn.style.top  = (Math.random()*maxY) + 'px';
    }

    const hp = Math.max(0, 100 - Math.round((attempts / HITS_TO_KILL) * 100));
    hpFill.style.width = hp + '%';
    hpFill.style.background = hp > 50 ? 'var(--green-hp)'
                          : hp > 20 ? 'var(--coin)'
                          : 'var(--red-hp)';

    setDialogue(lines[Math.floor(Math.random()*lines.length)]);
    coinCount.textContent = attempts;

    const scale = Math.min(1.55, 1 + attempts*0.08);
    yesBtn.style.transform = 'scale(' + scale + ')';

    if(hp <= 0) defeatNo();
  }

  function defeatNo(){
    noDead = true;
    noBtn.style.position = ''; noBtn.style.left = ''; noBtn.style.top = '';
    noBtn.textContent = 'NO 💀';
    noBtn.style.opacity = '.55';
    setDialogue("No-Slime has fainted! It stops running. The path is clear…");
  }

  noBtn.addEventListener('pointerenter', () => { if(!noDead) dodge(); });
  noBtn.addEventListener('touchstart', (e) => {
    if(!noDead){ e.preventDefault(); dodge(); }
  }, { passive:false });
  noBtn.addEventListener('click', () => {
    if(!noDead){ dodge(); } else { showDecline(); }
  });

  skipBtn.addEventListener('click', () => {
    noDead = true;
    noBtn.style.position = ''; noBtn.style.left = ''; noBtn.style.top = '';
    setDialogue("Fair enough — two normal buttons, no tricks. Pick whichever is true.");
  });

  /* ---------- screen transitions ---------- */
  function showVictory(){
    questScreen.classList.add('hidden');
    declineScreen.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    epilogueText.textContent = epilogues[Math.floor(Math.random()*epilogues.length)];
    expFill.style.width = '0%';
    requestAnimationFrame(() => setTimeout(() => { expFill.style.width = '100%'; }, 60));
    rainHearts();
  }

  function showDecline(){
    questScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    declineScreen.classList.remove('hidden');
  }

  function resetQuest(){
    attempts = 0; noDead = false;
    yesBtn.style.transform = 'scale(1)';
    hpFill.style.width = '100%'; hpFill.style.background = 'var(--green-hp)';
    coinCount.textContent = '0';
    noBtn.textContent = 'NO'; noBtn.style.opacity = '1';
    noBtn.style.position = ''; noBtn.style.left = ''; noBtn.style.top = '';
    setDialogue("You approach the question with your whole heart equipped. What will you do?");
    victoryScreen.classList.add('hidden');
    declineScreen.classList.add('hidden');
    questScreen.classList.remove('hidden');
  }

  yesBtn.addEventListener('click', showVictory);
  reconsiderBtn.addEventListener('click', showVictory);
  againBtn.addEventListener('click', resetQuest);

  /* ---------- victory heart-rain ---------- */
  function rainHearts(){
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    document.body.appendChild(layer);
    const colors = ['#ff5470','#ff8fa3','#ffcf3d','#4d9be6','#58d68d'];
    const n = reduced ? 26 : 120;
    for(let i=0;i<n;i++){
      const p = document.createElement('div');
      p.className = 'conf';
      const s = 12 + Math.random()*12;
      p.style.width = s + 'px';
      p.style.height = (s*0.86) + 'px';
      p.style.left = Math.random()*100 + '%';
      p.style.backgroundImage = heartSVG(colors[Math.floor(Math.random()*colors.length)]);
      const dur = 2.4 + Math.random()*2;
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = (Math.random()*0.5) + 's';
      layer.appendChild(p);
    }
    setTimeout(() => layer.remove(), 5200);
  }

});
