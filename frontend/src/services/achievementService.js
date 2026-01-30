import lessonsData from '../data/lessons.js';

export function checkAndAwardAchievements(userData, progressData, earnedAchievements, allAchievements) {
  const earnedIds = Object.keys(earnedAchievements);
  const newlyEarned = [];

  for (const achievement of allAchievements) {
    if (earnedIds.includes(achievement.id)) {
      continue;
    }

    const earned = checkAchievementRequirement(
      achievement.requirement_type,
      achievement.requirement_value,
      userData,
      progressData
    );

    if (earned) {
      newlyEarned.push(achievement);
    }
  }

  return newlyEarned;
}

function checkAchievementRequirement(type, value, userData, progressData) {
  switch (type) {
    case 'total_xp':
      return userData.total_xp >= value;

    case 'streak_days':
      return userData.current_streak >= value;

    case 'lessons_completed':
      const completedCount = Object.values(progressData)
        .filter(p => p.status === 'completed').length;
      return completedCount >= value;

    case 'category_complete':
      const categoryLessons = lessonsData.filter(l => l.category === value);
      const completedInCategory = categoryLessons.filter(lesson =>
        progressData[lesson.id]?.status === 'completed'
      ).length;
      return completedInCategory >= categoryLessons.length;

    default:
      return false;
  }
}
