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
