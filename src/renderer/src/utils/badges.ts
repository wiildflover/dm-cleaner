import { DISCORD_BADGES, BADGE_IMAGES } from '../constants/badges'

export const getBadges = (flags?: number, premiumType?: number, premiumSince?: string) => {
    const badges: Array<{ name: string; image: string }> = []

    // Only show Early Supporter badge
    if (flags && (flags & DISCORD_BADGES.PREMIUM_EARLY_SUPPORTER)) {
        badges.push({ name: 'Early Supporter', image: BADGE_IMAGES.earlySupporter })
    }

    return badges
}
