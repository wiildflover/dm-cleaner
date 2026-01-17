// Discord Badge Flags
export const DISCORD_BADGES = {
    STAFF: 1 << 0,
    PARTNER: 1 << 1,
    HYPESQUAD: 1 << 2,
    BUG_HUNTER_LEVEL_1: 1 << 3,
    HYPESQUAD_ONLINE_HOUSE_1: 1 << 6,
    HYPESQUAD_ONLINE_HOUSE_2: 1 << 7,
    HYPESQUAD_ONLINE_HOUSE_3: 1 << 8,
    PREMIUM_EARLY_SUPPORTER: 1 << 9,
    BUG_HUNTER_LEVEL_2: 1 << 14,
    VERIFIED_BOT_DEVELOPER: 1 << 17,
    ACTIVE_DEVELOPER: 1 << 22,
    NITRO: 1 << 2,
} as const

// Badge image imports
export const BADGE_IMAGES = {
    earlySupporter: new URL('../assets/badges/discordearlysupporter.svg', import.meta.url).href
} as const
