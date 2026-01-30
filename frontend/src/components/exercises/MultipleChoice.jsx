import { useState, useEffect, useMemo } from 'react';
import './Exercise.css';

function MultipleChoice({ exercise, onSubmit, attempts }) {
  const [selected, setSelected] = useState('');

  const shuffledOptions = useMemo(() => {
    const options = exercise.options || [];
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [exercise.id]);

  useEffect(() => {
    setSelected('');
  }, [exercise.id]);

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
    }
  };

  return (
    <div className="exercise multiple-choice">
      <h2>{exercise.question_text}</h2>

      {exercise.image_url && (
        <div className="exercise-image">
          <img src={exercise.image_url} alt="ASL sign" />
        </div>
      )}

      <div className="options">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            className={`option ${selected === option ? 'selected' : ''}`}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        className="btn-primary btn-submit"
        onClick={handleSubmit}
        disabled={!selected}
      >
        Check Answer
      </button>
    </div>
  );
}

export default MultipleChoice;
