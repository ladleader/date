import { useEffect, useMemo, useState } from "react";

const times = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const week = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const noWords = ["не-а", "мимо", "сбежал", "поздно", "точно?", "нет нет"];
const foods = [
  { label: "суши", type: "sushi" },
  { label: "паста", type: "pasta" },
  { label: "десерт", type: "dessert" },
  { label: "кофе", type: "coffee" }
];

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
    const today = new Date();
    return Array.from({ length: 4 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        value: d.toISOString().slice(0, 10),
        day: d.getDate(),
        month: months[d.getMonth()],
        top: i === 0 ? "сегодня" : i === 1 ? "завтра" : week[d.getDay()]
      };
    });
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

  function goYes() {
    setConfetti(true);
    setTimeout(() => setScreen("food"), 520);
    setTimeout(() => setConfetti(false), 1200);
  }

  function moveNo() {
    const mx = Math.min(135, Math.max(70, window.innerWidth / 2 - 110));
    const my = Math.min(150, Math.max(70, window.innerHeight / 2 - 140));
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
    setTimeout(() => setConfetti(false), 1200);
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
    <main className="page">
      <style>{css}</style>
      <Background />
      {confetti && <Confetti />}

      {screen === "start" && (
        <Card>
          <div className="eyebrow">письмо для тебя</div>
          <div className="seal">♡</div>
          <h1>Пойдёшь со мной на свидание?</h1>
          <p className="lead">Хочу провести с тобой вечер: вкусно поесть, спокойно поговорить и просто побыть рядом.</p>
          <div className="choice">
            <button className="primary" onClick={goYes}>да, хочу</button>
            <button
              className="ghost"
              style={{ transform: `translate(${no.x}px, ${no.y}px) rotate(${no.r}deg) scale(${no.s})` }}
              onMouseEnter={moveNo}
              onTouchStart={moveNo}
              onClick={moveNo}
            >
              {no.text}
            </button>
          </div>
          <p className="hint">кнопка «нет» просто делает вид, что у неё есть шанс</p>
        </Card>
      )}

      {screen === "food" && (
        <Card>
          <div className="eyebrow">сначала вкус</div>
          <div className="seal small">✦</div>
          <h2>Что тебе больше хочется?</h2>
          <p className="sublead">Выбери настроение вечера, а детали я уже возьму на себя.</p>
          <div className="foodGrid">
            {foods.map((item) => (
              <button key={item.label} onClick={() => setFood(item.label)} className={`food ${food === item.label ? "active" : ""}`}>
                <span className={`foodArt ${item.type}`}><i /><b /><em /></span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <button className="primary wide" onClick={() => setScreen("choose")}>дальше</button>
        </Card>
      )}

      {screen === "choose" && (
        <Card>
          <div className="eyebrow">дата и время</div>
          <div className="seal small">♡</div>
          <h2>Когда я тебя заберу?</h2>
          <div className="label">день</div>
          <div className="dateGrid">
            {dates.map((d) => (
              <button key={d.value} onClick={() => setDate(d.value)} className={`date ${date === d.value ? "active" : ""}`}>
                <span>{d.top}</span><b>{d.day}</b><em>{d.month}</em>
              </button>
            ))}
          </div>
          <div className="label">время</div>
          <div className="timeGrid">
            {times.map((t) => <button key={t} onClick={() => setTime(t)} className={`time ${time === t ? "active" : ""}`}>{t}</button>)}
          </div>
          <button onClick={save} disabled={!date || !time} className="primary wide">забронировать вечер</button>
        </Card>
      )}

      {screen === "final" && (
        <Card>
          <div className="eyebrow">официально</div>
          <div className="seal">♡</div>
          <h1>У нас свидание.</h1>
          <p className="lead">Я заберу тебя <b>{niceDate(date)}</b> в <b>{time}</b>.</p>
          {food && <p className="sublead">Вкус вечера: <b>{food}</b>.</p>}
          <div className="note">P.S. Можно было просто написать. Но так приглашение уже похоже на маленькое воспоминание.</div>
          <button className="reset" onClick={reset}>выбрать заново</button>
        </Card>
      )}
    </main>
  );
}

function Card({ children }) {
  return <section className="card cardIn">{children}</section>;
}

function Background() {
  return (
    <div className="bg">
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="aurora a3" />
      <div className="silk s1" />
      <div className="silk s2" />
      <div className="ring r1" />
      <div className="ring r2" />
      <div className="line l1" />
      <div className="line l2" />
      {Array.from({ length: 14 }).map((_, i) => <span key={i} className={`petal p${i + 1}`} />)}
      <span className="word w1">rendezvous</span>
      <span className="word w2">quiet evening</span>
    </div>
  );
}

function Confetti() {
  return <div className="confetti">{Array.from({ length: 26 }).map((_, i) => <i key={i} style={{ left: `${4 + (i * 7) % 92}%`, animationDelay: `${(i % 9) * 0.035}s` }} />)}</div>;
}

const css = `
html,body,#root{margin:0;width:100%;height:100%;overflow:hidden;background:#fff7fb}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}button{font:inherit}
.page{height:100dvh;width:100vw;overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;font-family:Inter,Manrope,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:linear-gradient(135deg,#fff8fb 0%,#fde8f2 42%,#f1ebff 100%)}
.bg{position:absolute;inset:0;overflow:hidden}.bg:after{content:"";position:absolute;inset:0;opacity:.16;background-image:radial-gradient(rgba(255,255,255,.95) 1px,transparent 1px);background-size:24px 24px;mask-image:linear-gradient(to bottom,transparent,black 18%,black 82%,transparent)}
.aurora{position:absolute;border-radius:50%;filter:blur(22px);animation:breath 8s ease-in-out infinite}.a1{width:380px;height:380px;left:-150px;top:-120px;background:rgba(255,255,255,.95)}.a2{width:350px;height:350px;right:-120px;top:40px;background:rgba(221,166,255,.38);animation-delay:1.4s}.a3{width:360px;height:360px;left:25%;bottom:-170px;background:rgba(251,113,133,.16);animation-delay:2.2s}
.silk{position:absolute;height:86px;border-radius:999px;filter:blur(12px);opacity:.38;animation:silk 9s ease-in-out infinite}.s1{width:82vw;left:-24vw;top:18%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.78),rgba(244,114,182,.18),transparent);transform:rotate(-16deg)}.s2{width:90vw;right:-34vw;bottom:18%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.62),rgba(192,132,252,.16),transparent);transform:rotate(-18deg);animation-delay:1.8s}
.ring{position:absolute;border:1px solid rgba(255,255,255,.42);border-radius:50%;filter:blur(.2px);animation:ring 10s ease-in-out infinite}.r1{width:210px;height:210px;left:-80px;bottom:80px}.r2{width:260px;height:260px;right:-120px;top:190px;animation-delay:2s}
.line{position:absolute;width:1px;height:180px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.82),transparent);opacity:.52;animation:line 8s ease-in-out infinite}.l1{left:17%;top:10%;transform:rotate(24deg)}.l2{right:19%;top:13%;transform:rotate(-28deg);animation-delay:1.3s}
.petal{position:absolute;width:9px;height:25px;border-radius:16px 16px 16px 3px;background:linear-gradient(180deg,rgba(255,255,255,.88),rgba(251,113,133,.20));box-shadow:0 12px 30px rgba(244,63,94,.12);opacity:.45;animation:petal 9s ease-in-out infinite}.p1{left:7%;top:18%}.p2{left:23%;top:8%;animation-delay:.8s}.p3{right:15%;top:18%;animation-delay:1.7s}.p4{right:8%;top:48%;animation-delay:.4s}.p5{left:12%;bottom:24%;animation-delay:2.2s}.p6{left:34%;bottom:10%;animation-delay:1.1s}.p7{right:28%;bottom:13%;animation-delay:2.8s}.p8{right:10%;bottom:28%;animation-delay:3.1s}.p9{left:48%;top:7%;animation-delay:2.4s}.p10{left:4%;top:56%;animation-delay:1.5s}.p11{right:42%;top:88%;animation-delay:.7s}.p12{right:4%;top:9%;animation-delay:2s}.p13{left:56%;top:18%;animation-delay:3.4s}.p14{left:72%;bottom:34%;animation-delay:1.9s}
.word{position:absolute;color:rgba(159,18,57,.11);font-family:Georgia,serif;font-style:italic;font-size:18px;letter-spacing:.04em;animation:word 9s ease-in-out infinite}.w1{left:8%;top:11%}.w2{right:7%;bottom:13%;animation-delay:1.5s}
.card{width:calc(100vw - 34px);max-width:410px;min-height:438px;padding:24px 22px;position:relative;z-index:2;text-align:center;border-radius:36px;border:1px solid rgba(255,255,255,.94);background:linear-gradient(145deg,rgba(255,255,255,.74),rgba(255,255,255,.47));backdrop-filter:blur(30px);box-shadow:0 40px 100px rgba(157,23,77,.18),inset 0 1px 0 rgba(255,255,255,.95)}.cardIn{animation:cardIn .48s cubic-bezier(.2,.9,.25,1.12)}
.eyebrow{display:inline-block;padding:7px 13px;margin-bottom:13px;border-radius:999px;background:rgba(255,241,242,.78);color:#be185d;font-size:10.5px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.seal{width:62px;height:48px;margin:0 auto 15px;border-radius:18px;border:1px solid rgba(244,63,94,.22);background:linear-gradient(145deg,rgba(255,255,255,.95),rgba(255,228,236,.78));display:flex;align-items:center;justify-content:center;color:#e11d48;font-size:32px;font-weight:300;box-shadow:0 18px 34px rgba(244,63,94,.16)}.seal.small{width:54px;height:54px;border-radius:50%;font-size:30px}
h1,h2{margin:0;color:#101827;font-weight:950;letter-spacing:-.075em}h1{font-size:clamp(31px,8.2vw,38px);line-height:.94}h2{font-size:clamp(27px,7.2vw,32px);line-height:.98}.lead{margin:15px auto 0;color:#656d79;font-size:15.8px;line-height:1.42;max-width:334px;font-weight:540;letter-spacing:-.018em}.sublead{margin:12px auto 0;color:#68707d;font-size:15px;line-height:1.38;max-width:320px;font-weight:520;letter-spacing:-.01em}.hint{margin:0;color:#a3a3aa;font-size:12.5px;line-height:1.3;letter-spacing:-.01em}
.choice{height:112px;margin-top:20px;display:flex;align-items:center;justify-content:center;gap:12px;position:relative}.primary{border:0;border-radius:999px;padding:16px 26px;background:linear-gradient(135deg,#fb7185,#db2777);color:white;font-size:16px;font-weight:900;letter-spacing:-.02em;box-shadow:0 20px 44px rgba(219,39,119,.32);cursor:pointer;text-transform:lowercase;transition:transform .18s ease}.primary:active{transform:scale(.965)}.primary.wide{width:100%;margin-top:17px;padding:15px;font-size:15px}.primary:disabled{opacity:.34;cursor:not-allowed}.ghost{border:0;border-radius:999px;padding:13px 20px;background:rgba(255,255,255,.88);color:#4b5563;font-size:14px;font-weight:900;box-shadow:0 16px 34px rgba(15,23,42,.10);cursor:pointer;transition:transform .2s ease;text-transform:lowercase}
.foodGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:22px}.food{min-height:94px;border:1px solid rgba(251,113,133,.16);border-radius:24px;padding:13px 8px 12px;background:rgba(255,241,242,.62);color:#4b5563;font-size:15px;font-weight:900;cursor:pointer;text-transform:lowercase;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px}.food.active{border-color:rgba(251,113,133,.60);background:linear-gradient(135deg,#fb7185,#ec4899);color:white;box-shadow:0 16px 32px rgba(236,72,153,.24)}
.foodArt{width:46px;height:34px;position:relative;display:block}.foodArt i,.foodArt b,.foodArt em{position:absolute;display:block}.sushi i{width:32px;height:18px;left:7px;top:8px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 3px rgba(251,113,133,.28)}.sushi b{width:14px;height:14px;left:16px;top:10px;border-radius:50%;background:#fb7185}.sushi em{width:34px;height:4px;left:6px;top:26px;border-radius:999px;background:rgba(190,24,93,.22)}.pasta i{width:34px;height:20px;left:6px;top:10px;border-radius:0 0 18px 18px;border:3px solid currentColor;border-top:0;opacity:.55}.pasta b{width:26px;height:12px;left:10px;top:3px;border-radius:50%;border-top:3px solid currentColor;opacity:.5}.pasta em{width:4px;height:22px;right:7px;top:4px;background:currentColor;border-radius:999px;opacity:.5}.dessert i{width:31px;height:18px;left:8px;top:12px;border-radius:7px 7px 14px 14px;background:#fff;box-shadow:inset 0 -6px 0 rgba(251,113,133,.22)}.dessert b{width:24px;height:8px;left:11px;top:7px;border-radius:999px;background:rgba(251,113,133,.48)}.dessert em{width:6px;height:6px;left:20px;top:2px;border-radius:50%;background:#fb7185}.coffee i{width:29px;height:21px;left:8px;top:9px;border-radius:0 0 14px 14px;background:#fff;box-shadow:inset 0 -7px 0 rgba(190,24,93,.18)}.coffee b{width:10px;height:12px;right:3px;top:12px;border:3px solid currentColor;border-left:0;border-radius:0 999px 999px 0;opacity:.5}.coffee em{width:24px;height:4px;left:11px;top:30px;background:currentColor;border-radius:999px;opacity:.25}
.label{margin:15px 0 8px;color:#374151;text-align:left;font-size:12px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.dateGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.date,.time{border:1px solid rgba(251,113,133,.16);background:rgba(255,241,242,.62);color:#4b5563;font-weight:900;cursor:pointer}.date{min-height:67px;border-radius:18px;padding:8px 2px}.date span{display:block;font-size:9.5px;opacity:.73;text-transform:uppercase}.date b{display:block;font-size:21px;line-height:1.05;margin-top:3px}.date em{display:block;font-size:9.5px;opacity:.74;font-style:normal}.date.active,.time.active{border-color:rgba(251,113,133,.60);background:linear-gradient(135deg,#fb7185,#ec4899);color:white;box-shadow:0 14px 28px rgba(236,72,153,.24)}.timeGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.time{border-radius:16px;padding:11px 2px;font-size:14px}.note{margin:18px auto 0;padding:14px 15px;border-radius:24px;background:rgba(255,241,242,.66);color:#9f1239;font-size:13.5px;line-height:1.42;font-style:italic;max-width:330px}.reset{margin-top:18px;border:0;border-radius:999px;padding:14px 22px;background:rgba(255,255,255,.88);color:#374151;font-weight:900;box-shadow:0 14px 28px rgba(15,23,42,.08);cursor:pointer;text-transform:lowercase}.confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:9}.confetti i{position:absolute;top:-22px;width:7px;height:15px;border-radius:999px;background:#fb7185;animation:fall 1.15s ease-in forwards}.confetti i:nth-child(3n){background:#f9a8d4}.confetti i:nth-child(4n){background:#c084fc}.confetti i:nth-child(5n){background:#fff}
@keyframes cardIn{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes breath{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.08);opacity:1}}@keyframes silk{0%,100%{transform:translate3d(0,0,0) rotate(-16deg)}50%{transform:translate3d(18px,-16px,0) rotate(-12deg)}}@keyframes ring{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(1.08);opacity:.55}}@keyframes line{0%,100%{opacity:.28;transform:translateY(0) rotate(24deg)}50%{opacity:.65;transform:translateY(-18px) rotate(24deg)}}@keyframes petal{0%,100%{transform:translate3d(0,0,0) rotate(18deg);opacity:.26}50%{transform:translate3d(16px,-28px,0) rotate(58deg);opacity:.58}}@keyframes word{0%,100%{transform:translateY(0);opacity:.07}50%{transform:translateY(-14px);opacity:.14}}@keyframes fall{0%{transform:translateY(-22px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(300deg);opacity:0}}
`;
