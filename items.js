// 10개 지역 × 6개 부위 × 3개 특성 = 고유 장비 180종.
const RARITY = {
 normal:{key:'normal',label:'일반',color:'#bbc6c3',mult:1},
 magic:{key:'magic',label:'고급',color:'#78bbed',mult:1.5},
 rare:{key:'rare',label:'희귀',color:'#bd95ef',mult:2.2},
 epic:{key:'epic',label:'영웅',color:'#f0bd63',mult:3.1},
 legendary:{key:'legendary',label:'전설',color:'#fa8775',mult:4.2},
};
const EQUIP_TEMPLATES=[
 {slot:'weapon',name:'무기',icon:'⚔️',baseStat:3,statKey:'atk'},
 {slot:'armor',name:'갑옷',icon:'🥋',baseStat:2,statKey:'def'},
 {slot:'helmet',name:'투구',icon:'🪖',baseStat:1,statKey:'def'},
 {slot:'boots',name:'신발',icon:'🥾',baseStat:1,statKey:'def'},
 {slot:'ring',name:'반지',icon:'💍',baseStat:1,statKey:'atk'},
 {slot:'accessory',name:'부적',icon:'📿',baseStat:9,statKey:'hp'},
];
let equipmentSequence=0;
const GEAR_THEMES=['들꽃','몽돌','흑요','서리바람','백록','용암심장','폭풍물결','천년숲','왕실봉인','태초의 신'];
const GEAR_VARIANTS={
 weapon:[{name:'결투검',bonus:'critChance',amount:.025,desc:'치명타로 결정타를 노리는 검'},{name:'마도봉',bonus:'skillPower',amount:.07,desc:'스킬의 위력을 키우는 마도구'},{name:'갈고리창',bonus:'lifesteal',amount:.018,desc:'가한 피해 일부를 회복하는 창'}],
 armor:[{name:'수호갑옷',bonus:'hp',amount:7,desc:'체력을 보강하는 중갑'},{name:'순환로브',bonus:'manaRegen',amount:.10,desc:'마나를 끌어모으는 마법 의복'},{name:'그림자도복',bonus:'dodgeChance',amount:.015,desc:'적의 공격을 피하는 가벼운 도복'}],
 helmet:[{name:'선견의 관',bonus:'skillPower',amount:.045,desc:'주문의 힘을 끌어내는 관'},{name:'불굴의 투구',bonus:'hp',amount:5,desc:'긴 전투를 버티는 투구'},{name:'명상의 두건',bonus:'mp',amount:4,desc:'사용 가능한 마나를 늘리는 두건'}],
 boots:[{name:'질풍장화',bonus:'moveSpeed',amount:.045,desc:'적을 향해 빠르게 이동하는 장화'},{name:'안개신',bonus:'dodgeChance',amount:.02,desc:'공격의 궤적을 비껴가는 신발'},{name:'순환각반',bonus:'manaRegen',amount:.08,desc:'전투 중 마나 회복을 돕는 각반'}],
 ring:[{name:'매의 반지',bonus:'critChance',amount:.025,desc:'치명타의 빈도를 높이는 반지'},{name:'조류반지',bonus:'mp',amount:5,desc:'마나를 담아두는 반지'},{name:'핏빛반지',bonus:'lifesteal',amount:.015,desc:'피해를 체력으로 돌리는 반지'}],
 accessory:[{name:'생명부적',bonus:'def',amount:1,desc:'체력과 방어를 함께 갖춘 부적'},{name:'주술목걸이',bonus:'skillPower',amount:.055,desc:'스킬 중심의 전투에 어울리는 목걸이'},{name:'별빛성물',bonus:'manaRegen',amount:.10,desc:'마나 순환을 돕는 성물'}],
};
const BONUS_LABELS={hp:'추가 체력',mp:'추가 마나',atk:'추가 공격',def:'추가 방어',critChance:'치명타',skillPower:'스킬 위력',lifesteal:'흡혈',dodgeChance:'회피',moveSpeed:'이동 속도',manaRegen:'마나 회복'};
const PERCENT_BONUSES=new Set(['critChance','skillPower','lifesteal','dodgeChance','moveSpeed','manaRegen']);
const EQUIPMENT_CATALOG=GEAR_THEMES.flatMap((theme,zone)=>EQUIP_TEMPLATES.flatMap(t=>GEAR_VARIANTS[t.slot].map((v,index)=>({catalogId:`z${zone+1}_${t.slot}_${index}`,tier:zone+1,slot:t.slot,name:`${theme} ${v.name}`,icon:t.icon,statKey:t.statKey,baseStat:t.baseStat,variant:index,bonusKey:v.bonus,bonusBase:v.amount,desc:v.desc}))));
const GEAR_BY_ID=Object.fromEntries(EQUIPMENT_CATALOG.map(g=>[g.catalogId,g]));
const LOOT_RULES={equipment:.08,dryProtection:35,normal:[['normal',.60],['magic',.29],['rare',.09],['epic',.018],['legendary',.002]],boss:[['rare',.73],['epic',.25],['legendary',.02]]};
function rollRarity(boss=false,rng=Math.random){let r=rng();const table=boss?LOOT_RULES.boss:LOOT_RULES.normal;for(const [key,chance] of table){r-=chance;if(r<0)return RARITY[key];}return RARITY[table.at(-1)[0]];}
function createEquipment(def,rarity=RARITY.normal,enhanceLevel=0){return {id:'eq_'+Date.now().toString(36)+'_'+(++equipmentSequence).toString(36)+'_'+Math.random().toString(36).slice(2,6),catalogId:def.catalogId,tier:def.tier,slot:def.slot,name:def.name,icon:def.icon,statKey:def.statKey,statValue:Math.max(1,Math.round(def.baseStat*(1+(def.tier-1)*2)*rarity.mult)),rarityKey:rarity.key,rarityLabel:rarity.label,rarityColor:rarity.color,enhanceLevel};}
function rollEquipment(levelScale,boss=false){const tier=Math.max(1,Math.min(10,Math.round((levelScale+1)/2))),pool=EQUIPMENT_CATALOG.filter(g=>g.tier===tier);return createEquipment(pool[Math.floor(Math.random()*pool.length)],rollRarity(boss));}
function equippedStatValue(it){return it?it.statValue+it.enhanceLevel*Math.max(1,Math.round(it.statValue*.15)):0;}
function equipmentExtra(it){const d=it&&GEAR_BY_ID[it.catalogId];if(!d)return null;const rank=RARITY[it.rarityKey].mult;const raw=d.bonusBase*(PERCENT_BONUSES.has(d.bonusKey)?1+(d.tier-1)*.09:1+(d.tier-1)*1.5)*(1+(rank-1)*.45)*(1+it.enhanceLevel*.025);return {key:d.bonusKey,value:PERCENT_BONUSES.has(d.bonusKey)?Math.round(raw*10000)/10000:Math.max(1,Math.round(raw))};}
function gearBonusText(it){const bonus=equipmentExtra(it);if(!bonus)return '';return `${BONUS_LABELS[bonus.key]} +${PERCENT_BONUSES.has(bonus.key)?(bonus.value*100).toFixed(1)+'%':bonus.value}`;}
function equipmentScore(it,classId='jeyukje'){if(!it)return 0;const weights={atk:4,def:3,hp:.35,mp:.7,critChance:120,skillPower:classId==='mongdol'||classId==='sorang'?90:65,lifesteal:180,dodgeChance:140,moveSpeed:35,manaRegen:35},extra=equipmentExtra(it);return equippedStatValue(it)*(weights[it.statKey]||1)+(extra?extra.value*(weights[extra.key]||1):0);}
function isUpgrade(current,candidate,classId){return !current||equipmentScore(candidate,classId)>equipmentScore(current,classId)+.01;}
function enhanceCost(it){return Math.round((20+it.enhanceLevel*30)*(1+(it.tier-1)*.25)*(1+(RARITY[it.rarityKey].mult-1)*.3));}
function enhanceSuccessChance(it){return Math.max(.30,.95-it.enhanceLevel*.065);}
function normalizeEquipment(it){if(!it||typeof it!=='object')throw Error('장비 정보가 올바르지 않습니다.');const t=EQUIP_TEMPLATES.find(t=>t.slot===it.slot),r=RARITY[it.rarityKey];if(!t||!Object.hasOwn(RARITY,it.rarityKey)||!r||!Number.isSafeInteger(it.enhanceLevel)||it.enhanceLevel<0||it.enhanceLevel>20||!Number.isSafeInteger(it.tier)||it.tier<1||it.tier>10)throw Error('장비 정보가 올바르지 않습니다.');let out;if(it.catalogId){const d=GEAR_BY_ID[it.catalogId];if(!d||d.slot!==t.slot||d.tier!==it.tier)throw Error('장비 도감 정보가 올바르지 않습니다.');out=createEquipment(d,r,it.enhanceLevel);}else{if(it.statKey!==t.statKey||!Number.isSafeInteger(it.statValue)||it.statValue<1||it.statValue>1e6)throw Error('기존 장비 정보가 올바르지 않습니다.');out={id:'legacy_'+t.slot,slot:t.slot,name:'기존 '+t.name,icon:t.icon,statKey:t.statKey,statValue:it.statValue,tier:it.tier,enhanceLevel:it.enhanceLevel,rarityKey:r.key,rarityLabel:r.label,rarityColor:r.color};}if(typeof it.id==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(it.id))out.id=it.id;return out;}

// 강화는 모든 구간에서 주문서 1장 + 골드가 필요합니다. 확률은 이 게임 자체 설정입니다.
function safeEnhanceLimit(it){return it.slot==='weapon'?6:['armor','helmet','boots'].includes(it.slot)?4:2;}
function enhanceRules(it,scroll='📜'){
 const safe=it.enhanceLevel<safeEnhanceLimit(it),over=Math.max(0,it.enhanceLevel-safeEnhanceLimit(it));
 const chance=safe?1:[.55,.45,.35,.28,.22,.16,.12,.08,.06,.04,.03][Math.min(over,10)];
 return {safe,chance,cost:enhanceCost(it)*(scroll==='🔰'?2:scroll==='✨'?1.5:1),destroyChance:scroll==='🔰'?0:1-chance,scroll,limit:safeEnhanceLimit(it)};
}
