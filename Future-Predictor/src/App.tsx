import { useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

const careers = [
  "a world-renowned chef", "a deep-sea explorer", "a tech startup founder", "a bestselling author",
  "a self-taught architect", "an underground DJ", "a professional treasure hunter", "a beekeeping influencer",
  "a Formula 1 strategist", "a puppet-maker for stop-motion films", "a rogue weather forecaster",
  "a competitive dumpling chef", "a wildlife photographer", "a stand-up comedian turned therapist",
];

const locations = [
  "in a bustling cyberpunk city", "on a quiet farm in Italy", "in a high-tech Mars colony", "on a tropical island",
  "in a converted lighthouse", "aboard a slow train that never stops", "in a treehouse village in Costa Rica",
  "in a neon-lit night market", "on a research base in Antarctica", "in a city built inside a canyon",
  "on a houseboat in Amsterdam", "in a mountain town that only exists in fog",
];

const companions = [
  "with a rescued three-legged dog by your side", "alongside a business partner you met in a lift",
  "with a robot assistant that has strong opinions", "with a rotating cast of eccentric neighbors",
  "with your childhood best friend as your right hand", "with a talking parrot who handles your schedule",
  "solo, exactly the way you like it", "with a mentor who turns out to be a former rival",
];

const quirks = [
  "but you still can't fold a fitted sheet", "and you've developed a mild addiction to spicy pickles",
  "though you refuse to use punctuation in texts", "and you've started collecting vintage doorknobs",
  "but you're terrified of your own doorbell", "and you narrate your life in a nature-documentary voice",
  "though you've never once been on time", "and you insist on doing everything left-handed now",
];

const twists = [
  "where you secretly fight crime on weekends", "and you own a pet capybara",
  "where you invent a new type of coffee", "and a chance encounter changes everything overnight",
  "where you accidentally become internet-famous", "and you're one lucky break from a total career pivot",
  "where a rumor about you turns out to be true", "and you finally learn the thing you've been avoiding",
];

const achievements = [
  "You'll win an award nobody expected you to.", "A stranger will thank you for something small you forgot doing.",
  "You'll finally finish that project you keep putting off.", "Someone will ask you to write a book about it.",
  "You'll teach a class on the thing you're worst at today.", "A version of your childhood dream will come true, sideways.",
];

function App() {
  const [name, setName] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const generateFuture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    // 1. Generate the random future — pull one item from each category so
    // the result stays fresh across many more possible combinations
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const career = pick(careers);
    const location = pick(locations);
    const companion = pick(companions);
    const quirk = pick(quirks);
    const twist = pick(twists);
    const achievement = pick(achievements);

    const futureText = `In 10 years you will be ${career} living ${location}, ${companion}. It'll happen ${twist}, ${quirk}. ${achievement}`;

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