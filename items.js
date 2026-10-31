// 장비 아이템 정의 및 강화 로직 — 전부 자체 설정값
const RARITY = {
  normal: { key: "normal", label: "일반", color: "#b9b4c2", mult: 1.0 },
  magic:  { key: "magic",  label: "고급", color: "#5aa0e0", mult: 1.6 },
  rare:   { key: "rare",   label: "희귀", color: "#e0b64f", mult: 2.4 },
};

const EQUIP_TEMPLATES = [
  { slot: "weapon",    name: "무기",   icon: "🗡️", baseStat: 3,  statKey: "atk" },
  { slot: "armor",     name: "갑옷",   icon: "🥋", baseStat: 2,  statKey: "def" },
  { slot: "accessory", name: "장신구", icon: "📿", baseStat: 10, statKey: "hp"  },
];

function rollRarity() {
  const r = Math.random();
  if (r < 0.08) return RARITY.rare;
  if (r < 0.32) return RARITY.magic;
  return RARITY.normal;
}

function rollEquipment(levelScale) {
  const tmpl = EQUIP_TEMPLATES[Math.floor(Math.random() * EQUIP_TEMPLATES.length)];
  const rarity = rollRarity();
  const value = Math.max(1, Math.round(tmpl.baseStat * rarity.mult * levelScale));
  return {
    id: "eq_" + Math.random().toString(36).slice(2, 9),
    slot: tmpl.slot, name: tmpl.name, icon: tmpl.icon,
    statKey: tmpl.statKey, statValue: value,
    rarityKey: rarity.key, rarityLabel: rarity.label, rarityColor: rarity.color,
    enhanceLevel: 0,
  };
}

// 강화 시 적용 스탯 (강화 레벨당 +15%)
function equippedStatValue(item) {
  if (!item) return 0;
  return item.statValue + item.enhanceLevel * Math.max(1, Math.round(item.statValue * 0.15));
}

function enhanceCost(item) {
  return 20 + item.enhanceLevel * 25;
}

function enhanceSuccessChance(item) {
  return Math.max(0.35, 0.95 - item.enhanceLevel * 0.07);
}

// 새 장비가 기존 장비보다 유효 스탯이 높은지 비교
function isUpgrade(current, candidate) {
  if (!current) return true;
  return equippedStatValue(candidate) > equippedStatValue(current);
}
