import { useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

const careers = ["a world-renowned chef", "a deep-sea explorer", "a tech startup founder", "a bestselling author"];
const locations = ["in a bustling cyberpunk city", "on a quiet farm in Italy", "in a high-tech Mars colony", "on a tropical island"];
const twists = ["where you secretly fight crime on weekends.", "and you own a pet capybara.", "but you still can't fold a fitted sheet.", "where you invent a new type of coffee."];

function App() {
  const [name, setName] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const generateFuture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    // 1. Generate the random future
    const career = careers[Math.floor(Math.random() * careers.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const twist = twists[Math.floor(Math.random() * twists.length)];
    const futureText = `In 10 years you will be ${career} living ${location}, ${twist}`;

    // 2. Save to Supabase
    const { error } = await supabase
      .from('Predictions')
      .insert([
        { name: name, prediction: futureText }
      ]);

    if (error) {
      console.error("Error saving prediction:", error);
      alert("Oops, the crystal ball dropped. Try again!");
    } else {
      // 3. Show it to the user
      setPrediction(futureText);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔮 Future Predictor</h1>
      
      {!prediction ? (
        <form onSubmit={generateFuture} className="form-card">
          <label htmlFor="nameInput">Enter your name:</label>
          <input
            id="nameInput"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Consulting the stars...' : 'Predict My Future'}
          </button>
        </form>
      ) : (
        <div className="prediction-card">
          <h2>Hey {name},</h2>
          <p>{prediction}</p>
          <button onClick={() => { setPrediction(''); setName(''); }}>
            Try Another
          </button>
        </div>
      )}
    </div>
  )
}

export default App