import { useEffect, useMemo, useState } from "react";

const times = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const week = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const noWords = ["нет", "ой", "мимо", "не-а", "убежал", "поздно", "точно?", "ну нет"];

function niceDate(v) {
  if (!v) return "";
  const d = new Date(v + "T12:00:00");
  return `${d.getDate()} ${months[d.getMonth()]}, ${week[d.getDay()]}`;
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [no, setNo] = useState({ x: 0, y: 0, r: 0, s: 1, text: "нет" });
  const [confetti, setConfetti] = useState(false);

  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push({
        value: d.toISOString().slice(0, 10),
        day: d.getDate(),
        month: months[d.getMonth()],
        top: i === 0 ? "сегодня" : i === 1 ? "завтра" : week[d.getDay()]
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("dateChoice");
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.date && data.time) {
      setDate(data.date);
      setTime(data.time);
      setScreen("final");
    }
  }, []);

  function yes() {
    setConfetti(true);
    setTimeout(() => setScreen("choose"), 450);
    setTimeout(() => setConfetti(false), 1200);
  }

  function moveNo() {
    const mx = Math.min(140, Math.max(70, window.innerWidth / 2 - 105));
    const my = Math.min(185, Math.max(80, window.innerHeight / 2 - 145));
    setNo({
      x: Math.random() * mx * 2 - mx,
      y: Math.random() * my * 2 - my,
      r: Math.random() * 58 - 29,
      s: Math.max(0.58, no.s - 0.07),
      text: noWords[Math.floor(Math.random() * noWords.length)]
    });
  }

  function save() {
    if (!date || !time) return;
    localStorage.setItem("dateChoice", JSON.stringify({ date, time }));
    setConfetti(true);
    setScreen("final");
    setTimeout(() => setConfetti(false), 1200);
  }

  function reset() {
    localStorage.removeItem("dateChoice");
    setDate("");
    setTime("");
    setNo({ x: 0, y: 0, r: 0, s: 1, text: "нет" });
    setScreen("start");
  }

  return (
    <main style={s.page}>
      <style>{css}</style>
      <div style={s.orb1} />
      <div style={s.orb2} />
      <span style={{ ...s.float, left: 28, top: 48 }}>♡</span>
      <span style={{ ...s.float, right: 34, top: 96, fontSize: 23 }}>✦</span>
      <span style={{ ...s.float, left: 34, bottom: 78, fontSize: 22 }}>✧</span>
      <span style={{ ...s.float, right: 38, bottom: 60, fontSize: 25 }}>❀</span>
      {confetti && <Confetti />}

      {screen === "start" && (
        <section style={s.card} className="cardIn">
          <div style={s.badge}>для тебя</div>
          <div style={s.emoji} className="pulse">💌</div>
          <h1 style={s.title}>Пойдёшь со мной на маленькое свидание?</h1>
          <p style={s.text}>Без лишнего шума. Просто ты, я и вечер, который хочется запомнить.</p>
          <div style={s.choice}>
            <button style={s.yes} className="live" onClick={yes}>да, хочу 💗</button>
            <button
              style={{ ...s.no, transform: `translate(${no.x}px, ${no.y}px) rotate(${no.r}deg) scale(${no.s})` }}
              onMouseEnter={moveNo}
              onTouchStart={moveNo}
              onClick={moveNo}
            >
              {no.text}
            </button>
          </div>
          <p style={s.micro}>кнопка «нет» существует только для драматургии</p>
        </section>
      )}

      {screen === "choose" && (
        <section style={s.card} className="cardIn">
          <div style={s.badge}>я знал</div>
          <div style={s.emoji} className="pulse">🌷</div>
          <h1 style={s.title2}>Выбери наш вечер</h1>
          <p style={s.text2}>Я всё запомню. Остальное беру на себя.</p>

          <div style={s.label}>день</div>
          <div style={s.dateGrid}>
            {dates.map((d) => (
              <button key={d.value} onClick={() => setDate(d.value)} style={date === d.value ? s.dateActive : s.date}>
                <span style={s.dateTop}>{d.top}</span>
                <span style={s.dateDay}>{d.day}</span>
                <span style={s.dateMonth}>{d.month}</span>
              </button>
            ))}
          </div>

          <div style={s.label}>время</div>
          <div style={s.timeGrid}>
            {times.map((t) => (
              <button key={t} onClick={() => setTime(t)} style={time === t ? s.timeActive : s.time}>{t}</button>
            ))}
          </div>

          <button onClick={save} disabled={!date || !time} style={!date || !time ? s.disabled : s.main}>забронировать вечер ✨</button>
        </section>
      )}

      {screen === "final" && (
        <section style={s.card} className="cardIn">
          <div style={s.badge}>официально</div>
          <div style={s.emoji} className="pulse">🫶</div>
          <h1 style={s.title}>У нас свидание</h1>
          <p style={s.final}>Я заберу тебя <b>{niceDate(date)}</b> в <b>{time}</b>.</p>
          <p style={s.text}>Тебе нужно только улыбнуться. Всё остальное — на мне.</p>
          <div style={s.note}>P.S. Можно было просто написать. Но маленький сайт звучит романтичнее.</div>
          <button style={s.reset} onClick={reset}>выбрать заново</button>
        </section>
      )}
    </main>
  );
}

function Confetti() {
  const dots = Array.from({ length: 24 });
  return <div style={s.confetti}>{dots.map((_, i) => <i key={i} className="conf" style={{ left: `${6 + (i * 4) % 88}%`, background: ["#fb7185", "#f9a8d4", "#c084fc", "#fff", "#facc15"][i % 5], animationDelay: `${(i % 8) * 0.04}s` }} />)}</div>;
}

const s = {
  page: { height: "100svh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, boxSizing: "border-box", position: "relative", fontFamily: "Inter, ui-rounded, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", background: "radial-gradient(circle at 18% 10%, rgba(255,255,255,.95) 0 7%, transparent 32%), radial-gradient(circle at 82% 16%, rgba(245,208,254,.75) 0 8%, transparent 33%), linear-gradient(145deg,#ffe4ef 0%,#fce7f3 46%,#eee7ff 100%)" },
  orb1: { position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,.52)", filter: "blur(34px)", top: -70, left: -70 },
  orb2: { position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(236,72,153,.15)", filter: "blur(42px)", right: -70, bottom: -70 },
  float: { position: "absolute", color: "rgba(190,24,93,.22)", fontSize: 34, fontWeight: 900, animation: "float 4s ease-in-out infinite", userSelect: "none" },
  card: { width: "100%", maxWidth: 410, background: "linear-gradient(145deg,rgba(255,255,255,.78),rgba(255,255,255,.58))", border: "1px solid rgba(255,255,255,.9)", borderRadius: 34, padding: "22px 20px", boxSizing: "border-box", textAlign: "center", boxShadow: "0 34px 90px rgba(157,23,77,.16), inset 0 1px 0 rgba(255,255,255,.95)", backdropFilter: "blur(26px)", position: "relative", zIndex: 2 },
  badge: { display: "inline-block", padding: "7px 12px", borderRadius: 999, background: "rgba(255,241,242,.82)", color: "#be185d", fontSize: 11, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 },
  emoji: { fontSize: 48, marginBottom: 10, filter: "drop-shadow(0 16px 18px rgba(244,63,94,.18))" },
  title: { margin: 0, color: "#111827", fontSize: 28, lineHeight: 1.05, fontWeight: 950, letterSpacing: "-.055em" },
  title2: { margin: 0, color: "#111827", fontSize: 26, lineHeight: 1.05, fontWeight: 950, letterSpacing: "-.055em" },
  text: { margin: "13px auto 0", color: "#6b7280", fontSize: 15.5, lineHeight: 1.48, maxWidth: 330, fontWeight: 450 },
  text2: { margin: "9px auto 0", color: "#6b7280", fontSize: 14.5, lineHeight: 1.35, maxWidth: 310 },
  choice: { height: 122, marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" },
  yes: { border: 0, borderRadius: 22, padding: "16px 25px", background: "linear-gradient(135deg,#fb7185,#ec4899)", color: "white", fontSize: 16, fontWeight: 900, boxShadow: "0 18px 40px rgba(236,72,153,.34)", cursor: "pointer", textTransform: "lowercase" },
  no: { border: 0, borderRadius: 21, padding: "13px 20px", background: "rgba(255,255,255,.88)", color: "#4b5563", fontSize: 14, fontWeight: 900, boxShadow: "0 14px 34px rgba(15,23,42,.10)", cursor: "pointer", transition: "transform .2s ease", textTransform: "lowercase" },
  micro: { margin: 0, color: "#a1a1aa", fontSize: 12.5, lineHeight: 1.35 },
  label: { margin: "13px 0 7px", color: "#374151", textAlign: "left", fontSize: 13, fontWeight: 950, letterSpacing: ".06em", textTransform: "uppercase" },
  dateGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  date: { border: "1px solid rgba(251,113,133,.16)", borderRadius: 18, padding: "8px 3px", background: "rgba(255,241,242,.64)", color: "#4b5563", cursor: "pointer", minHeight: 68 },
  dateActive: { border: "1px solid rgba(251,113,133,.55)", borderRadius: 18, padding: "8px 3px", background: "linear-gradient(135deg,#fb7185,#ec4899)", color: "white", cursor: "pointer", minHeight: 68, boxShadow: "0 12px 24px rgba(236,72,153,.24)" },
  dateTop: { display: "block", fontSize: 10, fontWeight: 900, opacity: .74, textTransform: "uppercase" },
  dateDay: { display: "block", fontSize: 22, fontWeight: 950, lineHeight: 1.05, marginTop: 2 },
  dateMonth: { display: "block", fontSize: 10, fontWeight: 850, opacity: .72, marginTop: 2 },
  timeGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 },
  time: { border: "1px solid rgba(251,113,133,.14)", borderRadius: 16, padding: "10px 2px", background: "rgba(255,241,242,.64)", color: "#4b5563", fontWeight: 900, cursor: "pointer", fontSize: 14 },
  timeActive: { border: "1px solid rgba(251,113,133,.55)", borderRadius: 16, padding: "10px 2px", background: "linear-gradient(135deg,#fb7185,#ec4899)", color: "white", fontWeight: 900, cursor: "pointer", fontSize: 14, boxShadow: "0 12px 24px rgba(236,72,153,.22)" },
  main: { width: "100%", marginTop: 16, border: 0, borderRadius: 22, padding: "15px", background: "linear-gradient(135deg,#fb7185,#db2777)", color: "white", fontSize: 15.5, fontWeight: 950, boxShadow: "0 18px 38px rgba(219,39,119,.28)", cursor: "pointer", textTransform: "lowercase" },
  disabled: { width: "100%", marginTop: 16, border: 0, borderRadius: 22, padding: "15px", background: "linear-gradient(135deg,#fb7185,#db2777)", color: "white", fontSize: 15.5, fontWeight: 950, opacity: .34, cursor: "not-allowed", textTransform: "lowercase" },
  final: { margin: "18px auto 0", color: "#4b5563", fontSize: 18, lineHeight: 1.45, maxWidth: 330 },
  note: { margin: "18px auto 0", padding: "14px 15px", borderRadius: 22, background: "rgba(255,241,242,.70)", color: "#9f1239", fontSize: 13.5, lineHeight: 1.45, fontStyle: "italic", maxWidth: 330 },
  reset: { marginTop: 18, border: 0, borderRadius: 19, padding: "14px 22px", background: "rgba(255,255,255,.88)", color: "#374151", fontWeight: 900, boxShadow: "0 12px 26px rgba(15,23,42,.08)", cursor: "pointer", textTransform: "lowercase" },
  confetti: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9 }
};

const css = `
.cardIn{animation:cardIn .45s cubic-bezier(.2,.9,.25,1.15)}
.pulse{animation:pulse 2.3s ease-in-out infinite}
.live{transition:transform .18s ease, filter .18s ease}.live:active{transform:scale(.96)}
.conf{position:absolute;top:-20px;width:8px;height:14px;border-radius:999px;animation:fall 1.1s ease-in forwards}
@keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes pulse{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.04)}}
@keyframes float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-12px) rotate(8deg)}}
@keyframes fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(280deg);opacity:0}}
`;
