import { useState, useEffect } from 'react';
import './Exercise.css';

function Matching({ exercise, onSubmit, attempts }) {
  const [matches, setMatches] = useState({});

  useEffect(() => {
    setMatches({});
  }, [exercise.id]);

  const pairs = exercise.options || [];

  const handleMatch = (imageUrl, answer) => {
    setMatches(prev => ({ ...prev, [imageUrl]: answer }));
  };

  const handleSubmit = () => {
    const allMatched = pairs.every(pair => matches[pair.image_url]);
    if (allMatched) {
      const matchString = JSON.stringify(matches);
      onSubmit(matchString);
    }
  };

  return (
    <div className="exercise matching">
      <h2>{exercise.question_text}</h2>

      <div className="matching-pairs">
        {pairs.map((pair, index) => (
          <div key={index} className="matching-pair">
            <img src={pair.image_url} alt={`Sign ${index + 1}`} />
            <select
              value={matches[pair.image_url] || ''}
              onChange={(e) => handleMatch(pair.image_url, e.target.value)}
            >
              <option value="">Select...</option>
              {pairs.map((p, i) => (
                <option key={i} value={p.answer}>
                  {p.answer}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        className="btn-primary btn-submit"
        onClick={handleSubmit}
        disabled={pairs.length !== Object.keys(matches).length}
      >
        Check Answer
      </button>
    </div>
  );
}

export default Matching;
