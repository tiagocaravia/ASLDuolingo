import { createContext, useContext, useState } from 'react';
import * as dataService from '../services/dataService';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return dataService.getUserData();
    } catch (error) {
      console.error('Failed to load user data:', error);
      return { total_xp: 0, current_level: 1, current_streak: 0, longest_streak: 0, last_practice_date: null };
    }
  });

  const loadLessons = async () => {
    try {
      const data = dataService.getAllLessons();
      setLessons(data);
      return data;
    } catch (error) {
      console.error('Failed to load lessons:', error);
      throw error;
    }
  };

  const loadLesson = async (lessonId) => {
    try {
      const data = dataService.getLessonById(lessonId);
      setCurrentLesson(data);
      return data;
    } catch (error) {
      console.error('Failed to load lesson:', lessonId, error);
      throw error;
    }
  };

  const loadExercises = async (lessonId) => {
    try {
      const data = dataService.getLessonExercises(lessonId);
      setExercises(data);
      return data;
    } catch (error) {
      console.error('Failed to load exercises:', lessonId, error);
      throw error;
    }
  };

  const startLesson = async (lessonId) => {
    try {
      const result = dataService.startLesson(lessonId);
      setUser(dataService.getUserData());
      return result;
    } catch (error) {
      console.error('Failed to start lesson:', lessonId, error);
      throw error;
    }
  };

  const submitExercise = async (exerciseId, answer, attemptCount) => {
    try {
      const result = dataService.submitExercise(exerciseId, answer, attemptCount);

      if (result.newTotalXp !== undefined) {
        setUser(dataService.getUserData());
      }

      return result;
    } catch (error) {
      console.error('Failed to submit exercise:', exerciseId, error);
      throw error;
    }
  };

  const completeLesson = async (lessonId) => {
    try {
      const result = dataService.completeLesson(lessonId);

      if (result.newTotalXp !== undefined) {
        setUser(dataService.getUserData());
      }

      return result;
    } catch (error) {
      console.error('Failed to complete lesson:', lessonId, error);
      throw error;
    }
  };

  const loadUserStats = async () => {
    try {
      setUser(dataService.getUserData());
    } catch (error) {
      console.error('Failed to load user stats:', error);
      throw error;
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        lessons,
        currentLesson,
        exercises,
        user,
        loadLessons,
        loadLesson,
        loadExercises,
        startLesson,
        submitExercise,
        completeLesson,
        loadUserStats
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
