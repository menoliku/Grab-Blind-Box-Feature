import { useEffect, useMemo, useState } from "react";

type Screen = "home" | "summary" | "preferences" | "reveal" | "result" | "group" | "groupResult" | "order";
type IconName = "arrow" | "box" | "clock" | "home" | "food" | "orders" | "pay" | "pin" | "search" | "shield" | "sparkle" | "users" | "wallet";
type Participant = { id: number; name: string; allergies: string[]; dietary: string[]; budget: number };
type Meal = {
  id: number; name: string; restaurant: string; cuisine: string; tags: string[]; dietary: string[];
  allergens: string[]; price: number; distance: number; eta: string; fee: number; image: string; color: string;
};

const allergies = ["Peanuts", "Tree nuts", "Shellfish", "Crustaceans", "Fish", "Eggs", "Milk / dairy", "Soy", "Wheat / gluten", "Sesame"];
const diets = ["No restrictions", "Halal", "Vegetarian", "Vegan", "No pork", "No beef", "Pescatarian"];
const cuisines = ["Rice", "Noodles", "Western", "Japanese", "Korean", "Chinese", "Indian", "Local favourites", "Healthy", "High protein"];
const budgetOptions = [{ label: "Under S$10", max: 10 }, { label: "S$10–15", max: 15 }, { label: "S$15–20", max: 20 }];
const budgetLabel = (budget: number) => budgetOptions.find(o => o.max === budget)?.label ?? `Up to S$${budget}`;

type SavedPrefs = { allergies: string[]; diets: string[]; cuisines: string[]; radius: number; budget: number; other: string };
const PREFS_KEY = "grab-blind-box-prefs";
function loadPrefs(): SavedPrefs | null {
  try { const raw = localStorage.getItem(PREFS_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function storePrefs(prefs: SavedPrefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* storage unavailable */ }
}
const images = {
  bowl: "https://images.unsplash.com/photo-1597958792579-bd3517df6399?auto=format&fit=crop&w=900&q=85",
  bento: "https://images.unsplash.com/photo-1594955332421-2033cfd867b4?auto=format&fit=crop&w=900&q=85",
  noodles: "https://images.unsplash.com/photo-1713047203705-44dd7d762d0c?auto=format&fit=crop&w=900&q=85",
  padthai: "https://images.unsplash.com/photo-1746973645769-c11eb0a81025?auto=format&fit=crop&w=900&q=85",
  veggie: "https://images.unsplash.com/photo-1556040220-4096d522378d?auto=format&fit=crop&w=900&q=85",
};

const meals: Meal[] = [
  { id: 1, name: "Grilled Chicken Rice Bowl", restaurant: "Green Bowl Kitchen", cuisine: "Healthy Asian", tags: ["Rice", "Healthy", "High protein"], dietary: ["Halal", "No pork"], allergens: ["Soy", "Sesame"], price: 12.9, distance: 1.8, eta: "20–30 min", fee: 4.5, image: images.bowl, color: "#E7F8ED" },
  { id: 2, name: "Heritage Nasi Lemak", restaurant: "Nasi Corner", cuisine: "Local favourites", tags: ["Rice", "Local favourites"], dietary: ["Halal", "No pork", "No beef"], allergens: ["Eggs", "Peanuts", "Fish"], price: 10.8, distance: 2.4, eta: "25–35 min", fee: 3.6, image: images.bento, color: "#FFF2DE" },
  { id: 3, name: "Plant-based Bibimbap", restaurant: "Seoul Bento", cuisine: "Korean", tags: ["Rice", "Korean", "Healthy"], dietary: ["Vegetarian", "Vegan", "No pork", "No beef"], allergens: ["Soy", "Sesame"], price: 14.5, distance: 2.9, eta: "25–35 min", fee: 4.2, image: images.bento, color: "#FBEDE9" },
  { id: 4, name: "Garden Protein Bowl", restaurant: "Plant Plate", cuisine: "Modern vegetarian", tags: ["Healthy", "High protein", "Western"], dietary: ["Halal", "Vegetarian", "Vegan", "No pork", "No beef", "Pescatarian"], allergens: [], price: 13.9, distance: 1.5, eta: "15–25 min", fee: 3.2, image: images.veggie, color: "#EAF8E7" },
  { id: 5, name: "Chicken Aglio Olio", restaurant: "Pasta Works", cuisine: "Western", tags: ["Noodles", "Western", "High protein"], dietary: ["No pork", "No beef"], allergens: ["Wheat / gluten", "Milk / dairy"], price: 16.9, distance: 3.6, eta: "30–40 min", fee: 4.8, image: images.noodles, color: "#F9EEE4" },
  { id: 6, name: "Teriyaki Tofu Don", restaurant: "Japanese Bento Co.", cuisine: "Japanese", tags: ["Rice", "Japanese", "Vegetarian"], dietary: ["Vegetarian", "No pork", "No beef"], allergens: ["Soy"], price: 11.9, distance: 2.1, eta: "20–30 min", fee: 3.9, image: images.bowl, color: "#F1EFE7" },
  { id: 7, name: "Lime Chicken Rice Noodles", restaurant: "Green Bowl Kitchen", cuisine: "Southeast Asian", tags: ["Noodles", "Healthy", "High protein"], dietary: ["Halal", "No pork", "No beef"], allergens: [], price: 13.5, distance: 1.8, eta: "20–30 min", fee: 4.5, image: images.padthai, color: "#EAF7E8" },
  { id: 8, name: "Vegetable Brown Rice Bento", restaurant: "Plant Plate", cuisine: "Healthy", tags: ["Rice", "Healthy"], dietary: ["Halal", "Vegetarian", "Vegan", "No pork", "No beef", "Pescatarian"], allergens: ["Soy"], price: 9.9, distance: 1.5, eta: "15–25 min", fee: 3.2, image: images.veggie, color: "#EAF8E7" },
  { id: 9, name: "Hainanese Chicken Rice", restaurant: "Uncle Lim's Chicken Rice", cuisine: "Local favourites", tags: ["Rice", "Local favourites"], dietary: ["No pork", "No beef"], allergens: ["Soy", "Sesame"], price: 6.5, distance: 1.2, eta: "15–25 min", fee: 2.9, image: images.bowl, color: "#FFF2DE" },
];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="m15 18-6-6 6-6" />, box: <><path d="M4 8.5 12 4l8 4.5v9L12 22l-8-4.5z" /><path d="m4 8.5 8 4.5 8-4.5M12 13v9M9.5 2h5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    food: <><path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M16 3v18M16 3c3 2 4 5 4 8h-4" /></>, orders: <><path d="M6 3h12l2 4-2 14H6L4 7z" /><path d="M4 7h16M9 11h6" /></>,
    pay: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h3" /></>, pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>, shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    sparkle: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
    wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13v3" /><path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo() {
  return <div className="logo">Grab<span>Food</span></div>;
}

function TopBar({ title, onBack, action }: { title?: string; onBack?: () => void; action?: React.ReactNode }) {
  return <div className="topbar">
    {onBack ? <button className="icon-btn" onClick={onBack} aria-label="Go back"><Icon name="arrow" /></button> : <Logo />}
    {title && <div className="topbar-title">{title}</div>}
    <div className="topbar-action">{action}</div>
  </div>;
}

function Chip({ label, active, onClick, tone = "green" }: { label: string; active: boolean; onClick: () => void; tone?: "green" | "amber" }) {
  return <button className={`chip ${active ? `active ${tone}` : ""}`} onClick={onClick}>{active && <span className="check">✓</span>}{label}</button>;
}

function StatusBar() {
  return <div className="statusbar"><span>9:41</span><span className="status-icons">● ◒ ▰</span></div>;
}

function Home({ go, saved, again }: { go: (s: Screen) => void; saved: boolean; again: () => void }) {
  const start = () => go(saved ? "summary" : "preferences");
  return <div className="screen home-screen">
    <div className="home-green">
      <TopBar action={<button className="avatar">JL</button>} />
      <button className="location"><Icon name="pin" size={16} /><span><small>Deliver to</small><strong>One Raffles Place</strong></span><span>⌄</span></button>
      <div className="search"><Icon name="search" /><span>What are you craving?</span></div>
    </div>
    <main className="home-content">
      <div className="service-grid">
        {[["food", "Food", "#E8F8EF"], ["pay", "Pay", "#EBF5FF"], ["orders", "Mart", "#FFF1E7"], ["wallet", "More", "#F2EEFF"]].map(([icon, label, bg]) =>
          <button className="service" key={label}><span style={{ background: bg }}><Icon name={icon as IconName} /></span><b>{label}</b></button>)}
      </div>
      <section className="blind-card" onClick={start}>
        <div className="blind-copy"><div className="eyebrow light"><Icon name="sparkle" size={14} /> {saved ? "WELCOME BACK" : "NEW FOR LUNCH"}</div><h1>GRAB<br />BLIND BOX</h1><p>{saved ? <>Your preferences are saved.<br />One tap to lunch.</> : <>Too many choices?<br />Let us surprise you.</>}</p>
          {saved
            ? <><button className="white-button" onClick={(e) => { e.stopPropagation(); again(); }}>Surprise Me Again <span>↻</span></button>
              <button className="card-link" onClick={(e) => { e.stopPropagation(); go("summary"); }}>Review preferences</button></>
            : <button className="white-button" onClick={(e) => { e.stopPropagation(); start(); }}>Surprise Me <span>→</span></button>}
        </div>
        <div className="box-art"><span className="box-star s1">✦</span><span className="box-star s2">✦</span><div className="lid"></div><div className="giftbox"><span>?</span></div><div className="bowl-art"><i></i></div></div>
        <div className="card-caption">Your next meal, picked for you</div>
      </section>
      <p className="personalised"><Icon name="shield" size={15} /> Personalised to your taste, budget and dietary needs</p>
      <div className="section-heading"><h2>Quick picks for lunch</h2><button>See all</button></div>
      <div className="quick-row">
        {meals.slice(0, 2).map(m => <div className="quick-card" key={m.id}><img src={m.image} alt={m.name} /><div><b>{m.restaurant}</b><span>{m.eta} · {m.distance} km</span></div></div>)}
      </div>
    </main>
    <nav className="bottom-nav">{[["home", "Home"], ["food", "Food"], ["orders", "Activity"], ["pay", "Payment"]].map(([i, l], x) => <button className={x === 0 ? "selected" : ""} key={l}><Icon name={i as IconName} /><span>{l}</span></button>)}</nav>
  </div>;
}

function RangeField({ title, value, min, max, step, suffix, prefix = "", onChange }: { title: string; value: number; min: number; max: number; step: number; suffix: string; prefix?: string; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return <section className="setting-section">
    <div className="setting-head"><div><h3>{title}</h3><p>Closer options usually arrive faster</p></div>
      <label className="value-input">{prefix}<input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))} />{suffix}</label>
    </div>
    <input className="range" type="range" min={min} max={max} step={step} value={value} style={{ "--fill": `${pct}%` } as React.CSSProperties} onChange={e => onChange(Number(e.target.value))} />
    <div className="range-labels"><span>{prefix}{min}{suffix}</span><strong>Within {value} km</strong><span>{prefix}{max}{suffix}</span></div>
  </section>;
}

function BudgetField({ budget, setBudget }: { budget: number; setBudget: (v: number) => void }) {
  const [custom, setCustom] = useState(!budgetOptions.some(o => o.max === budget));
  return <section className="setting-section">
    <div className="setting-head"><div><h3>What's your lunch budget?</h3><p>Meal price only. Delivery fees are shown separately.</p></div></div>
    <div className="budget-options">
      {budgetOptions.map(o => <button key={o.label} className={!custom && budget === o.max ? "active" : ""} onClick={() => { setCustom(false); setBudget(o.max); }}>{o.label}</button>)}
      <button className={custom ? "active" : ""} onClick={() => setCustom(true)}>Custom</button>
    </div>
    {custom && <label className="custom-budget">Up to S$<input type="number" min={5} max={50} value={budget} onChange={e => setBudget(Math.min(50, Math.max(5, Number(e.target.value))))} /> per meal</label>}
  </section>;
}

function PreferenceSummary({ onBack, edit, open, group, setGroup, prefs }: { onBack: () => void; edit: () => void; open: () => void; group: boolean; setGroup: (v: boolean) => void; prefs: SavedPrefs }) {
  const diet = prefs.diets.filter(d => d !== "No restrictions");
  const allergyText = [...prefs.allergies, prefs.other.trim()].filter(Boolean).join(", ");
  const rows: [IconName, string, string, boolean?][] = [
    ["shield", "Allergies", allergyText || "None", !!allergyText],
    ["food", "Diet", diet.join(", ") || "No restrictions"],
    ["wallet", "Budget", `${budgetLabel(prefs.budget)} · meal only`],
    ["pin", "Distance", `Within ${prefs.radius} km`],
    ["sparkle", "Mood", prefs.cuisines.join(", ") || "Surprise me with anything"],
  ];
  return <div className="screen scroll-screen">
    <TopBar title="Your Blind Box" onBack={onBack} action={<button className="text-button" onClick={edit}>Edit</button>} />
    <main className="page">
      <div className="intro-row"><div><span className="step">SAVED PREFERENCES</span><h1>Same as last time?</h1><p>Check your saved preferences, then open your box.</p></div><div className="mini-box">?</div></div>
      <section className="pref-summary">{rows.map(([icon, label, value, warn]) =>
        <button key={label} className={warn ? "warn" : ""} onClick={edit}><Icon name={icon} size={18} /><span><small>{label}</small><b>{value}</b></span><i>›</i></button>)}
      </section>
      <button className="group-toggle" onClick={() => setGroup(!group)}><span className="group-icon"><Icon name="users" /></span><span><b>Deciding for a group?</b><small>Combine everyone's needs</small></span><span className={`toggle ${group ? "on" : ""}`}><i /></span></button>
      <button className="primary-button" onClick={open}>{group ? "SET UP MY GROUP" : "OPEN MY BLIND BOX"} <Icon name="sparkle" size={19} /></button>
      <button className="secondary-button" onClick={edit}>Edit preferences</button>
      <p className="action-helper">Allergies changed? Update them before you order.</p>
    </main>
  </div>;
}

function Preferences({ onBack, open, reset, group, setGroup, selectedAllergies, setSelectedAllergies, selectedDiets, setSelectedDiets, selectedCuisines, setSelectedCuisines, radius, setRadius, budget, setBudget, other, setOther }:
  { onBack: () => void; open: () => void; reset: () => void; group: boolean; setGroup: (v: boolean) => void; selectedAllergies: string[]; setSelectedAllergies: (v: string[]) => void; selectedDiets: string[]; setSelectedDiets: (v: string[]) => void; selectedCuisines: string[]; setSelectedCuisines: (v: string[]) => void; radius: number; setRadius: (v: number) => void; budget: number; setBudget: (v: number) => void; other: string; setOther: (v: string) => void }) {
  const toggle = (item: string, list: string[], setter: (v: string[]) => void) => setter(list.includes(item) ? list.filter(x => x !== item) : [...list.filter(x => x !== "No restrictions"), item]);
  return <div className="screen scroll-screen">
    <TopBar title="Build your Blind Box" onBack={onBack} action={<button className="text-button" onClick={reset}>Reset</button>} />
    <main className="page">
      <div className="intro-row"><div><span className="step">STEP 1 OF 2</span><h1>What works for you?</h1><p>Set it once. We'll save it for next time.</p></div><div className="mini-box">?</div></div>
      <section className="safety-card">
        <div className="safety-title"><span><Icon name="shield" /></span><div><h2>Allergies & dietary requirements</h2><p>Your safety matters. Review before continuing.</p></div></div>
        <h3>Exclude known allergens</h3><div className="chips">{allergies.map(a => <Chip key={a} label={a} active={selectedAllergies.includes(a)} tone="amber" onClick={() => toggle(a, selectedAllergies, setSelectedAllergies)} />)}</div>
        <input className="other-input" placeholder="Other allergy or details..." value={other} onChange={e => setOther(e.target.value)} />
        <div className="divider" />
        <h3>Dietary requirements</h3><p className="helper">These are handled separately from allergies.</p><div className="chips">{diets.map(d => <Chip key={d} label={d} active={selectedDiets.includes(d)} onClick={() => d === "No restrictions" ? setSelectedDiets(["No restrictions"]) : toggle(d, selectedDiets, setSelectedDiets)} />)}</div>
      </section>
      <RangeField title="How far are you willing to order?" value={radius} min={1} max={15} step={0.5} suffix=" km" onChange={setRadius} />
      <BudgetField budget={budget} setBudget={setBudget} />
      <section className="setting-section"><h3>Anything you're in the mood for?</h3><p>Optional — choose as many as you like.</p><div className="chips cuisine-chips">{cuisines.map(c => <Chip key={c} label={c} active={selectedCuisines.includes(c)} onClick={() => toggle(c, selectedCuisines, setSelectedCuisines)} />)}</div>
        <button className={`anything ${selectedCuisines.length === 0 ? "active" : ""}`} onClick={() => setSelectedCuisines([])}><Icon name="sparkle" size={18} /> Surprise me with anything</button>
      </section>
      <button className="group-toggle" onClick={() => setGroup(!group)}><span className="group-icon"><Icon name="users" /></span><span><b>Deciding for a group?</b><small>Combine everyone's needs</small></span><span className={`toggle ${group ? "on" : ""}`}><i /></span></button>
      <button className="primary-button" onClick={open}>{group ? "SET UP MY GROUP" : "OPEN MY BLIND BOX"} <Icon name="sparkle" size={19} /></button>
      <p className="action-helper">We'll save these so next time you can skip straight to your box.</p>
    </main>
  </div>;
}

function Reveal({ onBack, finish }: { onBack: () => void; finish: () => void }) {
  const [opening, setOpening] = useState(false);
  useEffect(() => { if (opening) { const t = setTimeout(finish, 1150); return () => clearTimeout(t); } }, [opening, finish]);
  return <div className="screen reveal-screen">
    <TopBar onBack={onBack} />
    <div className="reveal-content"><div className="eyebrow"><Icon name="sparkle" size={14} /> YOUR MATCH IS READY</div><h1>{opening ? "Opening your box..." : "Lunch, without the overthinking."}</h1><p>{opening ? "Checking every detail one last time." : "We found a meal that fits your requirements."}</p>
      <button className={`reveal-box ${opening ? "opening" : ""}`} onClick={() => setOpening(true)} aria-label="Reveal meal"><span className="ray r1" /><span className="ray r2" /><span className="ray r3" /><div className="reveal-lid"><i /></div><div className="reveal-base"><span>?</span></div></button>
      <div className="match-badges"><span><Icon name="shield" size={15} /> Restrictions checked</span><span><Icon name="clock" size={15} /> Under 30 mins</span></div>
    </div>
    <div className="reveal-bottom"><button className="primary-button" onClick={() => setOpening(true)} disabled={opening}>{opening ? "FINDING YOUR MATCH..." : "REVEAL MY MEAL"}</button><p>Tap to unlock your lunch</p></div>
  </div>;
}

function AllergySummary({ selected }: { selected: string[] }) {
  return <div className="allergy-summary"><Icon name="shield" size={20} /><div><b>Restrictions applied</b><span>{selected.length ? `Excluding: ${selected.join(", ")}` : "No allergies selected"}</span></div><span className="verified">CHECKED</span></div>;
}

function Result({ meal, restrictions, onBack, onEdit, another, order, group = false, participants = [], why, setWhy, whyText }: { meal: Meal; restrictions: string[]; onBack: () => void; onEdit: () => void; another: () => void; order: () => void; group?: boolean; participants?: Participant[]; why: boolean; setWhy: (v: boolean) => void; whyText: string }) {
  const count = group ? Math.max(participants.length, 1) : 1;
  const mealTotal = meal.price * count;
  const total = mealTotal + meal.fee;
  return <div className="screen scroll-screen result-screen">
    <TopBar title={group ? "Your group match" : "Mystery unlocked"} onBack={onBack} action={<button className="icon-btn"><Icon name="orders" /></button>} />
    <main className="page result-page">
      <AllergySummary selected={restrictions} />
      <div className="hero-image"><img src={meal.image} alt={meal.name} /><span className="mock-label">PROTOTYPE MATCH</span><div className="hero-badge"><Icon name="sparkle" size={14} /> MYSTERY UNLOCKED</div></div>
      <section className="meal-card">
        <div className="restaurant-row"><span className="restaurant-logo" style={{ background: meal.color }}>{meal.restaurant.charAt(0)}</span><div><b>{meal.restaurant}</b><span>{meal.cuisine} · {meal.distance} km away</span></div><span className="rating">★ 4.8</span></div>
        <h1>{meal.name}</h1><div className="meal-badges">{meal.dietary.slice(0, 3).map(x => <span key={x}>✓ {x}</span>)}</div>
        <div className="metrics"><div><Icon name="clock" /><span><small>DELIVERY</small><b>{meal.eta}</b></span></div><div><Icon name="wallet" /><span><small>{group ? "PER PERSON" : "MEAL PRICE"}</small><b>S${meal.price.toFixed(2)}</b></span></div></div>
        <div className="cost-breakdown">
          <p><span>Meal price{group ? ` × ${count}` : ""}</span><b>S${mealTotal.toFixed(2)}</b></p>
          <p><span>Delivery & service fees</span><b>S${meal.fee.toFixed(2)}</b></p>
          <div><span>Total you pay</span><strong>S${total.toFixed(2)}</strong></div>
          <small>Your budget covers the meal price. Fees are added on top.</small>
        </div>
      </section>
      {group && <section className="satisfied"><h3><Icon name="users" size={19} /> Everyone's requirements matched</h3>{participants.map(p => <div key={p.id}><span className="participant-avatar">{p.name[0]}</span><b>{p.name}</b><span>{[...p.allergies.map(a => `No ${a}`), ...p.dietary].join(" · ") || "No restrictions"}</span><i>✓</i></div>)}</section>}
      <section className="why-card"><button onClick={() => setWhy(!why)}><span><Icon name="sparkle" /><b>Why this meal?</b></span><span>{why ? "−" : "+"}</span></button>{why && <p>{whyText} All listed restrictions were checked against verified mock attributes.</p>}</section>
      <div className="notice"><Icon name="shield" size={18} /><p><b>Please confirm with the restaurant.</b> Ingredient and cross-contact information can change. This prototype does not claim a dish is allergy-safe.</p></div>
      <button className="primary-button" onClick={order}>{group ? "CONFIRM FOR GROUP" : "I'LL TAKE IT"} <span>→</span></button>
      <button className="secondary-button" onClick={another}><Icon name="box" size={18} /> Try Another Box</button>
      <button className="edit-link" onClick={onEdit}>Edit preferences</button>
    </main>
  </div>;
}

function GroupSetup({ onBack, find, participants, setParticipants }: { onBack: () => void; find: () => void; participants: Participant[]; setParticipants: (p: Participant[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [allergy, setAllergy] = useState("");
  const [diet, setDiet] = useState("");
  const add = () => { if (!name.trim()) return; setParticipants([...participants, { id: Date.now(), name, allergies: allergy ? [allergy] : [], dietary: diet ? [diet] : [], budget: 15 }]); setName(""); setAllergy(""); setDiet(""); setAdding(false); };
  return <div className="screen scroll-screen">
    <TopBar title="Group Blind Box" onBack={onBack} />
    <main className="page">
      <div className="group-hero"><div className="eyebrow light"><Icon name="users" size={14} /> LUNCH CREW</div><h1>One box. Everyone considered.</h1><p>We'll combine all requirements before picking a meal.</p><div className="avatar-stack">{participants.map(p => <span key={p.id}>{p.name[0]}</span>)}<span>+</span></div></div>
      <div className="section-heading participants-title"><div><h2>Who's eating?</h2><p>{participants.length} participants</p></div><button onClick={() => setAdding(true)}>+ Add person</button></div>
      <div className="participant-list">{participants.map((p, i) => <div className="participant-card" key={p.id}><span className="participant-avatar" style={{ background: ["#E9F7ED", "#FFF0DE", "#EDEBFF"][i % 3] }}>{p.name[0]}</span><div><b>{p.name}{i === 0 && <small>YOU</small>}</b><p>{[...p.allergies.map(a => `${a} allergy`), ...p.dietary].join(" · ") || "No restrictions"}</p><span>Up to S${p.budget} per person</span></div><button onClick={() => { const n = prompt("Update name", p.name); if (n) setParticipants(participants.map(x => x.id === p.id ? { ...x, name: n } : x)); }}>Edit</button></div>)}</div>
      {adding && <div className="add-card"><h3>Add participant</h3><input placeholder="Name or nickname" value={name} onChange={e => setName(e.target.value)} /><div className="two-fields"><select value={allergy} onChange={e => setAllergy(e.target.value)}><option value="">No allergy</option>{allergies.map(a => <option key={a}>{a}</option>)}</select><select value={diet} onChange={e => setDiet(e.target.value)}><option value="">No diet</option>{diets.slice(1).map(d => <option key={d}>{d}</option>)}</select></div><div className="modal-actions"><button onClick={() => setAdding(false)}>Cancel</button><button onClick={add}>Add person</button></div></div>}
      <section className="combine-card"><div className="combine-title"><Icon name="shield" /><div><h3>Combined safety check</h3><p>Known conflicts are excluded for everyone.</p></div></div><div className="combined-chips">{Array.from(new Set(participants.flatMap(p => [...p.allergies.map(a => `No ${a}`), ...p.dietary]))).map(x => <span key={x}>✓ {x}</span>)}</div></section>
      <section className="budget-sliders"><h3>Individual meal budgets</h3><p>Everyone sets their own limit. We'll pick a meal that fits every budget.</p>
        {participants.map(p => <div className="budget-slider" key={p.id}><div><b>{p.name}</b><span>S${p.budget}</span></div>
          <input className="range" type="range" min={5} max={30} step={1} value={p.budget} aria-label={`${p.name}'s meal budget`} style={{ "--fill": `${((p.budget - 5) / 25) * 100}%` } as React.CSSProperties} onChange={e => setParticipants(participants.map(x => x.id === p.id ? { ...x, budget: Number(e.target.value) } : x))} /></div>)}
        <div className="budget-total"><span>Combined meal budget</span><strong>S${participants.reduce((sum, p) => sum + p.budget, 0)}</strong></div>
        <small>Delivery fees are not included.</small>
      </section>
      <button className="primary-button" onClick={find}>FIND A MEAL FOR EVERYONE <Icon name="sparkle" size={18} /></button>
      <p className="action-helper">Safety requirements are never overridden.</p>
    </main>
  </div>;
}

function OrderReview({ meal, group, participants, onBack, home }: { meal: Meal; group: boolean; participants: Participant[]; onBack: () => void; home: () => void }) {
  const qty = group ? Math.max(participants.length, 1) : 1;
  const subtotal = meal.price * qty;
  const total = subtotal + meal.fee;
  const [placed, setPlaced] = useState(false);
  if (placed) return <div className="screen success-screen"><div className="success-check">✓</div><div className="eyebrow">ORDER CONFIRMED</div><h1>Lunch is on the way.</h1><p>{meal.restaurant} is preparing your order.<br />Estimated arrival in {meal.eta}.</p><div className="order-number">ORDER GF-2841</div><button className="primary-button" onClick={home}>BACK TO HOME</button></div>;
  return <div className="screen scroll-screen">
    <TopBar title="Review order" onBack={onBack} />
    <main className="page order-page">
      <div className="eta-card"><span><Icon name="clock" /></span><div><small>ESTIMATED ARRIVAL</small><h2>{meal.eta}</h2><p>From {meal.restaurant}</p></div></div>
      <section className="delivery-card"><div className="order-section-title"><h3>Delivery details</h3><button>Edit</button></div><div className="address-row"><Icon name="pin" /><div><b>One Raffles Place</b><p>1 Raffles Place, Lobby pickup<br />Meet at main entrance</p></div></div></section>
      <section className="delivery-card"><div className="order-section-title"><h3>Your order</h3><span>{qty} {qty > 1 ? "meals" : "meal"}</span></div><div className="cart-item"><img src={meal.image} alt="" /><span className="quantity">{qty}×</span><div><b>{meal.name}</b><p>{meal.restaurant}</p>{group && <small>For {participants.map(p => p.name).join(", ")}</small>}</div><strong>S${subtotal.toFixed(2)}</strong></div></section>
      <section className="delivery-card payment-card"><div className="order-section-title"><h3>Payment</h3><button>Change</button></div><div className="pay-row"><span><Icon name="pay" /></span><b>Visa ending 4242</b><i>Default</i></div><div className="bill"><p><span>Subtotal</span><b>S${subtotal.toFixed(2)}</b></p><p><span>Delivery & service fees</span><b>S${meal.fee.toFixed(2)}</b></p><div><span>Total</span><strong>S${total.toFixed(2)}</strong></div></div></section>
      <div className="notice"><Icon name="shield" size={18} /><p>Remember to confirm ingredients and cross-contact risks with the restaurant if you have allergies.</p></div>
      <button className="primary-button" onClick={() => setPlaced(true)}>PLACE ORDER · S${total.toFixed(2)}</button>
      <p className="action-helper">You won't be charged until you place the order.</p>
    </main>
  </div>;
}

function NoMatch({ group, onBack }: { group: boolean; onBack: () => void }) {
  return <div className="screen no-match-screen">
    <TopBar title="No verified match" onBack={onBack} />
    <main>
      <div className="no-match-icon"><Icon name="search" size={34} /></div>
      <div className="eyebrow">SAFETY COMES FIRST</div>
      <h1>We couldn't verify a suitable meal.</h1>
      <p>{group ? "The combined participant requirements leave no matching meals in this prototype pool." : "No meals match every selected requirement within your current budget and distance."}</p>
      <div className="notice"><Icon name="shield" size={18} /><p>We won't silently ignore allergies or dietary requirements to make a recommendation.</p></div>
      <button className="primary-button" onClick={onBack}>EDIT OPTIONAL PREFERENCES</button>
      <small>Try increasing the budget or radius, or remove an optional cuisine preference. Never relax a safety requirement.</small>
    </main>
  </div>;
}

export default function App() {
  const [saved, setSaved] = useState<SavedPrefs | null>(loadPrefs);
  const [screen, setScreen] = useState<Screen>("home");
  const [group, setGroup] = useState(false);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(saved?.allergies ?? []);
  const [selectedDiets, setSelectedDiets] = useState<string[]>(saved?.diets ?? ["No restrictions"]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(saved?.cuisines ?? []);
  const [radius, setRadius] = useState(saved?.radius ?? 3);
  const [budget, setBudget] = useState(saved?.budget ?? 15);
  const [other, setOther] = useState(saved?.other ?? "");
  const [mealIndex, setMealIndex] = useState(0);
  const [why, setWhy] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "Alex", allergies: ["Peanuts"], dietary: ["No pork"], budget: 12 },
    { id: 2, name: "Jamie", allergies: [], dietary: ["Vegetarian"], budget: 15 },
    { id: 3, name: "Sam", allergies: [], dietary: ["Halal"], budget: 18 },
  ]);
  const eligible = useMemo(() => {
    const requiredDiets = selectedDiets.filter(x => x !== "No restrictions");
    return meals.filter(m => m.price <= budget && m.distance <= radius && !m.allergens.some(a => selectedAllergies.includes(a)) && requiredDiets.every(d => m.dietary.includes(d)) && (selectedCuisines.length === 0 || selectedCuisines.some(c => m.tags.includes(c))));
  }, [budget, radius, selectedAllergies, selectedCuisines, selectedDiets]);
  const groupEligible = useMemo(() => {
    const allA = Array.from(new Set(participants.flatMap(p => p.allergies)));
    const allD = Array.from(new Set(participants.flatMap(p => p.dietary)));
    return meals.filter(m => !m.allergens.some(a => allA.includes(a)) && allD.every(d => m.dietary.includes(d)) && m.price <= Math.min(...participants.map(p => p.budget)));
  }, [participants]);
  const currentPool = group ? groupEligible : eligible;
  const currentMeal = currentPool[mealIndex % currentPool.length] || meals[3];
  const groupRestrictions = Array.from(new Set(participants.flatMap(p => p.allergies)));
  const prefsScreen: Screen = saved ? "summary" : "preferences";
  const lowest = participants.reduce((a, b) => b.budget < a.budget ? b : a, participants[0]);
  const whyText = group
    ? `Its S$${currentMeal.price.toFixed(2)} meal price fits everyone's budget (the lowest is ${lowest?.name}'s S$${lowest?.budget}), and it's ${currentMeal.distance} km away.`
    : `Its S$${currentMeal.price.toFixed(2)} meal price fits your ${budgetLabel(budget)} budget before fees, it's ${currentMeal.distance} km away (within your ${radius} km radius), and it matches ${currentMeal.tags.slice(0, 2).join(" and ").toLowerCase()} preferences.`;
  const goHome = () => { setScreen("home"); setGroup(false); };
  const startBox = () => { setWhy(false); setScreen(group ? "group" : "reveal"); };
  const savePrefs = () => {
    const prefs = { allergies: selectedAllergies, diets: selectedDiets, cuisines: selectedCuisines, radius, budget, other };
    storePrefs(prefs);
    setSaved(prefs);
    startBox();
  };
  const applyPrefs = (p: SavedPrefs) => { setSelectedAllergies(p.allergies); setSelectedDiets(p.diets); setSelectedCuisines(p.cuisines); setRadius(p.radius); setBudget(p.budget); setOther(p.other); };
  const resetPrefs = () => applyPrefs({ allergies: [], diets: ["No restrictions"], cuisines: [], radius: 3, budget: 15, other: "" });
  const leavePrefs = () => { if (saved) { applyPrefs(saved); setScreen("summary"); } else goHome(); };
  const surpriseAgain = () => { setGroup(false); setMealIndex(x => x + 1); setWhy(false); setScreen("reveal"); };
  return <div className="app-shell"><div className="phone"><StatusBar />
    {screen === "home" && <Home go={setScreen} saved={!!saved} again={surpriseAgain} />}
    {screen === "summary" && saved && <PreferenceSummary prefs={saved} onBack={goHome} edit={() => setScreen("preferences")} open={startBox} group={group} setGroup={setGroup} />}
    {screen === "preferences" && <Preferences onBack={leavePrefs} open={savePrefs} reset={resetPrefs} group={group} setGroup={setGroup} selectedAllergies={selectedAllergies} setSelectedAllergies={setSelectedAllergies} selectedDiets={selectedDiets} setSelectedDiets={setSelectedDiets} selectedCuisines={selectedCuisines} setSelectedCuisines={setSelectedCuisines} radius={radius} setRadius={setRadius} budget={budget} setBudget={setBudget} other={other} setOther={setOther} />}
    {screen === "reveal" && <Reveal onBack={() => setScreen(group ? "group" : prefsScreen)} finish={() => setScreen(group ? "groupResult" : "result")} />}
    {screen === "result" && (eligible.length ? <Result meal={currentMeal} restrictions={selectedAllergies} onBack={() => setScreen(prefsScreen)} onEdit={() => setScreen("preferences")} another={() => { setMealIndex(x => x + 1); setWhy(false); }} order={() => setScreen("order")} why={why} setWhy={setWhy} whyText={whyText} /> : <NoMatch group={false} onBack={() => setScreen("preferences")} />)}
    {screen === "group" && <GroupSetup onBack={() => setScreen(prefsScreen)} find={() => { setMealIndex(0); setScreen("reveal"); }} participants={participants} setParticipants={setParticipants} />}
    {screen === "groupResult" && (groupEligible.length ? <Result group meal={currentMeal} restrictions={groupRestrictions} participants={participants} onBack={() => setScreen("group")} onEdit={() => setScreen("group")} another={() => { setMealIndex(x => x + 1); setWhy(false); }} order={() => setScreen("order")} why={why} setWhy={setWhy} whyText={whyText} /> : <NoMatch group onBack={() => setScreen("group")} />)}
    {screen === "order" && <OrderReview meal={currentMeal} group={group} participants={participants} onBack={() => setScreen(group ? "groupResult" : "result")} home={goHome} />}
  </div></div>;
}
