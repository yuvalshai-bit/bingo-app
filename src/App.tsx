import { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (!soundRef.current) {
      soundRef.current = new Audio("/dice.mp3");
      soundRef.current.loop = true;
    }
    soundRef.current.currentTime = 0;
    soundRef.current.play();
  };

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  };

  const generateNumber = () => {
    if (isRolling || drawnNumbers.length >= 75) return;

    setIsRolling(true);
    playSound();

    let count = 0;

    const interval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 75) + 1;
      setCurrentNumber(randomNum);
      count++;

      if (count > 15) {
        clearInterval(interval);

        let finalNum: number;

        do {
          finalNum = Math.floor(Math.random() * 75) + 1;
        } while (drawnNumbers.includes(finalNum));

        setCurrentNumber(finalNum);
        setDrawnNumbers((prev) => [...prev, finalNum]);
        setIsRolling(false);

        stopSound();
      }
    }, 70);
  };

  const resetGame = () => {
    setCurrentNumber(null);
    setDrawnNumbers([]);
    setIsRolling(false);
    stopSound();
  };

  const columns = [
    { label: "ו", range: [61, 75], color: "#b84dff" },
    { label: "ג", range: [46, 60], color: "#4dd2ff" },
    { label: "נ", range: [31, 45], color: "#ffd24d" },
    { label: "י", range: [16, 30], color: "#ffa64d" },
    { label: "ב", range: [1, 15], color: "#ff4d4d" }
  ];

  return (
    <div className="container">

      <div className="left-panel">
        <h1 className="title">בינגו - כיתה ב'1</h1>

        <div className={`number-box ${isRolling ? "rolling" : ""}`}>
          {currentNumber ?? <span className="start-text">התחל</span>}
        </div>

        <div className="under-number-text">
          לחצו על הכפתור כדי להגריל מספר
        </div>

        <div className="buttons">
          <button onClick={generateNumber} disabled={isRolling}>
            {isRolling ? "מגריל..." : "הגרל מספר"}
          </button>

          <button onClick={resetGame}>
            איפוס משחק
          </button>
        </div>
      </div>

      <div className="right-panel">
        <div className="bingo-board">
          {columns.map((col) => (
            <div className="column" key={col.label}>
              <div className="column-header" style={{ background: col.color }}>
                {col.label}
              </div>

              {Array.from(
                { length: col.range[1] - col.range[0] + 1 },
                (_, i) => col.range[0] + i
              ).map((num) => (
                <div
                  key={num}
                  className={`cell ${
                    drawnNumbers.includes(num) ? "active" : ""
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}