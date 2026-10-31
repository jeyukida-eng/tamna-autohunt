// 클래스(직업) 정의 — 제육이다 브랜드 캐릭터 기반
const CLASS_DEFS = {
  jeyukje: {
    id: "jeyukje", name: "제육황제", icon: "👑", portrait: "assets/jeyukje.png", color: "#e3a94a",
    desc: "리더십과 맷집으로 버티는 근접 밸런스형. 탐나국을 유랑하는 돼지 임금님.",
    baseHp: 64, baseMp: 20, baseAtk: 7, baseDef: 4,
    range: 36, atkInterval: 0.8, speed: 95,
    hpPerLv: 15, mpPerLv: 3, atkPerLv: 2.1, defPerLv: 1.4,
    skill: { name: "황제의 일격", icon: "👑", manaCost: 8, cooldown: 4.0, power: 2.2, kind: "single" },
  },
  mongdol: {
    id: "mongdol", name: "몽돌이", icon: "🪨", portrait: "assets/mongdol.png", color: "#5b5b66",
    desc: "체력은 낮지만 무거운 돌의 기운으로 넓게 내리찍는 원거리 마법형.",
    baseHp: 40, baseMp: 54, baseAtk: 10, baseDef: 1,
    range: 120, atkInterval: 1.05, speed: 82,
    hpPerLv: 9, mpPerLv: 7, atkPerLv: 2.8, defPerLv: 0.6,
    skill: { name: "몽돌낙석", icon: "🪨", manaCost: 16, cooldown: 5.0, power: 2.6, aoe: 135, kind: "aoe" },
  },
  sorang: {
    id: "sorang", name: "소랑이", icon: "🌸", portrait: "assets/sorang.png", color: "#6fe0c8",
    desc: "빠른 몸놀림과 치유의 꽃을 다루는 서포터형. 스스로를 치유하며 싸운다.",
    baseHp: 48, baseMp: 36, baseAtk: 6, baseDef: 2,
    range: 70, atkInterval: 0.6, speed: 105,
    hpPerLv: 11, mpPerLv: 5, atkPerLv: 1.7, defPerLv: 1.0,
    skill: { name: "꽃의 축복", icon: "🌸", manaCost: 14, cooldown: 7.0, healPercent: 0.35, kind: "heal" },
  },
  soradaegam: {
    id: "soradaegam", name: "소라대감", icon: "🐚", portrait: "assets/soradaegam.png", color: "#e2854a",
    desc: "그물과 황금 갈고리를 다루는 원거리 공격형. 빠른 공격과 긴 사거리가 강점.",
    baseHp: 46, baseMp: 28, baseAtk: 8, baseDef: 2,
    range: 95, atkInterval: 0.6, speed: 92,
    hpPerLv: 10, mpPerLv: 4, atkPerLv: 2.0, defPerLv: 0.9,
    skill: { name: "황금갈고리", icon: "🪝", manaCost: 11, cooldown: 4.5, power: 2.0, kind: "single" },
  },
  banddeukdaewang: {
    id: "banddeukdaewang", name: "반듯대왕", icon: "📏", portrait: "assets/banddeukdaewang.png", color: "#4a4a52",
    desc: "묵직한 돌의 몸과 황금 자로 무장한 탱커형. 체력과 방어력으로 전선을 지킨다.",
    baseHp: 78, baseMp: 16, baseAtk: 6, baseDef: 7,
    range: 40, atkInterval: 0.95, speed: 78,
    hpPerLv: 19, mpPerLv: 2, atkPerLv: 1.6, defPerLv: 2.0,
    skill: { name: "눈금 심판", icon: "📐", manaCost: 10, cooldown: 5.5, power: 2.0, kind: "single" },
  },
};

// 직업별 액티브 4종: Lv.1 / Lv.3 / Lv.7 / Lv.12 해금.
const CLASS_SKILLS={
 jeyukje:[
 {id:'emperor_strike',name:'황제의 일격',icon:'👑',unlock:1,manaCost:5,cooldown:4,power:2.1,kind:'single',effect:'imperial',color:'#ffd478',desc:'황금 참격으로 단일 적 강타'},
 {id:'royal_cleave',name:'황금 회오리',icon:'⚔️',unlock:3,manaCost:9,cooldown:8,power:1.7,aoe:125,kind:'aoe',effect:'cleave',color:'#ffbd59',desc:'목표 주변을 베는 광역 참격'},
 {id:'royal_guard',name:'황제의 가호',icon:'🛡️',unlock:7,manaCost:12,cooldown:18,kind:'shield',shieldPercent:.32,duration:7,effect:'shield',color:'#ffe2a2',desc:'7초 동안 최대 체력 32%의 보호막'},
 {id:'royal_verdict',name:'탐나 황룡강림',icon:'🐉',unlock:12,manaCost:24,cooldown:25,power:3.6,aoe:180,kind:'aoe',stun:1.2,effect:'dragon',color:'#ffd37c',ultimate:true,desc:'황룡의 심판 · 광역 피해와 1.2초 기절'},
 ],
 mongdol:[
 {id:'stone_fall',name:'몽돌낙석',icon:'🪨',unlock:1,manaCost:8,cooldown:5,power:2.2,aoe:135,kind:'aoe',effect:'meteor',color:'#c1a0ef',desc:'낙석으로 목표 주변 광역 공격'},
 {id:'basalt_chain',name:'현무암 뇌격',icon:'⚡',unlock:3,manaCost:11,cooldown:8,power:1.5,chain:4,chainRange:155,kind:'chain',effect:'lightning',color:'#a2d8ff',desc:'주변 적 최대 4마리에게 연쇄 번개'},
 {id:'frozen_rock',name:'빙결 돌무리',icon:'❄️',unlock:7,manaCost:15,cooldown:13,power:1.9,aoe:155,slow:4,kind:'aoe',effect:'frost',color:'#a5efff',desc:'광역 피해 · 4초 동안 적 이동 속도 45% 감소'},
 {id:'volcano_rain',name:'한라 화산우',icon:'🌋',unlock:12,manaCost:29,cooldown:25,power:4.1,aoe:195,kind:'aoe',effect:'volcano',color:'#ff9864',ultimate:true,desc:'불타는 운석과 대형 충격파'},
 ],
 sorang:[
 {id:'flower_blessing',name:'꽃의 축복',icon:'🌸',unlock:1,manaCost:6,cooldown:7,healPercent:.35,kind:'heal',effect:'petals',color:'#a3efbc',desc:'최대 체력 35% 회복'},
 {id:'petal_arrows',name:'꽃잎 유성',icon:'🌺',unlock:3,manaCost:8,cooldown:6,power:1.6,chain:3,chainRange:140,kind:'chain',effect:'petals',color:'#ffb4df',desc:'꽃잎으로 최대 3마리 연쇄 공격'},
 {id:'spring_breeze',name:'봄바람의 춤',icon:'🍃',unlock:7,manaCost:12,cooldown:17,kind:'haste',duration:8,healPercent:.12,effect:'wind',color:'#9fe8d6',desc:'8초간 공격 속도 25% 증가 · 체력 12% 회복'},
 {id:'lotus_garden',name:'천상의 연꽃정원',icon:'🪷',unlock:12,manaCost:23,cooldown:24,power:3.0,aoe:180,healPercent:.2,kind:'aoe',effect:'lotus',color:'#ffc3e2',ultimate:true,desc:'연꽃 결계 광역 공격 · 체력 20% 회복'},
 ],
 soradaegam:[
 {id:'golden_hook',name:'황금갈고리',icon:'🪝',unlock:1,manaCost:5,cooldown:4.5,power:2.0,pull:50,kind:'single',effect:'hook',color:'#ffe19d',desc:'단일 적을 공격하고 50 거리 끌어오기'},
 {id:'tidal_surge',name:'해일 가르기',icon:'🌊',unlock:3,manaCost:10,cooldown:8,power:1.9,aoe:145,slow:3,kind:'aoe',effect:'wave',color:'#83def5',desc:'밀려오는 해일 · 광역 공격과 둔화'},
 {id:'pearl_barrier',name:'진주의 결계',icon:'🫧',unlock:7,manaCost:12,cooldown:18,kind:'shield',shieldPercent:.3,duration:8,effect:'shield',color:'#9decef',desc:'8초 동안 최대 체력 30% 보호막'},
 {id:'sea_dragon',name:'용왕의 행차',icon:'🐲',unlock:12,manaCost:25,cooldown:25,power:3.4,chain:6,chainRange:190,kind:'chain',effect:'dragon',color:'#80eced',ultimate:true,desc:'푸른 용의 궤적 · 최대 6마리 연쇄 공격'},
 ],
 banddeukdaewang:[
 {id:'ruler_verdict',name:'눈금 심판',icon:'📐',unlock:1,manaCost:5,cooldown:5.5,power:2.2,kind:'single',effect:'rune',color:'#ffe6a1',desc:'황금 눈금자로 단일 적 심판'},
 {id:'basalt_quake',name:'돌기둥 지진',icon:'🗿',unlock:3,manaCost:8,cooldown:9,power:1.8,aoe:135,stun:.7,kind:'aoe',effect:'quake',color:'#d8c793',desc:'광역 지진 · 0.7초 기절'},
 {id:'iron_measure',name:'불굴의 돌갑옷',icon:'🛡️',unlock:7,manaCost:10,cooldown:18,kind:'shield',shieldPercent:.42,duration:8,effect:'shield',color:'#e5d6aa',desc:'8초 동안 최대 체력 42% 보호막'},
 {id:'absolute_verdict',name:'절대영역 · 천지심판',icon:'⚖️',unlock:12,manaCost:20,cooldown:26,power:3.4,aoe:185,stun:1.5,kind:'aoe',effect:'judgement',color:'#ffda7a',ultimate:true,desc:'거대한 심판진 · 광역 피해와 1.5초 기절'},
 ],
};
for(const [id,skills] of Object.entries(CLASS_SKILLS)){CLASS_DEFS[id].skills=skills;CLASS_DEFS[id].skill=skills[0];}
