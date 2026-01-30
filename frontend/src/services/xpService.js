import constantsData from '../data/constants.js';

const { levelThresholds } = constantsData;

export function calculateLevel(totalXp) {
  let level = 1;
  const levels = Object.entries(levelThresholds).sort((a, b) => b[1] - a[1]);

  for (const [lvl, threshold] of levels) {
    if (totalXp >= threshold) {
      level = parseInt(lvl);
      break;
    }
  }

  return level;
}

export function addXp(userData, xpAmount) {
  const oldLevel = userData.current_level;
  userData.total_xp += xpAmount;
  userData.current_level = calculateLevel(userData.total_xp);

  const leveledUp = userData.current_level > oldLevel;

  return {
    newTotalXp: userData.total_xp,
    newLevel: userData.current_level,
    leveledUp,
    xpAdded: xpAmount
  };
}

export function getXpForNextLevel(currentXp) {
  const currentLevel = calculateLevel(currentXp);
  const nextLevel = currentLevel + 1;
  const nextLevelThreshold = levelThresholds[nextLevel];

  if (!nextLevelThreshold) {
    return null;
  }

  return nextLevelThreshold - currentXp;
}
