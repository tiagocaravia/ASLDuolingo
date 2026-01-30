import lessonsData from '../data/lessons.js';
import exercisesData from '../data/exercises.js';
import achievementsData from '../data/achievements.js';
import constantsData from '../data/constants.js';
import { addXp } from './xpService';
import { updateStreak } from './streakService';
import { checkAndAwardAchievements } from './achievementService';

const { xpValues } = constantsData;

const STORAGE_KEYS = {
  USER: 'asl_user',
  PROGRESS: 'asl_progress',
  ACHIEVEMENTS: 'asl_achievements'
};

function getDefaultUser() {
  return {
    total_xp: 0,
    current_level: 1,
    current_streak: 0,
    longest_streak: 0,
    last_practice_date: null
  };
}

export function getUserData() {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : getDefaultUser();
}

function setUserData(userData) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
}

export function getProgressData() {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : {};
}

function setProgressData(progressData) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressData));
}

export function getEarnedAchievements() {
  const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  return data ? JSON.parse(data) : {};
}

function setEarnedAchievements(achievements) {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function getAllLessons() {
  const userData = getUserData();
  const progressData = getProgressData();

  return lessonsData.map(lesson => ({
    ...lesson,
    progress: progressData[lesson.id] || null,
    unlocked: userData.total_xp >= lesson.required_xp
  }));
}

export function getLessonById(lessonId) {
  const lesson = lessonsData.find(l => l.id === lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const userData = getUserData();
  const progressData = getProgressData();

  return {
    ...lesson,
    progress: progressData[lessonId] || null,
    unlocked: userData.total_xp >= lesson.required_xp
  };
}

export function getLessonExercises(lessonId) {
  return exercisesData
    .filter(e => e.lesson_id === lessonId)
    .sort((a, b) => a.order_index - b.order_index);
}

export function startLesson(lessonId) {
  const userData = getUserData();
  const lesson = lessonsData.find(l => l.id === lessonId);

  if (!lesson) throw new Error('Lesson not found');
  if (userData.total_xp < lesson.required_xp) {
    throw new Error('Lesson locked');
  }

  const progressData = getProgressData();

  if (!progressData[lessonId]) {
    progressData[lessonId] = {
      status: 'in_progress',
      completion_percentage: 0,
      attempts: 1,
      last_attempted: new Date().toISOString()
    };
  } else {
    progressData[lessonId].status = 'in_progress';
    progressData[lessonId].last_attempted = new Date().toISOString();
  }

  const streakResult = updateStreak(userData);

  setUserData(userData);
  setProgressData(progressData);

  return {
    progress: progressData[lessonId],
    streakResult
  };
}

export function submitExercise(exerciseId, answer, attemptCount) {
  const exercise = exercisesData.find(e => e.id === exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  const correct = exercise.correct_answer.toLowerCase().trim() === answer.toLowerCase().trim();

  let xpEarned = 0;
  let newTotalXp, newLevel, leveledUp;

  if (correct) {
    if (attemptCount === 1) {
      xpEarned = xpValues.exerciseCorrectFirstTry;
    } else if (attemptCount === 2) {
      xpEarned = xpValues.exerciseCorrectSecondTry;
    } else {
      xpEarned = xpValues.exerciseCorrectThirdPlus;
    }

    const userData = getUserData();
    const xpResult = addXp(userData, xpEarned);
    setUserData(userData);

    return {
      correct: true,
      xpEarned,
      newTotalXp: xpResult.newTotalXp,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel
    };
  }

  return {
    correct: false,
    xpEarned: 0,
    correctAnswer: attemptCount >= 3 ? exercise.correct_answer : null
  };
}

export function completeLesson(lessonId) {
  const lesson = lessonsData.find(l => l.id === lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const progressData = getProgressData();
  const userData = getUserData();

  if (!progressData[lessonId]) {
    throw new Error('Progress not found');
  }

  progressData[lessonId].status = 'completed';
  progressData[lessonId].completion_percentage = 100;
  progressData[lessonId].completed_at = new Date().toISOString();

  const xpResult = addXp(userData, lesson.xp_reward);

  const earnedAchievements = getEarnedAchievements();
  const newAchievements = checkAndAwardAchievements(
    userData,
    progressData,
    earnedAchievements,
    achievementsData
  );

  newAchievements.forEach(achievement => {
    earnedAchievements[achievement.id] = {
      earned_at: new Date().toISOString()
    };
  });

  setUserData(userData);
  setProgressData(progressData);
  setEarnedAchievements(earnedAchievements);

  return {
    progress: progressData[lessonId],
    xpEarned: lesson.xp_reward,
    newTotalXp: xpResult.newTotalXp,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.newLevel,
    newAchievements
  };
}

export function getAllAchievements() {
  return achievementsData;
}

export function getUserAchievements() {
  const earnedAchievements = getEarnedAchievements();

  return Object.entries(earnedAchievements).map(([achievementId, data]) => ({
    achievement_id: achievementId,
    earned_at: data.earned_at,
    Achievement: achievementsData.find(a => a.id === achievementId)
  }));
}
