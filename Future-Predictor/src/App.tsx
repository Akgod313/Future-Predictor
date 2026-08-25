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
      <div className="brand">
        <span className="brand-eyebrow">Bhoomi House</span>
        <div className="brand-mark">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="9.5" stroke="#c9a24d" strokeWidth="1.2" />
            <circle cx="11" cy="11" r="4.5" fill="#b6532e" fillOpacity="0.35" />
          </svg>
        </div>
        <div className="brand-divider" />
      </div>

      <h1>Future Predictor</h1>
      <p className="subtitle">Tell us your name, and let the house read what's ahead.</p>

      {!prediction ? (
        <form onSubmit={generateFuture} className="form-card">
          <label htmlFor="nameInput">Your name</label>
          <input
            id="nameInput"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Consulting the stars…' : 'Reveal My Future'}
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

      <span className="footer-tag">Bhoomi House &middot; Grounded Predictions</span>
    </div>
  )
}

export default App