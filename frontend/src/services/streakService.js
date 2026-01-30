import constantsData from '../data/constants.js';
import { addXp } from './xpService';

const { xpValues } = constantsData;

export function updateStreak(userData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!userData.last_practice_date) {
    userData.current_streak = 1;
    userData.last_practice_date = today.toISOString();
    return { streakIncreased: true, currentStreak: 1, xpEarned: 0 };
  }

  const lastPractice = new Date(userData.last_practice_date);
  lastPractice.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    return { streakIncreased: false, currentStreak: userData.current_streak, xpEarned: 0 };
  }

  if (daysDiff === 1) {
    userData.current_streak += 1;
    if (userData.current_streak > userData.longest_streak) {
      userData.longest_streak = userData.current_streak;
    }
    userData.last_practice_date = today.toISOString();

    addXp(userData, xpValues.dailyStreakBonus);

    return {
      streakIncreased: true,
      currentStreak: userData.current_streak,
      xpEarned: xpValues.dailyStreakBonus
    };
  }

  userData.current_streak = 1;
  userData.last_practice_date = today.toISOString();

  return { streakIncreased: false, currentStreak: 1, streakReset: true, xpEarned: 0 };
}
