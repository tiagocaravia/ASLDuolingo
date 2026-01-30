import { useState, useEffect, useMemo } from 'react';
import './Exercise.css';

function SignRecognition({ exercise, onSubmit, attempts }) {
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
    <div className="exercise sign-recognition">
      <h2>{exercise.question_text}</h2>

      <div className="image-options">
        {shuffledOptions.map((option, index) => (
          <div
            key={index}
            className={`image-option ${selected === option.image_url ? 'selected' : ''}`}
            onClick={() => setSelected(option.image_url)}
          >
            <img src={option.image_url} alt={`Option ${index + 1}`} />
          </div>
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

export default SignRecognition;
