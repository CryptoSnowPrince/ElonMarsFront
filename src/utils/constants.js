export const unitTypes = [
    "tank",
    "earth"
];

export const spellTypes = [
    "laser",
    "double-shot",
    "bless",
    "poison",
];


export const unitTypesDetail = {
    "tank": {health: 500, attack: 0, isBattle: false},
    "earth": {health: 250, attack: 50, isBattle: true},
}

export const spellTypesDetail = {
    "laser":       {damage: [150],          health: 0,              bonus: [0],   randMax: 0, },
    "double-shot": {damage: [100],          health: 0,              bonus: [15],  randMax: 0, },
    "bless":       {damage: [50, 75, 100],  health: [50, 80, 110], bonus: [0],   randMax: 0, },
    "poison":      {damage: [50],           health: 0,              bonus: [20],  randMax: 0, }};

export const getUnitHealth = (type) => {
    if(unitTypesDetail[type]) return unitTypesDetail[type].health;
    return 500;
}

export const getUnitDamage = (type) => {
    let damage = 0;
    let isBattle = false;

    if(unitTypesDetail[type]) {
        damage = unitTypesDetail[type].attack;
        isBattle = unitTypesDetail[type].isBattle;
    }

    return {damage: damage, isBattle: isBattle};
}

export const IS_TEST_MODE = true;