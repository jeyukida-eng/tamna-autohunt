// 오토헌트 : 자동사냥 + 장비/강화 + PvP 아레나 프로토타입
// 제육이다 브랜드 캐릭터(classes.js) 기반, 전부 자체 설정값으로 구성한 학습용 예제입니다.

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const el = {
  classSelect: document.getElementById("classSelect"),
  classCards: document.getElementById("classCards"),
  app: document.getElementById("app"),
  classIcon: document.getElementById("classIcon"),
  charClass: document.getElementById("charClass"),
  hpFill: document.getElementById("hpFill"),
  hpText: document.getElementById("hpText"),
  mpFill: document.getElementById("mpFill"),
  mpText: document.getElementById("mpText"),
  expFill: document.getElementById("expFill"),
  expText: document.getElementById("expText"),
  lvText: document.getElementById("lvText"),
  statAtk: document.getElementById("statAtk"),
  statDef: document.getElementById("statDef"),
  statGold: document.getElementById("statGold"),
  statKills: document.getElementById("statKills"),
  statHonor: document.getElementById("statHonor"),
  autoBtn: document.getElementById("autoBtn"),
  skillRow: document.getElementById("skillRow"),
  equipSlots: document.getElementById("equipSlots"),
  inventory: document.getElementById("inventory"),
  logBox: document.getElementById("logBox"),
  floatLayer: document.getElementById("floatTextLayer"),
  zoneName: document.getElementById("zoneName"),
  zoneSelect: document.getElementById("zoneSelect"),
  pvpResult: document.getElementById("pvpResult"),
  tabBtns: document.querySelectorAll(".tab-btn"),
};

// ---------- 사냥터 / 몬스터 도감 (자체 명칭) ----------
const ZONES = [
  {
    id: "field", name: "초심자의 들판", minLevel: 1, bg: ["#16141f", "#1b1826", "#221d2d"],
    monsters: [
      { name: "들쥐",   color: "#8a6f4e", radius: 12, hp: 18,  atk: 2,  def: 0,  exp: 6,  gold: 2,  dropTable: [{ icon: "🪙", chance: 0.5 }] },
      { name: "독버섯",  color: "#7a4fae", radius: 14, hp: 26,  atk: 3,  def: 1,  exp: 9,  gold: 3,  dropTable: [{ icon: "🧪", chance: 0.25 }, { icon: "🪙", chance: 0.4 }] },
      { name: "숲도적",  color: "#4f6a4f", radius: 15, hp: 40,  atk: 5,  def: 2,  exp: 16, gold: 6,  dropTable: [{ icon: "📜", chance: 0.2 }, { icon: "🪙", chance: 0.6 }] },
    ],
  },
  {
    id: "coast", name: "몽돌해안", minLevel: 5, bg: ["#101c22", "#153038", "#1a3a40"],
    monsters: [
      { name: "집게도적게", color: "#c97a4a", radius: 14, hp: 55,  atk: 6,  def: 3,  exp: 22, gold: 9,  dropTable: [{ icon: "🧪", chance: 0.3 }, { icon: "🪙", chance: 0.5 }] },
      { name: "파도요정",   color: "#4aa0c9", radius: 15, hp: 70,  atk: 8,  def: 2,  exp: 28, gold: 12, dropTable: [{ icon: "📜", chance: 0.25 }, { icon: "🪙", chance: 0.55 }] },
      { name: "갯바위거인", color: "#6b6b74", radius: 18, hp: 95,  atk: 10, def: 5,  exp: 38, gold: 16, dropTable: [{ icon: "📜", chance: 0.3 }, { icon: "🪙", chance: 0.6 }] },
    ],
  },
  {
    id: "cave", name: "탐나국 동굴", minLevel: 10, bg: ["#120e18", "#1c1424", "#241a2e"],
    monsters: [
      { name: "박쥐떼",    color: "#5a4f7a", radius: 13, hp: 130, atk: 13, def: 6,  exp: 55, gold: 22, dropTable: [{ icon: "🧪", chance: 0.3 }, { icon: "🪙", chance: 0.6 }] },
      { name: "돌주먹골렘", color: "#5c5c64", radius: 19, hp: 170, atk: 16, def: 10, exp: 75, gold: 30, dropTable: [{ icon: "📜", chance: 0.35 }, { icon: "🪙", chance: 0.65 }] },
      { name: "어둠표범",   color: "#2e2a3a", radius: 15, hp: 150, atk: 20, def: 7,  exp: 68, gold: 28, dropTable: [{ icon: "📜", chance: 0.35 }, { icon: "🪙", chance: 0.65 }] },
    ],
  },
  {
    id: "ridge", name: "한라 능선", minLevel: 15, bg: ["#1a2230", "#26334a", "#2f3f58"],
    monsters: [
      { name: "눈보라요정", color: "#aecbe8", radius: 14, hp: 230, atk: 24, def: 12, exp: 95,  gold: 38, dropTable: [{ icon: "🧪", chance: 0.35 }, { icon: "🪙", chance: 0.65 }] },
      { name: "바람정령",   color: "#8fa8c4", radius: 16, hp: 260, atk: 28, def: 10, exp: 110, gold: 44, dropTable: [{ icon: "📜", chance: 0.4 },  { icon: "🪙", chance: 0.7 }] },
      { name: "설인",       color: "#e8eef5", radius: 20, hp: 320, atk: 32, def: 16, exp: 130, gold: 52, dropTable: [{ icon: "📜", chance: 0.4 },  { icon: "🪙", chance: 0.7 }] },
    ],
  },
  {
    id: "crater", name: "백록담 비경", minLevel: 20, bg: ["#141a2e", "#1c2740", "#233150"],
    monsters: [
      { name: "전설의 이무기", color: "#4a7a9e", radius: 18, hp: 420, atk: 40, def: 20, exp: 180, gold: 70, dropTable: [{ icon: "🧪", chance: 0.4 }, { icon: "🪙", chance: 0.75 }] },
      { name: "백록수호자",    color: "#d8c9a0", radius: 20, hp: 480, atk: 44, def: 24, exp: 210, gold: 80, dropTable: [{ icon: "📜", chance: 0.45 }, { icon: "🪙", chance: 0.8 }] },
      { name: "심연의 그림자", color: "#201c30", radius: 17, hp: 400, atk: 48, def: 18, exp: 195, gold: 75, dropTable: [{ icon: "📜", chance: 0.45 }, { icon: "🪙", chance: 0.8 }] },
    ],
  },
  {
    id: "lavacave", name: "용암동굴 심층", minLevel: 30, bg: ["#1e0f0f", "#2e1510", "#3a1810"],
    monsters: [
      { name: "불도마뱀",  color: "#d9552b", radius: 16, hp: 550, atk: 55, def: 24, exp: 250, gold: 95,  dropTable: [{ icon: "🧪", chance: 0.4 }, { icon: "🪙", chance: 0.75 }] },
      { name: "용암정령",  color: "#e8822f", radius: 17, hp: 650, atk: 65, def: 20, exp: 300, gold: 115, dropTable: [{ icon: "📜", chance: 0.45 }, { icon: "🪙", chance: 0.8 }] },
      { name: "화염거인",  color: "#b8371f", radius: 21, hp: 780, atk: 70, def: 30, exp: 350, gold: 130, dropTable: [{ icon: "📜", chance: 0.45 }, { icon: "🪙", chance: 0.8 }] },
    ],
  },
  {
    id: "strait", name: "폭풍의 해협", minLevel: 45, bg: ["#0d1620", "#13222f", "#1a2c3a"],
    monsters: [
      { name: "번개가오리", color: "#4fc3d9", radius: 17, hp: 820,  atk: 85,  def: 32, exp: 420, gold: 160, dropTable: [{ icon: "🧪", chance: 0.45 }, { icon: "🪙", chance: 0.8 }] },
      { name: "폭풍의 사자", color: "#6b7fd9", radius: 19, hp: 950,  atk: 95,  def: 28, exp: 480, gold: 180, dropTable: [{ icon: "📜", chance: 0.5 },  { icon: "🪙", chance: 0.85 }] },
      { name: "해일의 군주", color: "#2e4f78", radius: 22, hp: 1120, atk: 105, def: 40, exp: 550, gold: 210, dropTable: [{ icon: "📜", chance: 0.5 },  { icon: "🪙", chance: 0.85 }] },
    ],
  },
  {
    id: "mystwood", name: "신비의 고대숲", minLevel: 60, bg: ["#0f1a12", "#15241a", "#1c2e22"],
    monsters: [
      { name: "가시덩굴괴수", color: "#5a8f4a", radius: 18, hp: 1150, atk: 115, def: 45, exp: 580, gold: 220, dropTable: [{ icon: "🧪", chance: 0.45 }, { icon: "🪙", chance: 0.8 }] },
      { name: "고대나무정령", color: "#7a5a3a", radius: 21, hp: 1350, atk: 125, def: 55, exp: 650, gold: 250, dropTable: [{ icon: "📜", chance: 0.5 },  { icon: "🪙", chance: 0.85 }] },
      { name: "숲의 포식자",  color: "#2e3a24", radius: 19, hp: 1550, atk: 140, def: 48, exp: 730, gold: 280, dropTable: [{ icon: "📜", chance: 0.5 },  { icon: "🪙", chance: 0.85 }] },
    ],
  },
  {
    id: "ruins", name: "탐나국 왕실 유적", minLevel: 80, bg: ["#140f1c", "#1e1628", "#281c35"],
    monsters: [
      { name: "유적 수호병",   color: "#9a8a5a", radius: 19, hp: 1500, atk: 150, def: 65, exp: 760, gold: 290, dropTable: [{ icon: "🧪", chance: 0.5 }, { icon: "🪙", chance: 0.85 }] },
      { name: "봉인된 장수",   color: "#6a4a8a", radius: 20, hp: 1750, atk: 165, def: 70, exp: 860, gold: 330, dropTable: [{ icon: "📜", chance: 0.55 }, { icon: "🪙", chance: 0.9 }] },
      { name: "왕실 그림자기사", color: "#241a30", radius: 22, hp: 2000, atk: 180, def: 75, exp: 960, gold: 370, dropTable: [{ icon: "📜", chance: 0.55 }, { icon: "🪙", chance: 0.9 }] },
    ],
  },
  {
    id: "summit", name: "한라산 정상: 신들의 영역", minLevel: 100, bg: ["#1a1a24", "#242438", "#2e2a44"],
    monsters: [
      { name: "한라의 수호신", color: "#cfc8e8", radius: 22, hp: 2400, atk: 200, def: 90,  exp: 1100, gold: 420, dropTable: [{ icon: "🧪", chance: 0.5 }, { icon: "🪙", chance: 0.9 }] },
      { name: "태초의 돌거인", color: "#7a7488", radius: 24, hp: 2800, atk: 220, def: 100, exp: 1250, gold: 480, dropTable: [{ icon: "📜", chance: 0.55 }, { icon: "🪙", chance: 0.9 }] },
      { name: "탐나의 용",     color: "#d9a23c", radius: 23, hp: 3200, atk: 250, def: 110, exp: 1450, gold: 550, dropTable: [{ icon: "📜", chance: 0.6 },  { icon: "🪙", chance: 0.95 }] },
    ],
  },
];

// v2 — 독립 전투, 지역 보상, 보스, 기기 저장
const $ = id => document.getElementById(id);
const SAVE_KEY = 'tamna-autohunt-v2';
const VERSION = 2;
const SPAWN_POINTS = [{x:125,y:125},{x:350,y:115},{x:575,y:130},{x:155,y:350},{x:370,y:360},{x:590,y:345}];
const BOSS_NAMES = ['들판의 우두머리 돌갑옷','몽돌해안의 집게왕','동굴의 검은 파수꾼','한라의 눈보라 군주','백록담의 푸른 이무기','용암심장의 거인','폭풍을 삼킨 해룡','고대숲의 천년목','왕실 유적의 봉인왕','탐나의 태초룡'];
const MONSTER_ICONS = [['🐀','🍄','👺'],['🦀','🪼','🗿'],['🦇','🗿','🐈‍⬛'],['❄️','🌪️','🦍'],['🐉','🦌','👻'],['🦎','🔥','👹'],['⚡','🦁','🌊'],['🌿','🌳','🐺'],['🛡️','👹','♞'],['🦌','🗿','🐉']];
let player = null, monsters = [], currentZone = 0, inventory = {}, mode = 'hunt', autoHunting = false;
let zoneKills = Array(ZONES.length).fill(0), bossWins = Array(ZONES.length).fill(0);
let arena = {active:false,enemy:null,result:null,snapshot:null};
let effects = [], clock = 0, lastTs = null, lastSave = 0, hudElapsed = 0, loopStarted = false, manualDestination = null;
let savedGame = null, storageAvailable = true;
let previewOpen=false,previewId='jeyukje',previewAngle=.2,previewSpin=true,previewPreviousFocus=null,previewSpinStart=0;
const previewCanvas=$('modelCanvas'),previewCtx=previewCanvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const portraitCache = {};
function getPortrait(id) { if (!portraitCache[id]) { const img = new Image(); img.src = CLASS_DEFS[id].portrait; portraitCache[id] = img; } return portraitCache[id]; }
function dist(ax,ay,bx,by) { return Math.hypot(ax-bx,ay-by); }
function clamp(n,min,max) { return Math.max(min,Math.min(max,n)); }
function expForLevel(lv) { return Math.round(20*Math.pow(lv,1.5)); }
function basicDamage(atk,def) { return Math.max(1,Math.round(atk-def*.65+Math.random()*2)); }
function equipmentBonus(p,key) { return Object.values(p.equipment).reduce((n,it)=>n+(it && it.statKey===key?equippedStatValue(it):0),0); }
function recalcStats(p,restore=false) {
  const c=CLASS_DEFS[p.classId], lv=p.level-1;
  p.maxHp=Math.round(c.baseHp+c.hpPerLv*lv+equipmentBonus(p,'hp'));
  p.maxMp=Math.round(c.baseMp+c.mpPerLv*lv);
  p.atk=Math.round(c.baseAtk+c.atkPerLv*lv+equipmentBonus(p,'atk'));
  p.def=Math.round(c.baseDef+c.defPerLv*lv+equipmentBonus(p,'def'));
  p.hp=restore?p.maxHp:clamp(p.hp,0,p.maxHp); p.mp=restore?p.maxMp:clamp(p.mp,0,p.maxMp);
}
function log(msg,cls='') { const n=document.createElement('div'); n.className='log-line '+cls;n.textContent=msg;el.logBox.prepend(n);while(el.logBox.childNodes.length>60)el.logBox.lastChild.remove(); }
function floatText(x,y,text,cls='') { const n=document.createElement('div');n.className='float-text '+cls;n.textContent=text;n.style.left=clamp(x/W*100,4,86)+'%';n.style.top=clamp(y/H*100,4,94)+'%';el.floatLayer.appendChild(n);setTimeout(()=>n.remove(),900); }
function fx(x,y,color='#ebc879',radius=30,x2=null,y2=null) { effects.push({x,y,color,radius,x2,y2,life:.38,maxLife:.38}); }
function createPlayer(id) { const c=CLASS_DEFS[id];return {classId:id,x:W/2,y:H/2,radius:18,level:1,exp:0,maxExp:expForLevel(1),hp:0,mp:0,maxHp:0,maxMp:0,atk:0,def:0,speed:c.speed,range:c.range,atkInterval:c.atkInterval,atkCooldown:0,skillCooldown:0,gold:0,kills:0,honor:0,equipment:{weapon:null,armor:null,accessory:null},target:null,alive:true,respawnAt:0,moving:false,hitUntil:0}; }

function buildClassCards() {
 el.classCards.innerHTML='';
 Object.values(CLASS_DEFS).forEach(c=>{const card=document.createElement('button');card.type='button';card.className='class-card';card.innerHTML=`<img class="class-portrait" src="${c.portrait}" alt="${c.name}" width="220" height="220"><div class="class-name">${c.icon} ${c.name}</div><div class="class-desc">${c.desc}</div><div class="class-stats">체력 ${c.baseHp} · 공격 ${c.baseAtk} · 방어 ${c.baseDef}<br>${c.skill.icon} ${c.skill.name}</div>`;card.addEventListener('click',()=>{if(player||savedGame){if(!window.confirm('현재 모험을 새 캐릭터로 교체할까요? 보관하려면 먼저 파일로 내보내세요.'))return;}startGame(c.id);});el.classCards.appendChild(card);getPortrait(c.id);});
}
function startGame(id,data=null) {
 player=createPlayer(id);inventory={};zoneKills=Array(ZONES.length).fill(0);bossWins=Array(ZONES.length).fill(0);currentZone=0;clock=0;effects=[];manualDestination=null;mode='hunt';autoHunting=false;arena={active:false,enemy:null,result:null,snapshot:null};el.logBox.innerHTML='';
 if(data){Object.assign(player,data.player);player.target=null;player.alive=true;player.respawnAt=0;inventory={...data.inventory};currentZone=data.currentZone;zoneKills=[...data.zoneKills];bossWins=[...data.bossWins];}
 recalcStats(player,!data);player.maxExp=expForLevel(player.level);player.y=clamp(player.y,115,H-35);if(player.hp<=0){player.alive=false;player.respawnAt=3;}
 el.classIcon.textContent=CLASS_DEFS[id].icon;el.charClass.textContent=CLASS_DEFS[id].name;
 el.classSelect.classList.add('hidden');el.app.classList.remove('hidden');el.pvpResult.classList.add('hidden');el.autoBtn.classList.remove('hidden');el.zoneSelect.classList.remove('hidden');el.zoneName.classList.add('hidden');el.tabBtns.forEach(b=>b.classList.toggle('active',b.dataset.mode==='hunt'));
 buildMonstersForZone();renderZoneSelect();renderEquipPanel();renderInventory();renderSkillRow();syncAutoButton();updateHud();
 log(data?'모험을 이어갑니다. 쉬는 동안의 자동 전투 보상은 없습니다.':`${CLASS_DEFS[id].name}의 모험이 시작됩니다. 자동사냥을 눌러 출발하세요.`,'levelup');
 saveGame();lastTs=null;lastSave=0;if(!loopStarted){loopStarted=true;requestAnimationFrame(tick);}
}

// ---------- 지역과 몬스터 ----------
function spawnMonster(pt,idx,boss=false) {
 const z=ZONES[currentZone], def=z.monsters[idx%3];
 return {...def,variant:idx%3,name:boss?BOSS_NAMES[currentZone]:def.name,icon:boss?'👹':MONSTER_ICONS[currentZone][idx%3],x:pt.x,y:pt.y,spawnX:pt.x,spawnY:pt.y,hp:Math.round(def.hp*(boss?3.2:1)),maxHp:Math.round(def.hp*(boss?3.2:1)),atk:Math.round(def.atk*(boss?1.5:1)),def:def.def+(boss?2:0),exp:Math.round(def.exp*(boss?5:1)),gold:Math.round(def.gold*(boss?8:1)),radius:boss?30:18,speed:boss?48:42+currentZone*2,range:boss?48:32,aggro:boss?600:145,atkInterval:boss?1.5:1.25,atkCooldown:.8,alive:true,respawnAt:0,boss,engaged:false,hitUntil:0,moving:false};
}
function buildMonstersForZone(){monsters=SPAWN_POINTS.map((pt,i)=>spawnMonster(pt,i));player.target=null;effects=[];}
function renderZoneSelect(){el.zoneSelect.innerHTML='';ZONES.forEach((z,i)=>{const n=document.createElement('option');n.value=i;n.disabled=player.level<z.minLevel;n.textContent=`${n.disabled?'🔒 ':''}${z.name} · Lv.${z.minLevel}`;el.zoneSelect.appendChild(n);});el.zoneSelect.value=currentZone;}
function changeZone(idx){if(!Number.isInteger(idx)||!ZONES[idx])return;if(mode!=='hunt'||!player.alive)return;const z=ZONES[idx];if(player.level<z.minLevel){log(`Lv.${z.minLevel}부터 입장할 수 있습니다.`);renderZoneSelect();return;}currentZone=idx;player.x=W/2;player.y=H/2;manualDestination=null;buildMonstersForZone();renderZoneSelect();log(`${z.name}에 도착했습니다. 지역 ${idx+1} 장비를 찾을 수 있습니다.`);saveGame();updateHud();}
el.zoneSelect.addEventListener('change',()=>changeZone(Number(el.zoneSelect.value)));
function challengeBoss(){if(mode!=='hunt'||!player.alive||zoneKills[currentZone]<12||monsters.some(m=>m.boss&&m.alive))return;const boss=spawnMonster({x:W/2,y:100},2,true);monsters.push(boss);player.target=boss;autoHunting=true;manualDestination=null;syncAutoButton();log(`${boss.name} 등장! 물약을 준비하세요.`,'levelup');}
$('bossBtn').addEventListener('click',challengeBoss);
function findNearestMonster(){let best=null,bd=Infinity;for(const m of monsters){if(!m.alive)continue;const d=dist(player.x,player.y,m.x,m.y);if(d<bd){best=m;bd=d;}}return best;}
function moveToward(a,b,speed,dt,stop=0){const d=dist(a.x,a.y,b.x,b.y);a.moving=d>stop+.2;if(!a.moving)return;if(a.classId){a.facing=(b.x-a.x)<-2?-.6:(b.x-a.x)>2?.6:(b.y-a.y)<0?2.6:0;}const step=Math.min(speed*dt,d-stop);a.x=clamp(a.x+(b.x-a.x)/d*step,24,W-24);a.y=clamp(a.y+(b.y-a.y)/d*step,a.classId?115:65,H-28);}

// ---------- 가방과 강화 ----------
const ITEM_DEFS={'🧪':{name:'물약',desc:'체력 40% 회복'},'📜':{name:'주문서',desc:'강화 시 자동 사용 · 성공 보장'},'🪙':{name:'골드주머니',desc:'20 골드 획득'}};
function addItem(icon,n=1){inventory[icon]=(inventory[icon]||0)+n;renderInventory();if(icon==='📜')renderEquipPanel();}
function useItem(icon){if(!player||mode!=='hunt'||!player.alive||!inventory[icon])return false;if(icon==='📜'){log('주문서는 강화할 때 한 장씩 자동으로 사용됩니다.');return false;}if(icon==='🧪'){if(player.hp>=player.maxHp)return false;const before=player.hp;player.hp=Math.min(player.maxHp,player.hp+Math.round(player.maxHp*.4));floatText(player.x,player.y-45,`+${Math.round(player.hp-before)}`,'heal');}else if(icon==='🪙'){player.gold+=20;}else return false;inventory[icon]--;if(!inventory[icon])delete inventory[icon];renderInventory();saveGame();return true;}
function renderInventory(){el.inventory.innerHTML='';Object.entries(ITEM_DEFS).forEach(([icon,d])=>{const n=document.createElement('button');n.className='inv-slot';n.title=d.desc;n.setAttribute('aria-label',`${d.name} ${inventory[icon]||0}개. ${d.desc}`);n.innerHTML=`<span>${icon}</span>${d.name}<br>× ${inventory[icon]||0}`;n.disabled=mode!=='hunt'||!player.alive||!inventory[icon]||icon==='📜';n.addEventListener('click',()=>useItem(icon));el.inventory.appendChild(n);});$('enhanceNotice').textContent=`주문서 ${inventory['📜']||0}장 · 강화 시 한 장 자동 적용`;} 
function renderEquipPanel(){el.equipSlots.innerHTML='';for(const t of EQUIP_TEMPLATES){const it=player.equipment[t.slot],box=document.createElement('div');box.className='equip-slot'+(it?'':' empty');if(it){box.innerHTML=`<div class="eq-icon">${it.icon}</div><div class="eq-info"><div style="color:${it.rarityColor}">${it.rarityLabel} ${it.name} +${it.enhanceLevel}</div><div class="eq-stat">지역 ${it.tier} · ${it.statKey.toUpperCase()} +${equippedStatValue(it)}</div></div><button class="eq-enhance-btn">강화<br>${enhanceCost(it)}G · ${inventory['📜']?'100':Math.round(enhanceSuccessChance(it)*100)}%</button>`;const btn=box.querySelector('button');btn.disabled=mode!=='hunt'||!player.alive||it.enhanceLevel>=20;btn.addEventListener('click',()=>enhanceItem(t.slot));}else box.textContent=`${t.icon} ${t.name} · 아직 발견하지 못했어요`;el.equipSlots.appendChild(box);}}
function enhanceItem(slot){if(!player.alive||mode!=='hunt')return false;const it=player.equipment[slot];if(!it||it.enhanceLevel>=20)return false;const cost=enhanceCost(it);if(player.gold<cost){log('강화에 필요한 골드가 부족합니다.');return false;}player.gold-=cost;let success=false;if(inventory['📜']>0){inventory['📜']--;if(!inventory['📜'])delete inventory['📜'];success=true;}else success=Math.random()<enhanceSuccessChance(it);if(success){it.enhanceLevel++;log(`${it.name} +${it.enhanceLevel} 강화 성공!`,'levelup');}else log('강화 실패. 장비와 강화 단계는 유지됩니다.','dmg-to-player');recalcStats(player);renderInventory();renderEquipPanel();saveGame();return success;}
function receiveEquipmentDrop(m,forceRare=false){const candidate=rollEquipment(1+currentZone*2);candidate.tier=currentZone+1;if(forceRare){const t=EQUIP_TEMPLATES.find(t=>t.slot===candidate.slot);candidate.statValue=Math.round(t.baseStat*RARITY.rare.mult*(1+currentZone*2));candidate.rarityKey='rare';candidate.rarityLabel=RARITY.rare.label;candidate.rarityColor=RARITY.rare.color;}const current=player.equipment[candidate.slot];if(isUpgrade(current,candidate)){player.equipment[candidate.slot]=candidate;recalcStats(player);log(`[지역 ${candidate.tier}] ${candidate.rarityLabel} ${candidate.name} 자동 장착!`,'drop');renderEquipPanel();}else{const gold=Math.max(2,Math.round(candidate.statValue*1.5));player.gold+=gold;log(`중복 장비를 ${gold}G로 교환했습니다.`,'drop');}}

// ---------- 전투 ----------
function hurtMonster(m,dmg){if(!m.alive)return;m.hp=Math.max(0,m.hp-dmg);m.engaged=true;m.hitUntil=clock+.18;floatText(m.x,m.y-30,`-${dmg}`);if(m.hp<=0)killMonster(m);}
function playerAttack(m){if(!m||!m.alive||!player.alive||dist(player.x,player.y,m.x,m.y)>player.range+1)return;player.facing=m.x<player.x?-.6:.6;fx(player.x,player.y-12,'#efcb7f',15,m.x,m.y);hurtMonster(m,basicDamage(player.atk,m.def));}
function castHuntSkill(){if(!player||!player.alive||mode!=='hunt')return false;const s=CLASS_DEFS[player.classId].skill;if(player.skillCooldown>0||player.mp<s.manaCost)return false;if(s.kind==='heal'){if(player.hp>=player.maxHp*.9)return false;const old=player.hp;player.hp=Math.min(player.maxHp,player.hp+Math.round(player.maxHp*s.healPercent));floatText(player.x,player.y-40,`+${Math.round(player.hp-old)}`,'heal');fx(player.x,player.y,'#9cdeb3',65);}else{const target=player.target;if(!target||!target.alive||dist(player.x,player.y,target.x,target.y)>player.range)return false;const {x,y}=target;fx(x,y,'#d9b4ef',s.aoe||60);for(const m of monsters){if(m.alive&&(s.kind==='aoe'?dist(x,y,m.x,m.y)<=s.aoe:m===target))hurtMonster(m,basicDamage(player.atk*s.power,m.def));}}player.mp-=s.manaCost;player.skillCooldown=s.cooldown;return true;}
$('skillBtn').addEventListener('click',()=>{if(!castHuntSkill())log('스킬은 마나·재사용 시간·대상 거리를 확인해주세요.');});
function killMonster(m){if(!m.alive)return;m.alive=false;m.respawnAt=clock+5+Math.random()*2;player.kills++;player.gold+=m.gold;zoneKills[currentZone]++;log(`${m.name} 처치 · +${m.exp} EXP · +${m.gold}G`,'kill');if(m.boss){bossWins[currentZone]++;zoneKills[currentZone]=0;receiveEquipmentDrop(m,true);addItem('📜',1);log(`보스 격파! 희귀 장비 1개와 강화 주문서를 획득했습니다.`,'levelup');}else{for(const d of m.dropTable)if(Math.random()<d.chance)addItem(d.icon);if(Math.random()<.18)receiveEquipmentDrop(m);}gainExp(m.exp);if(player.target===m)player.target=null;saveGame();}
function gainExp(amount){player.exp+=amount;while(player.exp>=player.maxExp){player.exp-=player.maxExp;player.level++;player.maxExp=expForLevel(player.level);recalcStats(player,true);log(`Lv.${player.level}! 체력과 마나가 회복되었습니다.`,'levelup');floatText(player.x,player.y-40,'LEVEL UP!','heal');renderZoneSelect();}}
function die(){if(!player.alive)return;player.hp=0;player.alive=false;player.respawnAt=clock+3;autoHunting=false;manualDestination=null;player.target=null;monsters.forEach(m=>m.engaged=false);syncAutoButton();renderInventory();renderEquipPanel();log('쓰러졌습니다. 3초 뒤 부활합니다. 사냥은 다시 시작해주세요.','dmg-to-player');saveGame();}
function respawnPlayer(){player.alive=true;player.x=W/2;player.y=H/2;player.atkCooldown=0;player.skillCooldown=0;recalcStats(player,true);buildMonstersForZone();renderInventory();renderEquipPanel();log('안전하게 부활했습니다.');saveGame();}
function huntTick(dt){
 if(!player.alive){if(clock>=player.respawnAt)respawnPlayer();return;}
 player.moving=false;player.atkCooldown=Math.max(0,player.atkCooldown-dt);player.skillCooldown=Math.max(0,player.skillCooldown-dt);player.mp=Math.min(player.maxMp,player.mp+Math.max(.8,player.maxMp*.018)*dt);
 if(manualDestination){moveToward(player,manualDestination,player.speed,dt,2);if(dist(player.x,player.y,manualDestination.x,manualDestination.y)<3)manualDestination=null;}
 else if(autoHunting){if(!player.target||!player.target.alive)player.target=findNearestMonster();const m=player.target;if(m){if(dist(player.x,player.y,m.x,m.y)>player.range)moveToward(player,m,player.speed,dt,player.range);else if(!castHuntSkill()&&player.atkCooldown<=0){playerAttack(m);player.atkCooldown=player.atkInterval;}}}
 for(const m of monsters){m.moving=false;if(!m.alive){if(!m.boss&&clock>=m.respawnAt){m.hp=m.maxHp;m.alive=true;m.x=m.spawnX;m.y=m.spawnY;m.engaged=false;m.atkCooldown=.8;}continue;}const d=dist(player.x,player.y,m.x,m.y);if(!m.engaged&&d<m.aggro&&(autoHunting||manualDestination))m.engaged=true;if(m.engaged){m.atkCooldown=Math.max(0,m.atkCooldown-dt);if(d>m.range)moveToward(m,player,m.speed,dt,m.range);else if(m.atkCooldown<=0){m.atkCooldown=m.atkInterval;const dmg=basicDamage(m.atk,player.def);player.hp=Math.max(0,player.hp-dmg);player.hitUntil=clock+.18;fx(m.x,m.y,'#df8585',12,player.x,player.y);floatText(player.x,player.y-45,`-${dmg}`,'dmg-to-player');if(player.hp<=0){die();break;}}}}
 if(player.alive&&autoHunting&&player.hp<player.maxHp*.3)useItem('🧪');
 if(!autoHunting&&!monsters.some(m=>m.alive&&m.engaged))player.hp=Math.min(player.maxHp,player.hp+player.maxHp*.025*dt);
 monsters=monsters.filter(m=>!m.boss||m.alive);
}
function syncAutoButton(){el.autoBtn.textContent=autoHunting?'■ 자동사냥 중지':'▶ 자동사냥 시작';el.autoBtn.classList.toggle('active',autoHunting);}
el.autoBtn.addEventListener('click',()=>{if(!player||!player.alive)return;autoHunting=!autoHunting;manualDestination=null;syncAutoButton();});
canvas.addEventListener('pointerdown',event=>{if(!player||mode!=='hunt'||!player.alive)return;const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*W,y=(event.clientY-rect.top)/rect.height*H;const target=monsters.find(m=>m.alive&&dist(x,y,m.x,m.y)<Math.max(32,m.radius));if(target){player.target=target;autoHunting=true;manualDestination=null;}else{manualDestination={x:clamp(x,24,W-24),y:clamp(y,115,H-35)};autoHunting=false;player.target=null;}syncAutoButton();});

// ---------- 아레나: 사냥 상태는 별도로 보존 ----------
function captureHuntState(){return {x:player.x,y:player.y,hp:player.hp,mp:player.mp,alive:player.alive,respawnRemaining:Math.max(0,player.respawnAt-clock),atkCooldown:player.atkCooldown,skillCooldown:player.skillCooldown};}
function startArenaDuel(){if(mode!=='pvp'||arena.active)return;const ids=Object.keys(CLASS_DEFS).filter(id=>id!==player.classId),id=ids[Math.floor(Math.random()*ids.length)],e=createPlayer(id);e.level=player.level; // 비슷한 장비 수준의 AI 라이벌
 e.equipment=JSON.parse(JSON.stringify(player.equipment));recalcStats(e,true);e.maxHp=Math.round(e.maxHp*(.95+Math.random()*.1));e.hp=e.maxHp;e.x=W-150;e.y=H/2;e.atkCooldown=.5;e.skillCooldown=1;e.name=`환영 ${CLASS_DEFS[id].name}`;arena.enemy=e;arena.active=true;arena.result=null;player.x=150;player.y=H/2;player.alive=true;recalcStats(player,true);player.atkCooldown=.5;player.skillCooldown=1;el.pvpResult.classList.add('hidden');log(`${e.name}와 AI 모의 대련을 시작합니다.`);}
function arenaTick(dt){if(!arena.active)return;const p=player,e=arena.enemy;p.moving=e.moving=false;for(const [a,b,isPlayer] of [[p,e,true],[e,p,false]]){if(a.hp<=0||b.hp<=0)break;a.atkCooldown=Math.max(0,a.atkCooldown-dt);a.skillCooldown=Math.max(0,a.skillCooldown-dt);a.mp=Math.min(a.maxMp,a.mp+Math.max(.8,a.maxMp*.018)*dt);const s=CLASS_DEFS[a.classId].skill,d=dist(a.x,a.y,b.x,b.y);if(a.skillCooldown<=0&&a.mp>=s.manaCost&&(s.kind==='heal'?a.hp<a.maxHp*.65:d<=a.range)){a.mp-=s.manaCost;a.skillCooldown=s.cooldown;if(s.kind==='heal'){const old=a.hp;a.hp=Math.min(a.maxHp,a.hp+a.maxHp*s.healPercent);floatText(a.x,a.y-40,`+${Math.round(a.hp-old)}`,'heal');}else{const dmg=basicDamage(a.atk*s.power,b.def);b.hp=Math.max(0,b.hp-dmg);fx(b.x,b.y,'#c7b0eb',55);floatText(b.x,b.y-40,`-${dmg}`,isPlayer?'':'dmg-to-player');}}else if(d>a.range)moveToward(a,b,a.speed,dt,a.range);else if(a.atkCooldown<=0){a.atkCooldown=a.atkInterval;const dmg=basicDamage(a.atk,b.def);b.hp=Math.max(0,b.hp-dmg);floatText(b.x,b.y-35,`-${dmg}`,isPlayer?'':'dmg-to-player');fx(a.x,a.y,'#e8bb7e',12,b.x,b.y);}}
 if(p.hp<=0||e.hp<=0){arena.active=false;const win=e.hp<=0&&p.hp>0;arena.result=win?'win':'lose';player.honor+=win?15:5;if(win)player.gold+=20;log(win?'대련 승리! +15 명예 · +20G':'대련 패배 · +5 명예',win?'levelup':'dmg-to-player');el.pvpResult.classList.remove('hidden');el.pvpResult.innerHTML=`<div class="pvp-result-title ${win?'win':'lose'}">${win?'🏆 승리!':'다음에는 이길 수 있어요'}</div><p>사냥터로 돌아가면 입장 전 체력과 마나가 유지됩니다.</p><button id="pvpRetryBtn" class="primary">다시 도전</button>`;$('pvpRetryBtn').addEventListener('click',startArenaDuel);saveGame();}}
function switchMode(next){if(!player||next===mode)return;if(next==='pvp'){if(!player.alive){log('부활 후 아레나에 입장해주세요.');return;}arena.snapshot=captureHuntState();autoHunting=false;manualDestination=null;player.target=null;mode='pvp';startArenaDuel();}else{const snapshot=arena.snapshot;mode='hunt';arena.active=false;if(snapshot){Object.assign(player,snapshot);player.respawnAt=clock+snapshot.respawnRemaining;delete player.respawnRemaining;}arena.snapshot=null;player.target=null;el.pvpResult.classList.add('hidden');log('사냥터로 돌아왔습니다. 입장 전 체력과 마나를 유지합니다.');}
 el.tabBtns.forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));el.autoBtn.classList.toggle('hidden',mode==='pvp');el.zoneSelect.classList.toggle('hidden',mode==='pvp');el.zoneName.classList.toggle('hidden',mode==='hunt');syncAutoButton();renderInventory();renderEquipPanel();updateHud();saveGame();}
el.tabBtns.forEach(b=>b.addEventListener('click',()=>switchMode(b.dataset.mode)));

// ---------- 자동 저장 / 파일 백업 ----------
function saveSnapshot(){const state=mode==='pvp'&&arena.snapshot?arena.snapshot:captureHuntState();return {version:VERSION,savedAt:Date.now(),player:{classId:player.classId,level:player.level,exp:player.exp,gold:player.gold,kills:player.kills,honor:player.honor,equipment:player.equipment,hp:state.hp,mp:state.mp,x:state.x,y:state.y},currentZone,inventory:{...inventory},zoneKills:[...zoneKills],bossWins:[...bossWins]};}
function saveGame(){if(!player)return false;const data=saveSnapshot();savedGame=data;try{localStorage.setItem(SAVE_KEY,JSON.stringify(data));storageAvailable=true;$('saveStatus').textContent=`자동 저장됨 · ${new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}`;return true;}catch{$('saveStatus').textContent='이 브라우저에서는 저장할 수 없습니다. 파일로 내보내세요.';storageAvailable=false;return false;}}
function validateSave(data){
 const int=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 if(!data||data.version!==VERSION||!data.player||!Object.hasOwn(CLASS_DEFS,data.player.classId))throw Error('지원하는 게임 저장 파일이 아닙니다.');
 const p=data.player;
 for(const [k,max] of Object.entries({level:10000,exp:1e12,gold:1e12,kills:1e12,honor:1e12}))if(!int(p[k],k==='level'?1:0,max))throw Error('저장 데이터의 숫자가 올바르지 않습니다.');
 if(p.exp>=expForLevel(p.level)||!Number.isFinite(p.hp)||!Number.isFinite(p.mp)||p.hp<0||p.mp<0||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<24||p.x>W-24||p.y<65||p.y>H-28)throw Error('캐릭터 상태가 올바르지 않습니다.');
 if(!int(data.currentZone,0,ZONES.length-1)||p.level<ZONES[data.currentZone].minLevel)throw Error('사냥터 정보가 올바르지 않습니다.');
 const equipment={weapon:null,armor:null,accessory:null};
 for(const t of EQUIP_TEMPLATES){const it=p.equipment?.[t.slot];if(!it)continue;if(it.slot!==t.slot||it.statKey!==t.statKey||!Object.hasOwn(RARITY,it.rarityKey)||!int(it.statValue,1,1e6)||!int(it.enhanceLevel,0,20)||!int(it.tier,1,10))throw Error('장비 정보가 올바르지 않습니다.');const r=RARITY[it.rarityKey];equipment[t.slot]={id:'saved_'+t.slot,slot:t.slot,name:t.name,icon:t.icon,statKey:t.statKey,statValue:it.statValue,enhanceLevel:it.enhanceLevel,tier:it.tier,rarityKey:r.key,rarityLabel:r.label,rarityColor:r.color};}
 const inv={};for(const icon of Object.keys(ITEM_DEFS)){const n=data.inventory?.[icon]||0;if(!int(n,0,1e9))throw Error('가방 정보가 올바르지 않습니다.');if(n)inv[icon]=n;}
 for(const key of ['zoneKills','bossWins'])if(!Array.isArray(data[key])||data[key].length!==ZONES.length||data[key].some(n=>!int(n,0,1e12)))throw Error('지역 진행 정보가 올바르지 않습니다.');
 return {version:VERSION,player:{classId:p.classId,level:p.level,exp:p.exp,gold:p.gold,kills:p.kills,honor:p.honor,equipment,hp:p.hp,mp:p.mp,x:p.x,y:p.y},currentZone:data.currentZone,inventory:inv,zoneKills:[...data.zoneKills],bossWins:[...data.bossWins]};
}
$('saveBtn').addEventListener('click',()=>{if(saveGame())log('현재 모험을 저장했습니다.');});
$('exportBtn').addEventListener('click',()=>{if(!player)return;saveGame();const blob=new Blob([JSON.stringify(saveSnapshot(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='tamna-adventure-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('importBtn').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>1024*1024)throw Error('저장 파일은 1MB 이하여야 합니다.');const data=validateSave(JSON.parse(await file.text()));if(player&&!window.confirm('현재 모험을 불러온 파일로 교체할까요?'))return;startGame(data.player.classId,data);}catch(err){log('불러오지 못했습니다. '+err.message,'dmg-to-player');}finally{event.target.value='';}});
$('newBtn').addEventListener('click',()=>{saveGame();autoHunting=false;syncAutoButton();el.classSelect.classList.remove('hidden');$('continueBtn').classList.remove('hidden');$('continueBtn').textContent='현재 모험으로 돌아가기';});
$('continueBtn').addEventListener('click',()=>{if(player){el.classSelect.classList.add('hidden');return;}if(savedGame)startGame(savedGame.player.classId,validateSave(savedGame));});
window.addEventListener('pagehide',saveGame);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveGame();lastTs=null;});

// ---------- 캔버스 연출 ----------
function drawLandscape(){
 const z=ZONES[currentZone],arenaMode=mode==='pvp';const palette=[['#3c5a4c','#243c35'],['#305563','#1f3e48'],['#38394a','#232334'],['#465b70','#293e51'],['#3d5862','#263c49'],['#573a32','#302725'],['#314956','#1d303e'],['#344f3a','#23362b'],['#4c4156','#302a3c'],['#4d4d65','#302f46']][currentZone];const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,arenaMode?'#293044':palette[0]);g.addColorStop(1,arenaMode?'#192332':palette[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle=currentZone<2&&!arenaMode?'#476456':'#47505b';ctx.globalAlpha=.45;ctx.beginPath();ctx.moveTo(0,180);ctx.quadraticCurveTo(120,25,235,145);ctx.quadraticCurveTo(370,-50,530,135);ctx.quadraticCurveTo(620,50,720,125);ctx.lineTo(720,0);ctx.lineTo(0,0);ctx.fill();ctx.globalAlpha=1;
 ctx.strokeStyle='rgba(211,194,149,.07)';ctx.lineWidth=62;ctx.beginPath();ctx.moveTo(-30,420);ctx.bezierCurveTo(230,230,350,380,750,70);ctx.stroke();
 for(let i=0;i<40;i++){const x=(i*157+23)%720,y=100+(i*83)%350;ctx.fillStyle=i%3===0?'rgba(150,183,144,.18)':'rgba(214,201,169,.12)';ctx.beginPath();ctx.ellipse(x,y,3+i%3,2,0,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle='#d7d9c7';ctx.font='12px sans-serif';ctx.textAlign='left';if(window.innerWidth>850)ctx.fillText(arenaMode?'AI 모의 아레나 · 사냥터 체력 보존':`${z.name}  /  지역 ${currentZone+1}`,22,30);
 if(arenaMode){ctx.strokeStyle='rgba(222,195,143,.2)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(W/2,H/2,260,170,0,0,Math.PI*2);ctx.stroke();}
}
function drawMonsterSprite(e,bob){
 ctx.save();ctx.translate(e.x,e.y+bob);ctx.lineWidth=2;ctx.strokeStyle='#192b2b';
 const oval=(x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();};
 const polygon=(pts,color)=>{ctx.fillStyle=color;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
 const eyes=(y=0)=>{oval(-6,y,2.5,3,'#fff1c4');oval(6,y,2.5,3,'#fff1c4');oval(-5,y,1.2,2,'#20312d');oval(7,y,1.2,2,'#20312d');};
 const stone=(color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(-18,-20,36,35,7);ctx.fill();ctx.fillRect(-29,-11,9,24);ctx.fillRect(20,-11,9,24);ctx.fillRect(-15,12,12,10);ctx.fillRect(4,12,12,10);eyes(-6);ctx.strokeStyle='#c5c3a780';ctx.beginPath();ctx.moveTo(-8,5);ctx.lineTo(7,7);ctx.stroke();};
 const ghost=(color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,-5,20,Math.PI,0);ctx.lineTo(20,18);ctx.lineTo(10,12);ctx.lineTo(0,18);ctx.lineTo(-10,12);ctx.lineTo(-20,18);ctx.closePath();ctx.fill();eyes(-3);};
 const beast=(color)=>{oval(0,3,22,14,color);oval(-10,-7,16,15,color);polygon([[-24,-14],[-24,-27],[-12,-18]],color);polygon([[-7,-18],[2,-27],[4,-10]],color);ctx.fillStyle=color;ctx.fillRect(-18,12,7,11);ctx.fillRect(8,12,7,11);eyes(-8);};
 const dragon=(color)=>{ctx.strokeStyle=color;ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(-25,17);ctx.bezierCurveTo(40,25,-25,-12,18,-17);ctx.stroke();oval(18,-17,14,10,color);polygon([[8,-23],[8,-35],[18,-25]],'#d4c188');oval(23,-20,2.5,2.5,'#fff0c8');ctx.strokeStyle='#d4c188';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(27,-14);ctx.lineTo(39,-9);ctx.stroke();};
 if(e.boss){ctx.scale(1.45,1.45);stone(currentZone===0?'#8d8c68':e.color);polygon([[-16,-18],[-24,-34],[-3,-22]],'#d5bf83');polygon([[3,-22],[24,-34],[16,-18]],'#d5bf83');ctx.fillStyle='#d9bd7b';ctx.fillRect(-18,6,36,6);ctx.restore();return;}
 const v=e.variant;
 if(currentZone===0&&v===0){ctx.strokeStyle='#c59a7b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(14,4);ctx.bezierCurveTo(38,-15,44,28,29,19);ctx.stroke();oval(0,4,22,15,'#b89b77');oval(-12,-3,14,12,'#c2a781');oval(-17,-14,8,8,'#c2a781');oval(-17,-14,4,4,'#d6b4a0');oval(-17,-5,2,2,'#1b2c2a');oval(-26,1,3,3,'#775659');}
 else if(currentZone===0&&v===1){ctx.fillStyle='#e1ccb2';ctx.beginPath();ctx.roundRect(-10,-3,20,25,6);ctx.fill();ctx.fillStyle='#c36b73';ctx.beginPath();ctx.ellipse(0,-7,27,20,0,Math.PI,0);ctx.lineTo(27,-3);ctx.lineTo(-27,-3);ctx.closePath();ctx.fill();oval(-12,-14,5,4,'#f1d5b5');oval(8,-19,4,3,'#f1d5b5');eyes(9);}
 else if(currentZone===0){polygon([[-23,20],[-18,-14],[0,-29],[18,-14],[23,20]],'#657358');oval(0,-5,13,10,'#263d35');eyes(-5);ctx.strokeStyle='#c9c2a3';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(24,13);ctx.lineTo(30,-12);ctx.stroke();ctx.strokeStyle='#9c814e';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(19,7);ctx.lineTo(31,10);ctx.stroke();}
 else if(currentZone===1&&v===0){for(const dir of [-1,1]){ctx.strokeStyle='#ce956d';ctx.lineWidth=4;for(let j=0;j<3;j++){ctx.beginPath();ctx.moveTo(dir*10,j*5);ctx.lineTo(dir*29,j*9-6);ctx.stroke();}oval(dir*26,-17,9,9,'#ce956d');}oval(0,0,23,16,'#bd835c');eyes(-5);}
 else if((currentZone===1&&v===1)||(currentZone===4&&v===2)){ghost(currentZone===1?'#91c6cb':'#9a9ebf');}
 else if(currentZone===2&&v===0){polygon([[-4,1],[-36,-24],[-34,7],[-19,0],[-14,18],[0,6]],'#90829e');polygon([[4,1],[36,-24],[34,7],[19,0],[14,18],[0,6]],'#90829e');oval(0,0,10,17,'#665e79');eyes(-3);}
 else if(currentZone===2&&v===2||currentZone===6&&v===1||currentZone===7&&v===2){beast(e.color);}
 else if(currentZone===3&&v===0){ctx.strokeStyle='#c4dfeb';ctx.lineWidth=4;for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-26);ctx.moveTo(0,-15);ctx.lineTo(-7,-20);ctx.moveTo(0,-15);ctx.lineTo(7,-20);ctx.stroke();ctx.restore();}oval(0,0,8,8,'#b4dae4');}
 else if(currentZone===3&&v===1||currentZone===6&&v!==1){ctx.strokeStyle=e.color;ctx.lineWidth=5;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(i%2?4:-4,-15+i*14,22-i*3,5,0,0,Math.PI*1.8);ctx.stroke();}}
 else if(currentZone===4&&v===0||currentZone===9&&v===2){dragon(e.color);}
 else if(currentZone===4&&v===1||currentZone===9&&v===0){beast('#cabfa0');ctx.strokeStyle='#eee0b5';ctx.lineWidth=3;for(const d of [-1,1]){ctx.beginPath();ctx.moveTo(d*10-10,-17);ctx.lineTo(d*14-10,-35);ctx.lineTo(d*23-10,-39);ctx.moveTo(d*14-10,-30);ctx.lineTo(d*4-10,-34);ctx.stroke();}}
 else if(currentZone===5&&v===1){polygon([[-24,18],[-21,-5],[-7,1],[0,-32],[12,-8],[19,-18],[26,12],[14,23],[-9,26]],'#d7874f');polygon([[-9,19],[0,-4],[12,18]],'#f1ce7e');}
 else if(currentZone===5&&v===0){dragon('#ac8064');}
 else if(currentZone===7&&v!==2){ctx.fillStyle='#8c7353';ctx.fillRect(-8,-7,16,31);for(const [x,y] of [[-14,-11],[14,-11],[0,-27]])oval(x,y,19,19,v===0?'#709470':'#678665');eyes(-3);}
 else if(currentZone===8){stone(e.color);polygon([[-14,0],[0,-7],[15,0],[12,18],[0,27],[-12,18]],'#9b956a');ctx.strokeStyle='#d9c894';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(0,19);ctx.moveTo(-8,6);ctx.lineTo(8,6);ctx.stroke();}
 else stone(currentZone===3?'#b3c9cf':e.color);
 ctx.restore();
}
function drawEntity(e,isPlayer=false){
 if(!e.alive)return;const bob=!reducedMotion&&e.moving?Math.sin(clock*12)*3:0;ctx.save();ctx.globalAlpha=e.hitUntil>clock?.65:1;
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(e.x,e.y+19,e.boss?32:23,8,0,0,Math.PI*2);ctx.fill();
 if(e.classId){const rendered=window.TamnaCharacters3D?.draw(ctx,e,clock,reducedMotion);if(!rendered){const img=getPortrait(e.classId),size=72;if(img.complete&&img.naturalWidth>0)ctx.drawImage(img,e.x-size/2,e.y-size+22+bob,size,size);else{ctx.font='34px sans-serif';ctx.textAlign='center';ctx.fillText(CLASS_DEFS[e.classId].icon,e.x,e.y+bob);}}}
 else{drawMonsterSprite(e,bob);}
 const bw=e.boss?90:58,by=e.y-(e.classId?(window.TamnaCharacters3D?.available?105:65):e.boss?48:37);ctx.fillStyle='#111d21';ctx.fillRect(e.x-bw/2,by,bw,5);ctx.fillStyle=isPlayer?'#9cc89a':e.boss?'#e5b669':'#cd8580';ctx.fillRect(e.x-bw/2,by,bw*clamp(e.hp/e.maxHp,0,1),5);ctx.fillStyle='#f1ebd9';ctx.font=e.boss?'bold 12px sans-serif':'11px sans-serif';ctx.textAlign='center';ctx.fillText(e.classId?`Lv.${e.level} ${isPlayer?CLASS_DEFS[e.classId].name:e.name}`:e.name,clamp(e.x,75,W-75),by-7);ctx.restore();
}
function render(){drawLandscape();const entities=mode==='hunt'?[...monsters,player]:[player,arena.enemy].filter(Boolean);entities.sort((a,b)=>a.y-b.y).forEach(e=>drawEntity(e,e===player));if(mode==='hunt'&&player.target?.alive){ctx.strokeStyle='#edcd88';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(player.target.x,player.target.y+18,30,10,0,0,Math.PI*2);ctx.stroke();}for(const e of effects){ctx.save();ctx.globalAlpha=e.life/e.maxLife;ctx.strokeStyle=e.color;ctx.lineWidth=3;ctx.beginPath();if(e.x2!==null){ctx.moveTo(e.x,e.y);ctx.lineTo(e.x2,e.y2);}else ctx.arc(e.x,e.y,e.radius*(1-e.life/e.maxLife)+8,0,Math.PI*2);ctx.stroke();ctx.restore();}if(!player.alive&&mode==='hunt'){ctx.fillStyle='#101b23a8';ctx.fillRect(0,0,W,H);ctx.fillStyle='#f3e6c5';ctx.font='20px sans-serif';ctx.textAlign='center';ctx.fillText(`${Math.max(1,Math.ceil(player.respawnAt-clock))}초 뒤 부활합니다`,W/2,H/2);}}
function renderSkillRow(){const s=CLASS_DEFS[player.classId].skill;el.skillRow.innerHTML=`<div class="skill-slot">${s.icon}</div><div class="skill-info">${s.name}<div class="skill-cost">MP ${s.manaCost} · <span id="skillState"></span></div></div>`;}
function updateHud(){if(!player)return;$('combatHud').innerHTML=`<span>Lv.${player.level} ${CLASS_DEFS[player.classId].name}</span><span class="compact-hp">HP ${Math.ceil(player.hp)} / ${player.maxHp}</span><span class="compact-mp">MP ${Math.ceil(player.mp)} / ${player.maxMp}</span>`;el.lvText.textContent=player.level;for(const key of ['hp','mp','exp']){const max=player['max'+key[0].toUpperCase()+key.slice(1)];el[key+'Fill'].style.width=clamp(player[key]/max*100,0,100)+'%';el[key+'Text'].textContent=`${Math.ceil(player[key])} / ${max}`;}for(const [id,key] of [['statAtk','atk'],['statDef','def'],['statGold','gold'],['statKills','kills'],['statHonor','honor']])el[id].textContent=player[key].toLocaleString('ko-KR');const s=CLASS_DEFS[player.classId].skill;$('skillState').textContent=player.skillCooldown>0?`${player.skillCooldown.toFixed(1)}초`:player.mp<s.manaCost?'마나 회복 중':'사용 가능';$('fieldTitle').textContent=mode==='hunt'?ZONES[currentZone].name:'환영의 아레나';$('zoneTier').textContent=mode==='hunt'?`지역 ${currentZone+1}`:'AI 대련';const bossActive=monsters.some(m=>m.boss&&m.alive);$('questText').textContent=mode==='pvp'?'대련을 마친 뒤 사냥터로 돌아가 모험을 계속하세요.':bossActive?'보스가 등장했습니다. 집중 공격하고 물약을 활용하세요.':zoneKills[currentZone]<12?`이 지역 ${Math.min(12,zoneKills[currentZone])}/12마리 처치 → 보스 도전 해금`:`보스 도전 가능 · 지금까지 ${bossWins[currentZone]}회 격파`;$('bossBtn').disabled=mode!=='hunt'||!player.alive||zoneKills[currentZone]<12||bossActive;$('skillBtn').disabled=mode!=='hunt'||!player.alive;el.autoBtn.disabled=!player.alive;el.zoneSelect.disabled=!player.alive;$('fieldHint').textContent=mode==='pvp'?'대련 중 가방과 강화는 잠깁니다. 사냥터로 돌아가면 입장 전 상태가 유지됩니다.':'빈 바닥을 눌러 이동 · 몬스터를 눌러 집중 공격 · 사냥 중지 후 안전한 곳에서 체력 회복';}
function tick(now){if(!document.hidden&&el.classSelect.classList.contains('hidden')&&player&&!previewOpen){const dt=lastTs===null?0:clamp((now-lastTs)/1000,0,.1);clock+=dt;if(mode==='hunt')huntTick(dt);else arenaTick(dt);effects=effects.filter(e=>(e.life-=dt)>0);render();hudElapsed+=dt;if(hudElapsed>=.1){updateHud();hudElapsed=0;}if(clock-lastSave>=5){saveGame();lastSave=clock;}}if(previewOpen&&!document.hidden)renderModelPreview(now/1000);lastTs=now;requestAnimationFrame(tick);}
function renderModelPreview(time){
 previewCtx.clearRect(0,0,560,540);const gradient=previewCtx.createRadialGradient(280,260,20,280,260,320);gradient.addColorStop(0,'#35515a');gradient.addColorStop(1,'#17262f');previewCtx.fillStyle=gradient;previewCtx.fillRect(0,0,560,540);previewCtx.fillStyle='#0c1a2288';previewCtx.beginPath();previewCtx.ellipse(280,461,112,25,0,0,Math.PI*2);previewCtx.fill();
 const angle=previewAngle+(previewSpin&&!reducedMotion?(time-previewSpinStart)*.35:0);const fake={classId:previewId,x:280,y:440,atkCooldown:0,atkInterval:1,moving:false};const rendered=window.TamnaCharacters3D?.draw(previewCtx,fake,time,reducedMotion,{preview:true,width:345,x:280,y:476,angle});
 if(!rendered){const img=getPortrait(previewId);if(img.complete&&img.naturalWidth>0)previewCtx.drawImage(img,120,100,320,320);previewCtx.fillStyle='#eeeadd';previewCtx.textAlign='center';previewCtx.font='16px sans-serif';previewCtx.fillText('이 기기에서는 원본 이미지를 표시합니다.',280,510);}
}
function setModelPreview(id){previewId=id;previewAngle=.2;previewSpinStart=performance.now()/1000;$('modelTitle').textContent=CLASS_DEFS[id].name+' · 3D';document.querySelectorAll('[data-preview-class]').forEach(button=>button.classList.toggle('active',button.dataset.previewClass===id));}
function closeModelPreview(){previewOpen=false;$('modelDialog').classList.add('hidden');document.body.classList.remove('preview-open');lastTs=null;previewPreviousFocus?.focus();}
$('modelPreviewBtn').addEventListener('click',()=>{if(!player)return;previewPreviousFocus=document.activeElement;previewOpen=true;saveGame();setModelPreview(player.classId);$('modelDialog').classList.remove('hidden');document.body.classList.add('preview-open');$('closeModelBtn').focus();});
$('closeModelBtn').addEventListener('click',closeModelPreview);
$('modelDialog').addEventListener('click',event=>{if(event.target===$('modelDialog'))closeModelPreview();});
document.addEventListener('keydown',event=>{if(!previewOpen)return;if(event.key==='Escape'){closeModelPreview();return;}if(event.key==='Tab'){const focusable=[...$('modelDialog').querySelectorAll('button')],index=focusable.indexOf(document.activeElement);if(event.shiftKey&&index===0){event.preventDefault();focusable.at(-1).focus();}else if(!event.shiftKey&&index===focusable.length-1){event.preventDefault();focusable[0].focus();}}});
$('autoRotateBtn').addEventListener('click',()=>{const now=performance.now()/1000;if(previewSpin&&!reducedMotion)previewAngle+=(now-previewSpinStart)*.35;previewSpinStart=now;previewSpin=!previewSpin;$('autoRotateBtn').textContent=previewSpin?'자동 회전 켜짐':'자동 회전 꺼짐';$('autoRotateBtn').setAttribute('aria-pressed',String(previewSpin));});
$('rotateLeftBtn').addEventListener('click',()=>previewAngle-=.4);$('rotateRightBtn').addEventListener('click',()=>previewAngle+=.4);
let dragX=null;previewCanvas.addEventListener('pointerdown',event=>{dragX=event.clientX;previewCanvas.setPointerCapture(event.pointerId);});previewCanvas.addEventListener('pointermove',event=>{if(dragX===null)return;previewAngle+=(event.clientX-dragX)*.012;dragX=event.clientX;});for(const type of ['pointerup','pointercancel','lostpointercapture'])previewCanvas.addEventListener(type,()=>dragX=null);
Object.values(CLASS_DEFS).forEach(c=>{const button=document.createElement('button');button.textContent=c.name;button.dataset.previewClass=c.id;button.addEventListener('click',()=>setModelPreview(c.id));$('modelChoices').appendChild(button);});
const has3D=window.TamnaCharacters3D?.ready();$('modelStatus').textContent=has3D?'실시간 3D 모델 · 걷기와 공격 동작':'3D를 사용할 수 없어 원본 이미지로 표시합니다.';
buildClassCards();
try{const raw=localStorage.getItem(SAVE_KEY);if(raw){savedGame=validateSave(JSON.parse(raw));$('continueBtn').classList.remove('hidden');$('continueBtn').textContent=`Lv.${savedGame.player.level} ${CLASS_DEFS[savedGame.player.classId].name} · 이어하기`;}}catch(err){$('selectNotice').textContent='저장 데이터를 읽지 못했습니다. 새 모험을 시작하거나 보관한 파일을 불러오세요.';}
