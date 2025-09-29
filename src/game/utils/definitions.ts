export const Matter = (Phaser.Physics.Matter as any).Matter as typeof MatterJS;

export const COLLISION_CATEGORY = {
    MARBLE: 0x0001,
    WALL: 0x0002,
    BOOSTER: 0x0004,
    GEAR: 0x0008,
    SENSOR: 0x0016,
};

export type CollisionCategory = keyof typeof COLLISION_CATEGORY;

export const COLLISION_FILTER: {
    [K in CollisionCategory]: MatterJS.ICollisionFilter;
} = {
    MARBLE: {
        category: COLLISION_CATEGORY.MARBLE,
        mask: 0xffff,
        group: 0,
    },
    WALL: {
        category: COLLISION_CATEGORY.WALL,
        mask: COLLISION_CATEGORY.MARBLE,
        group: 0,
    },
    BOOSTER: {
        category: COLLISION_CATEGORY.BOOSTER,
        mask: COLLISION_CATEGORY.MARBLE,
        group: 0,
    },
    GEAR: {
        category: COLLISION_CATEGORY.GEAR,
        mask: COLLISION_CATEGORY.MARBLE,
        group: 0,
    },
    SENSOR: {
        category: COLLISION_CATEGORY.SENSOR,
        mask: 0,
        group: 0,
    },
};

export type CollisionPair = {
    bodyA: MatterJS.BodyType;
    bodyB: MatterJS.BodyType;
};

// time.addEventの delay に与える値
export const FPS30 = 1000 / 30;
export const FPS60 = 1000 / 60;

export const COLORFUL = [
    0xff1744, 0xd500f9, 0x3d5afe, 0x00b0ff, 0x1de9b6, 0x76ff03, 0xffea00,
    0xff9100,
];

export const RANKED_EMBLEM = ["first", "second", "third"];

export const SCREEN_W = 1280;
export const SCREEN_H = 720;

