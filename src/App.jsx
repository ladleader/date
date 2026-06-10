import { useEffect, useMemo, useState } from "react";

const times = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const week = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const noWords = ["не-а", "мимо", "сбежал", "поздно", "точно?", "нет нет"];
const foods = ["суши", "паста", "десерт", "кофе"];

function niceDate(v) {
  if (!v) return "";
  const d = new Date(v + "T12:00:00");
  return `${d.getDate()} ${months[d.getMonth()]}, ${week[d.getDay()]}`;
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [food, setFood] = useState("");
  const [no, setNo] = useState({ x: 0, y: 0, r: 0, s: 1, text: "нет" });
  const [confetti, setConfetti] = useState(false);

  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
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
      setFood(data.food || "");
      setScreen("final");
    }
  }, []);

  function yes() {
    setConfetti(true);
    setTimeout(() => setScreen("food"), 520);
    setTimeout(() => setConfetti(false), 1300);
  }

  function moveNo() {
    const mx = Math.min(135, Math.max(70, window.innerWidth / 2 - 110));
    const my = Math.min(160, Math.max(70, window.innerHeight / 2 - 140));
    setNo({
      x: Math.random() * mx * 2 - mx,
      y: Math.random() * my * 2 - my,
      r: Math.random() * 70 - 35,
      s: Math.max(0.5, no.s - 0.08),
      text: noWords[Math.floor(Math.random() * noWords.length)]
    });
  }

  function save() {
    if (!date || !time) return;
    localStorage.setItem("dateChoice", JSON.stringify({ date, time, food }));
    setConfetti(true);
    setScreen("final");
    setTimeout(() => setConfetti(false), 1300);
  }

  function reset() {
    localStorage.removeItem("dateChoice");
    setDate("");
    setTime("");
    setFood("");
    setNo({ x: 0, y: 0, r: 0, s: 1, text: "нет" });
    setScreen("start");
  }

  return (
    <main style={s.page}>
      <style>{css}</style>
      <Background />
      {confetti && <Confetti />}

      {screen === "start" && (
        <Card>
          <div style={s.mark}>письмо для тебя</div>
          <LoveIcon />
          <h1 style={s.hero}>Пойдёшь со мной на свидание?</h1>
          <p style={s.copy}>Хочу украсть у вечера пару часов — чтобы город стал тише, разговоры ближе, а этот день остался нашим маленьким секретом.</p>
          <div style={s.choice}>
            <button style={s.primary} className="press" onClick={yes}>да, хочу</button>
            <button
              style={{ ...s.ghost, transform: `translate(${no.x}px, ${no.y}px) rotate(${no.r}deg) scale(${no.s})` }}
              onMouseEnter={moveNo}
              onTouchStart={moveNo}
              onClick={moveNo}
            >
              {no.text}
            </button>
          </div>
          <p style={s.whisper}>кнопка «нет» просто делает вид, что у неё есть шанс</p>
        </Card>
      )}

      {screen === "food" && (
        <Card>
          <div style={s.mark}>сначала вкус</div>
          <SoftIcon>♡</SoftIcon>
          <h1 style={s.title}>Что выберем на вечер?</h1>
          <p style={s.copySmall}>Выбери, чего тебе хочется. Я подстрою свидание под твой вкус.</p>
          <div style={s.foodGrid}>
            {foods.map((item, index) => (
              <button key={item} style={food === item ? s.foodActive : s.food} onClick={() => setFood(item)}>
                <span style={s.foodSign}>0{index + 1}</span>
                <span>{item}</span>
              </button>
            ))}
          </div>
          <button style={s.primaryWide} className="press" onClick={() => setScreen("choose")}>дальше</button>
        </Card>
      )}

      {screen === "choose" && (
        <Card>
          <div style={s.mark}>дата и время</div>
          <SoftIcon>✦</SoftIcon>
          <h1 style={s.title}>Когда я тебя заберу?</h1>
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
            {times.map((t) => <button key={t} onClick={() => setTime(t)} style={time === t ? s.timeActive : s.time}>{t}</button>)}
          </div>
          <button onClick={save} disabled={!date || !time} style={!date || !time ? s.disabled : s.primaryWide}>забронировать вечер</button>
        </Card>
      )}

      {screen === "final" && (
        <Card>
          <div style={s.mark}>официально</div>
          <SoftIcon>♡</SoftIcon>
          <h1 style={s.hero}>У нас свидание.</h1>
          <p style={s.final}>Я заберу тебя <b>{niceDate(date)}</b> в <b>{time}</b>.</p>
          {food && <p style={s.copySmall}>Вкус вечера: <b>{food}</b>.</p>}
          <div style={s.note}>P.S. Можно было просто написать. Но мне хотелось, чтобы приглашение уже было маленьким воспоминанием.</div>
          <button style={s.reset} onClick={reset}>выбрать заново</button>
        </Card>
      )}
    </main>
  );
}

function Background() {
  return (
    <div style={s.bgLayer}>
      <div style={s.haloA} />
      <div style={s.haloB} />
      <div style={s.haloC} />
      <div className="silk silk1" />
      <div className="silk silk2" />
      <div className="line line1" />
      <div className="line line2" />
      <div className="line line3" />
      {Array.from({ length: 12 }).map((_, i) => <span key={i} className={`petal p${i + 1}`} />)}
      <span className="word w1">love note</span>
      <span className="word w2">rendezvous</span>
      <span className="word w3">evening</span>
    </div>
  );
}

function Card({ children }) {
  return <section style={s.card} className="cardIn">{children}</section>;
}

function LoveIcon() {
  return <div style={s.loveIcon}><span>♡</span></div>;
}

function SoftIcon({ children }) {
  return <div style={s.softIcon}>{children}</div>;
}

function Confetti() {
  return <div style={s.confetti}>{Array.from({ length: 26 }).map((_, i) => <i key={i} className="conf" style={{ left: `${4 + (i * 7) % 92}%`, background: ["#fb7185", "#f9a8d4", "#c084fc", "#fff", "#facc15"][i % 5], animationDelay: `${(i % 9) * 0.035}s` }} />)}</div>;
}

const s = {
  page: { height: "100dvh", width: "100vw", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, boxSizing: "border-box", position: "relative", fontFamily: "Inter, Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", background: "linear-gradient(135deg,#fff7fb 0%,#fde6f1 38%,#f0eaff 100%)" },
  bgLayer: { position: "absolute", inset: 0, overflow: "hidden" },
  haloA: { position: "absolute", width: 360, height: 360, borderRadius: "50%", left: -120, top: -120, background: "radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0) 65%)", filter: "blur(10px)" },
  haloB: { position: "absolute", width: 330, height: 330, borderRadius: "50%", right: -110, top: 52, background: "radial-gradient(circle, rgba(238,174,255,.50), rgba(238,174,255,0) 66%)", filter: "blur(20px)" },
  haloC: { position: "absolute", width: 350, height: 350, borderRadius: "50%", left: "26%", bottom: -155, background: "radial-gradient(circle, rgba(251,113,133,.18), rgba(251,113,133,0) 68%)", filter: "blur(18px)" },
  card: { width: "calc(100vw - 34px)", maxWidth: 410, minHeight: 438, background: "linear-gradient(145deg, rgba(255,255,255,.72), rgba(255,255,255,.46))", border: "1px solid rgba(255,255,255,.94)", borderRadius: 36, padding: "24px 22px", boxSizing: "border-box", textAlign: "center", boxShadow: "0 40px 100px rgba(157,23,77,.18), inset 0 1px 0 rgba(255,255,255,.95)", backdropFilter: "blur(30px)", position: "relative", zIndex: 2 },
  mark: { display: "inline-block", padding: "7px 13px", borderRadius: 999, background: "rgba(255,241,242,.78)", color: "#be185d", fontSize: 10.5, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 13 },
  loveIcon: { width: 62, height: 48, margin: "0 auto 15px", borderRadius: 18, border: "1px solid rgba(244,63,94,.22)", background: "linear-gradient(145deg, rgba(255,255,255,.95), rgba(255,228,236,.78))", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48", fontSize: 32, fontWeight: 300, boxShadow: "0 18px 34px rgba(244,63,94,.16)" },
  softIcon: { width: 54, height: 54, margin: "0 auto 14px", borderRadius: "50%", background: "linear-gradient(145deg, rgba(255,255,255,.95), rgba(255,228,236,.72))", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48", fontSize: 31, fontWeight: 300, boxShadow: "0 18px 34px rgba(244,63,94,.14)" },
  hero: { margin: 0, color: "#101827", fontSize: "clamp(31px, 8.2vw, 38px)", lineHeight: .94, fontWeight: 950, letterSpacing: "-.075em" },
  title: { margin: 0, color: "#101827", fontSize: "clamp(27px, 7.2vw, 32px)", lineHeight: .98, fontWeight: 950, letterSpacing: "-.065em" },
  copy: { margin: "15px auto 0", color: "#656d79", fontSize: 15.8, lineHeight: 1.42, maxWidth: 334, fontWeight: 540, letterSpacing: "-.018em" },
  copySmall: { margin: "12px auto 0", color: "#68707d", fontSize: 15, lineHeight: 1.38, maxWidth: 320, fontWeight: 520, letterSpacing: "-.01em" },
  choice: { height: 112, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" },
  primary: { border: 0, borderRadius: 999, padding: "16px 26px", background: "linear-gradient(135deg,#fb7185,#db2777)", color: "white", fontSize: 16, fontWeight: 900, letterSpacing: "-.02em", boxShadow: "0 20px 44px rgba(219,39,119,.32)", cursor: "pointer", textTransform: "lowercase" },
  ghost: { border: 0, borderRadius: 999, padding: "13px 20px", background: "rgba(255,255,255,.88)", color: "#4b5563", fontSize: 14, fontWeight: 900, boxShadow: "0 16px 34px rgba(15,23,42,.10)", cursor: "pointer", transition: "transform .2s ease", textTransform: "lowercase" },
  whisper: { margin: 0, color: "#a3a3aa", fontSize: 12.5, lineHeight: 1.3, letterSpacing: "-.01em" },
  foodGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginTop: 22 },
  food: { border: "1px solid rgba(251,113,133,.16)", borderRadius: 22, padding: "14px 8px", background: "rgba(255,241,242,.62)", color: "#4b5563", fontSize: 15, fontWeight: 900, cursor: "pointer", textTransform: "lowercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  foodActive: { border: "1px solid rgba(251,113,133,.60)", borderRadius: 22, padding: "14px 8px", background: "linear-gradient(135deg,#fb7185,#ec4899)", color: "white", fontSize: 15, fontWeight: 900, cursor: "pointer", textTransform: "lowercase", boxShadow: "0 16px 32px rgba(236,72,153,.24)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  foodSign: { fontSize: 11, letterSpacing: ".08em", opacity: .68 },
  label: { margin: "15px 0 8px", color: "#374151", textAlign: "left", fontSize: 12, fontWeight: 950, letterSpacing: ".12em", textTransform: "uppercase" },
  dateGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 },
  date: { border: "1px solid rgba(251,113,133,.16)", borderRadius: 18, padding: "8px 2px", background: "rgba(255,241,242,.62)", color: "#4b5563", cursor: "pointer", minHeight: 67 },
  dateActive: { border: "1px solid rgba(251,113,133,.60)", borderRadius: 18, padding: "8px 2px", background: "linear-gradient(135deg,#fb7185,#ec4899)", color: "white", cursor: "pointer", minHeight: 67, boxShadow: "0 14px 28px rgba(236,72,153,.24)" },
  dateTop: { display: "block", fontSize: 9.5, fontWeight: 950, opacity: .73, textTransform: "uppercase" },
  dateDay: { display: "block", fontSize: 21, fontWeight: 950, lineHeight: 1.05, marginTop: 3 },
  dateMonth: { display: "block", fontSize: 9.5, fontWeight: 850, opacity: .74, marginTop: 1 },
  timeGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  time: { border: "1px solid rgba(251,113,133,.14)", borderRadius: 16, padding: "11px 2px", background: "rgba(255,241,242,.62)", color: "#4b5563", fontWeight: 900, cursor: "pointer", fontSize: 14 },
  timeActive: { border: "1px solid rgba(251,113,133,.60)", borderRadius: 16, padding: "11px 2px", background: "linear-gradient(135deg,#fb7185,#ec4899)", color: "white", fontWeight: 900, cursor: "pointer", fontSize: 14, boxShadow: "0 12px 24px rgba(236,72,153,.22)" },
  primaryWide: { width: "100%", marginTop: 17, border: 0, borderRadius: 999, padding: "15px", background: "linear-gradient(135deg,#fb7185,#db2777)", color: "white", fontSize: 15, fontWeight: 950, boxShadow: "0 20px 42px rgba(219,39,119,.28)", cursor: "pointer", textTransform: "lowercase" },
  disabled: { width: "100%", marginTop: 17, border: 0, borderRadius: 999, padding: "15px", background: "linear-gradient(135deg,#fb7185,#db2777)", color: "white", fontSize: 15, fontWeight: 950, opacity: .34, cursor: "not-allowed", textTransform: "lowercase" },
  final: { margin: "18px auto 0", color: "#4b5563", fontSize: 18, lineHeight: 1.4, maxWidth: 330, fontWeight: 520 },
  note: { margin: "18px auto 0", padding: "14px 15px", borderRadius: 24, background: "rgba(255,241,242,.66)", color: "#9f1239", fontSize: 13.5, lineHeight: 1.42, fontStyle: "italic", maxWidth: 330 },
  reset: { marginTop: 18, border: 0, borderRadius: 999, padding: "14px 22px", background: "rgba(255,255,255,.88)", color: "#374151", fontWeight: 900, boxShadow: "0 14px 28px rgba(15,23,42,.08)", cursor: "pointer", textTransform: "lowercase" },
  confetti: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9 }
};

const css = `
html,body,#root{margin:0;width:100%;height:100%;overflow:hidden;background:#fff7fb}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.cardIn{animation:cardIn .48s cubic-bezier(.2,.9,.25,1.12)}
.press{transition:transform .18s ease, filter .18s ease}.press:active{transform:scale(.965)}
.conf{position:absolute;top:-22px;width:7px;height:15px;border-radius:999px;animation:fall 1.15s ease-in forwards}
.silk{position:absolute;border-radius:999px;filter:blur(10px);opacity:.34;transform:rotate(-18deg);animation:silk 8s ease-in-out infinite}.silk1{width:72vw;height:74px;left:-18vw;top:18%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),rgba(244,114,182,.20),transparent)}.silk2{width:82vw;height:90px;right:-28vw;bottom:20%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.62),rgba(192,132,252,.18),transparent);animation-delay:1.8s}
.line{position:absolute;width:1px;height:170px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.80),transparent);opacity:.55;animation:lineFloat 7s ease-in-out infinite}.line1{left:14%;top:9%;transform:rotate(24deg)}.line2{right:18%;top:14%;transform:rotate(-28deg);animation-delay:1.2s}.line3{left:78%;bottom:8%;transform:rotate(18deg);animation-delay:2.1s}
.petal{position:absolute;width:10px;height:26px;border-radius:12px 12px 12px 2px;background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(251,113,133,.20));box-shadow:0 12px 30px rgba(244,63,94,.12);opacity:.48;animation:petal 9s ease-in-out infinite}.p1{left:7%;top:18%;animation-delay:0s}.p2{left:22%;top:9%;animation-delay:.9s}.p3{right:15%;top:18%;animation-delay:1.7s}.p4{right:8%;top:48%;animation-delay:.4s}.p5{left:12%;bottom:24%;animation-delay:2.2s}.p6{left:34%;bottom:10%;animation-delay:1.1s}.p7{right:28%;bottom:13%;animation-delay:2.8s}.p8{right:10%;bottom:28%;animation-delay:3.1s}.p9{left:48%;top:7%;animation-delay:2.4s}.p10{left:4%;top:56%;animation-delay:1.5s}.p11{right:42%;top:88%;animation-delay:.7s}.p12{right:4%;top:9%;animation-delay:2s}
.word{position:absolute;color:rgba(159,18,57,.13);font-family:Georgia,serif;font-style:italic;font-size:18px;letter-spacing:.04em;animation:wordFloat 8s ease-in-out infinite}.w1{left:8%;top:11%}.w2{right:7%;bottom:13%;animation-delay:1.5s}.w3{left:12%;bottom:8%;animation-delay:2.5s}
@keyframes cardIn{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes silk{0%,100%{transform:translate3d(0,0,0) rotate(-18deg)}50%{transform:translate3d(18px,-16px,0) rotate(-14deg)}}
@keyframes lineFloat{0%,100%{opacity:.28;transform:translateY(0) rotate(var(--r,20deg))}50%{opacity:.65;transform:translateY(-18px) rotate(var(--r,20deg))}}
@keyframes petal{0%,100%{transform:translate3d(0,0,0) rotate(18deg);opacity:.28}50%{transform:translate3d(16px,-28px,0) rotate(58deg);opacity:.58}}
@keyframes wordFloat{0%,100%{transform:translateY(0);opacity:.08}50%{transform:translateY(-14px);opacity:.16}}
@keyframes fall{0%{transform:translateY(-22px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(300deg);opacity:0}}
`;
