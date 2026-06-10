import { useEffect, useState } from "react";

const times = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00"
];

export default function App() {
  const [screen, setScreen] = useState("start");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("dateChoice");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date && parsed.time) {
        setDate(parsed.date);
        setTime(parsed.time);
        setScreen("final");
      }
    }
  }, []);

  function moveNoButton() {
    const maxX = Math.max(90, window.innerWidth / 2 - 115);
    const maxY = Math.max(80, window.innerHeight / 2 - 100);
    const x = Math.random() * maxX * 2 - maxX;
    const y = Math.random() * maxY * 2 - maxY;
    setNoPos({ x, y });
    setAngle(Math.random() * 28 - 14);
  }

  function saveDate() {
    if (!date || !time) return;
    localStorage.setItem("dateChoice", JSON.stringify({ date, time }));
    setScreen("final");
  }

  function reset() {
    localStorage.removeItem("dateChoice");
    setDate("");
    setTime("");
    setNoPos({ x: 0, y: 0 });
    setScreen("start");
  }

  return (
    <main style={styles.page}>
      <div style={{ ...styles.decor, top: 36, left: 26 }}>💗</div>
      <div style={{ ...styles.decor, bottom: 50, right: 28, fontSize: 46 }}>✨</div>
      <div style={{ ...styles.decor, top: 120, right: 42, fontSize: 30 }}>🌸</div>

      {screen === "start" && (
        <section style={styles.card}>
          <div style={styles.bigIcon}>💌</div>
          <h1 style={styles.title}>Пойдёшь со мной на свидание?</h1>
          <p style={styles.text}>Выбор, конечно, есть. Но не совсем.</p>

          <div style={styles.buttonsBox}>
            <button style={styles.yesButton} onClick={() => setScreen("choose")}>Да 💗</button>
            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={{
                ...styles.noButton,
                transform: `translate(${noPos.x}px, ${noPos.y}px) rotate(${angle}deg)`
              }}
            >
              Нет
            </button>
          </div>
        </section>
      )}

      {screen === "choose" && (
        <section style={styles.card}>
          <div style={styles.bigIcon}>😌</div>
          <h1 style={styles.title}>Я так и знал</h1>
          <p style={styles.text}>Теперь выбери, когда ты свободна</p>

          <div style={styles.form}>
            <label style={styles.label}>Дата</label>
            <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <label style={styles.label}>Время</label>
            <div style={styles.timeGrid}>
              {times.map((item) => (
                <button
                  key={item}
                  onClick={() => setTime(item)}
                  style={time === item ? styles.timeActive : styles.timeButton}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              onClick={saveDate}
              disabled={!date || !time}
              style={!date || !time ? styles.disabledButton : styles.fullButton}
            >
              Назначить свидание 💗
            </button>
          </div>
        </section>
      )}

      {screen === "final" && (
        <section style={styles.card}>
          <div style={styles.bigIcon}>💗</div>
          <h1 style={styles.title}>Отлично, тогда увидимся!</h1>
          <p style={styles.finalText}>Я заберу тебя в <b style={{ color: "#f43f5e" }}>{time}</b></p>
          {date && <p style={styles.smallText}>Дата: {date}</p>}
          <p style={styles.ps}>P.S. Нормальные люди просто пишут, а я сделал сайт.</p>
          <button style={styles.resetButton} onClick={reset}>Выбрать заново</button>
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #ffe4ec 0%, #fce7f3 45%, #ede9fe 100%)",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    position: "relative"
  },
  decor: {
    position: "absolute",
    fontSize: 38,
    opacity: 0.28,
    userSelect: "none"
  },
  card: {
    width: "100%",
    maxWidth: 430,
    background: "rgba(255,255,255,0.88)",
    borderRadius: 32,
    padding: "34px 26px",
    boxShadow: "0 30px 80px rgba(190, 24, 93, 0.18)",
    textAlign: "center",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.7)",
    animation: "fadeIn .45s ease"
  },
  bigIcon: {
    fontSize: 54,
    marginBottom: 18
  },
  title: {
    margin: 0,
    color: "#111827",
    fontSize: 31,
    lineHeight: 1.12,
    fontWeight: 850,
    letterSpacing: "-0.04em"
  },
  text: {
    margin: "16px 0 0",
    color: "#6b7280",
    fontSize: 16,
    lineHeight: 1.5
  },
  buttonsBox: {
    height: 150,
    marginTop: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    position: "relative"
  },
  yesButton: {
    border: 0,
    borderRadius: 20,
    padding: "16px 30px",
    background: "#fb7185",
    color: "white",
    fontSize: 16,
    fontWeight: 800,
    boxShadow: "0 14px 30px rgba(251, 113, 133, .35)",
    cursor: "pointer"
  },
  noButton: {
    border: 0,
    borderRadius: 20,
    padding: "16px 30px",
    background: "#f3f4f6",
    color: "#374151",
    fontSize: 16,
    fontWeight: 800,
    boxShadow: "0 10px 22px rgba(0,0,0,.08)",
    cursor: "pointer",
    transition: "transform .22s ease"
  },
  form: {
    marginTop: 28,
    textAlign: "left"
  },
  label: {
    display: "block",
    margin: "18px 0 8px",
    color: "#4b5563",
    fontSize: 14,
    fontWeight: 700
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #fecdd3",
    borderRadius: 18,
    padding: "15px 16px",
    fontSize: 16,
    outline: "none",
    background: "white"
  },
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10
  },
  timeButton: {
    border: 0,
    borderRadius: 16,
    padding: "12px 4px",
    background: "#fff1f2",
    color: "#374151",
    fontWeight: 800,
    cursor: "pointer"
  },
  timeActive: {
    border: 0,
    borderRadius: 16,
    padding: "12px 4px",
    background: "#fb7185",
    color: "white",
    fontWeight: 800,
    boxShadow: "0 10px 22px rgba(251, 113, 133, .28)",
    cursor: "pointer"
  },
  fullButton: {
    width: "100%",
    marginTop: 22,
    border: 0,
    borderRadius: 20,
    padding: "16px",
    background: "#fb7185",
    color: "white",
    fontSize: 16,
    fontWeight: 850,
    boxShadow: "0 14px 30px rgba(251, 113, 133, .35)",
    cursor: "pointer"
  },
  disabledButton: {
    width: "100%",
    marginTop: 22,
    border: 0,
    borderRadius: 20,
    padding: "16px",
    background: "#fb7185",
    color: "white",
    fontSize: 16,
    fontWeight: 850,
    opacity: 0.42,
    cursor: "not-allowed"
  },
  finalText: {
    marginTop: 22,
    color: "#4b5563",
    fontSize: 19
  },
  smallText: {
    marginTop: 6,
    color: "#9ca3af"
  },
  ps: {
    marginTop: 26,
    color: "#9ca3af",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 1.5
  },
  resetButton: {
    marginTop: 25,
    border: 0,
    borderRadius: 18,
    padding: "14px 24px",
    background: "#f3f4f6",
    color: "#374151",
    fontWeight: 800,
    cursor: "pointer"
  }
};
