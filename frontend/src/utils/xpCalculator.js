import constantsData from '../data/constants.js';

const LEVEL_THRESHOLDS = constantsData.levelThresholds;

export function getXpForNextLevel(currentXp, currentLevel) {
  const nextLevel = currentLevel + 1;
  const nextLevelThreshold = LEVEL_THRESHOLDS[nextLevel];

  if (!nextLevelThreshold) {
    return null;
  }

  return nextLevelThreshold - currentXp;
}

export function getCurrentLevelProgress(currentXp, currentLevel) {
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1];

  if (!nextThreshold) {
    return 100;
  }

  const xpIntoLevel = currentXp - currentThreshold;
  const xpNeededForLevel = nextThreshold - currentThreshold;

  return (xpIntoLevel / xpNeededForLevel) * 100;
}
