import { useEffect, useMemo, useState } from "react";

const times = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

const months = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const weekDays = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value + "T12:00:00");
  return `${d.getDate()} ${months[d.getMonth()]}, ${weekDays[d.getDay()]}`;
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);
  const [noText, setNoText] = useState("Нет");

  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i += 1) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const value = d.toISOString().slice(0, 10);
      list.push({
        value,
        day: d.getDate(),
        month: months[d.getMonth()],
        week: i === 0 ? "сегодня" : i === 1 ? "завтра" : weekDays[d.getDay()]
      });
    }
    return list;
  }, []);

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
    const maxX = Math.max(80, window.innerWidth / 2 - 120);
    const maxY = Math.max(70, window.innerHeight / 2 - 130);
    const x = Math.random() * maxX * 2 - maxX;
    const y = Math.random() * maxY * 2 - maxY;
    const phrases = ["Нет", "Точно?", "Не выйдет", "Я убежал", "Мимо", "Попробуй ещё"];
    setNoPos({ x, y });
    setAngle(Math.random() * 34 - 17);
    setNoText(phrases[Math.floor(Math.random() * phrases.length)]);
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
    setNoText("Нет");
    setScreen("start");
  }

  return (
    <main style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
      <div style={{ ...styles.float, top: 58, left: 26 }}>♡</div>
      <div style={{ ...styles.float, top: 112, right: 36, fontSize: 24 }}>✦</div>
      <div style={{ ...styles.float, bottom: 70, right: 42, fontSize: 30 }}>❀</div>
      <div style={{ ...styles.float, bottom: 130, left: 34, fontSize: 20 }}>✧</div>

      {screen === "start" && (
        <section style={styles.card}>
          <div style={styles.kicker}>маленькое приглашение</div>
          <div style={styles.envelope}>💌</div>
          <h1 style={styles.title}>У меня есть один очень важный вопрос</h1>
          <p style={styles.text}>Пойдёшь со мной на свидание? Обещаю: вкусно, спокойно и немного красиво.</p>

          <div style={styles.buttonsBox}>
            <button style={styles.yesButton} onClick={() => setScreen("choose")}>Да, конечно 💗</button>
            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={{
                ...styles.noButton,
                transform: `translate(${noPos.x}px, ${noPos.y}px) rotate(${angle}deg)`
              }}
            >
              {noText}
            </button>
          </div>

          <p style={styles.hint}>Кнопка «Нет» немного стесняется и не любит, когда её трогают.</p>
        </section>
      )}

      {screen === "choose" && (
        <section style={styles.card}>
          <div style={styles.kicker}>я так и знал</div>
          <div style={styles.envelope}>🌷</div>
          <h1 style={styles.title}>Выбери день, который станет чуть лучше</h1>
          <p style={styles.text}>Я подстроюсь. Тебе нужно только выбрать удобное время.</p>

          <div style={styles.form}>
            <div style={styles.labelRow}>
              <span style={styles.label}>День</span>
              {date && <span style={styles.selectedText}>{formatDate(date)}</span>}
            </div>

            <div style={styles.dateGrid}>
              {dates.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setDate(item.value)}
                  style={date === item.value ? styles.dateActive : styles.dateButton}
                >
                  <span style={styles.dateWeek}>{item.week}</span>
                  <span style={styles.dateDay}>{item.day}</span>
                  <span style={styles.dateMonth}>{item.month}</span>
                </button>
              ))}
            </div>

            <div style={styles.labelRow}>
              <span style={styles.label}>Время</span>
              {time && <span style={styles.selectedText}>{time}</span>}
            </div>

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
              Сохранить наше свидание ✨
            </button>
          </div>
        </section>
      )}

      {screen === "final" && (
        <section style={styles.card}>
          <div style={styles.kicker}>договорились</div>
          <div style={styles.envelope}>🫶</div>
          <h1 style={styles.title}>Значит, это официально</h1>
          <p style={styles.finalText}>Я заберу тебя <b style={styles.rose}>{formatDate(date)}</b> в <b style={styles.rose}>{time}</b>.</p>
          <p style={styles.text}>Остальное беру на себя. Тебе нужно только красиво улыбнуться.</p>
          <div style={styles.note}>P.S. Нормальные люди просто пишут сообщение. Я решил сделать маленький сайт, потому что так интереснее.</div>
          <button style={styles.resetButton} onClick={reset}>Выбрать заново</button>
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100svh",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    boxSizing: "border-box",
    background: "radial-gradient(circle at 20% 12%, #fff7fb 0, transparent 34%), radial-gradient(circle at 82% 20%, #f8d9ff 0, transparent 25%), linear-gradient(145deg, #ffe1ec 0%, #fde7f2 42%, #eee8ff 100%)",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    position: "relative"
  },
  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, .52)",
    filter: "blur(34px)",
    top: -70,
    left: -70
  },
  glowTwo: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(244, 114, 182, .18)",
    filter: "blur(42px)",
    bottom: -90,
    right: -80
  },
  float: {
    position: "absolute",
    color: "rgba(190, 24, 93, .22)",
    fontSize: 36,
    fontWeight: 900,
    userSelect: "none"
  },
  card: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "calc(100svh - 36px)",
    overflowY: "auto",
    background: "rgba(255,255,255,0.78)",
    borderRadius: 34,
    padding: "32px 24px",
    boxShadow: "0 35px 90px rgba(157, 23, 77, 0.16), inset 0 1px 0 rgba(255,255,255,.9)",
    textAlign: "center",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.82)"
  },
  kicker: {
    display: "inline-block",
    padding: "8px 13px",
    borderRadius: 999,
    background: "rgba(255, 241, 242, .95)",
    color: "#be185d",
    fontSize: 12,
    fontWeight: 850,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    marginBottom: 18
  },
  envelope: {
    fontSize: 58,
    marginBottom: 14,
    filter: "drop-shadow(0 16px 18px rgba(244, 63, 94, .18))"
  },
  title: {
    margin: 0,
    color: "#111827",
    fontSize: 30,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.055em"
  },
  text: {
    margin: "15px auto 0",
    color: "#6b7280",
    fontSize: 16,
    lineHeight: 1.55,
    maxWidth: 340
  },
  buttonsBox: {
    height: 150,
    marginTop: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
    position: "relative"
  },
  yesButton: {
    border: 0,
    borderRadius: 22,
    padding: "17px 25px",
    background: "linear-gradient(135deg, #fb7185, #ec4899)",
    color: "white",
    fontSize: 16,
    fontWeight: 900,
    boxShadow: "0 18px 40px rgba(236, 72, 153, .34)",
    cursor: "pointer"
  },
  noButton: {
    border: 0,
    borderRadius: 22,
    padding: "15px 23px",
    background: "rgba(255,255,255,.86)",
    color: "#4b5563",
    fontSize: 15,
    fontWeight: 900,
    boxShadow: "0 14px 34px rgba(15,23,42,.10)",
    cursor: "pointer",
    transition: "transform .2s ease"
  },
  hint: {
    margin: "0 auto",
    color: "#a1a1aa",
    fontSize: 13,
    lineHeight: 1.45,
    maxWidth: 320
  },
  form: {
    marginTop: 24,
    textAlign: "left"
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "18px 0 10px"
  },
  label: {
    color: "#374151",
    fontSize: 15,
    fontWeight: 900
  },
  selectedText: {
    color: "#e11d48",
    fontSize: 13,
    fontWeight: 850
  },
  dateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 9
  },
  dateButton: {
    border: "1px solid rgba(251, 113, 133, .16)",
    borderRadius: 20,
    padding: "11px 4px",
    background: "rgba(255, 241, 242, .72)",
    color: "#4b5563",
    cursor: "pointer",
    minHeight: 80
  },
  dateActive: {
    border: "1px solid rgba(251, 113, 133, .55)",
    borderRadius: 20,
    padding: "11px 4px",
    background: "linear-gradient(135deg, #fb7185, #ec4899)",
    color: "white",
    cursor: "pointer",
    minHeight: 80,
    boxShadow: "0 14px 28px rgba(236, 72, 153, .26)"
  },
  dateWeek: {
    display: "block",
    fontSize: 11,
    fontWeight: 850,
    opacity: .75,
    textTransform: "uppercase"
  },
  dateDay: {
    display: "block",
    fontSize: 23,
    fontWeight: 950,
    lineHeight: 1.1,
    marginTop: 4
  },
  dateMonth: {
    display: "block",
    fontSize: 10,
    fontWeight: 800,
    opacity: .72,
    marginTop: 2
  },
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 9
  },
  timeButton: {
    border: "1px solid rgba(251, 113, 133, .14)",
    borderRadius: 17,
    padding: "12px 4px",
    background: "rgba(255, 241, 242, .70)",
    color: "#4b5563",
    fontWeight: 900,
    cursor: "pointer"
  },
  timeActive: {
    border: "1px solid rgba(251, 113, 133, .55)",
    borderRadius: 17,
    padding: "12px 4px",
    background: "linear-gradient(135deg, #fb7185, #ec4899)",
    color: "white",
    fontWeight: 900,
    boxShadow: "0 12px 24px rgba(236, 72, 153, .24)",
    cursor: "pointer"
  },
  fullButton: {
    width: "100%",
    marginTop: 22,
    border: 0,
    borderRadius: 23,
    padding: "17px",
    background: "linear-gradient(135deg, #fb7185, #db2777)",
    color: "white",
    fontSize: 16,
    fontWeight: 950,
    boxShadow: "0 20px 42px rgba(219, 39, 119, .30)",
    cursor: "pointer"
  },
  disabledButton: {
    width: "100%",
    marginTop: 22,
    border: 0,
    borderRadius: 23,
    padding: "17px",
    background: "linear-gradient(135deg, #fb7185, #db2777)",
    color: "white",
    fontSize: 16,
    fontWeight: 950,
    opacity: 0.36,
    cursor: "not-allowed"
  },
  finalText: {
    margin: "22px auto 0",
    color: "#4b5563",
    fontSize: 18,
    lineHeight: 1.55,
    maxWidth: 340
  },
  rose: {
    color: "#e11d48"
  },
  note: {
    margin: "24px auto 0",
    padding: "16px 17px",
    borderRadius: 22,
    background: "rgba(255, 241, 242, .72)",
    color: "#9f1239",
    fontSize: 14,
    lineHeight: 1.55,
    fontStyle: "italic",
    maxWidth: 340
  },
  resetButton: {
    marginTop: 24,
    border: 0,
    borderRadius: 20,
    padding: "15px 24px",
    background: "rgba(255,255,255,.88)",
    color: "#374151",
    fontWeight: 900,
    boxShadow: "0 12px 26px rgba(15,23,42,.08)",
    cursor: "pointer"
  }
};
