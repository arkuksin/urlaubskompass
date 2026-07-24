"use client";

import { useEffect, useMemo, useState } from "react";

type ChoiceKey = "weather" | "mood" | "range";

type Trip = {
  id: string;
  number: string;
  title: string;
  region: string;
  weather: string[];
  mood: string[];
  range: string[];
  distance: string;
  cost: string;
  mapQuery: string;
  summary: string;
  rhythm: string;
  plan: { time: string; title: string; text: string }[];
  pack: string;
  note?: string;
  officialUrl?: string;
};

const trips: Trip[] = [
  {
    id: "lac-ruhig",
    number: "01",
    title: "Strand, Hafen & Tretboot",
    region: "Lac d’Orient · Mesnil-Saint-Père",
    weather: ["sun"],
    mood: ["calm", "water"],
    range: ["near", "full"],
    distance: "ca. 30 Min. ab Troyes",
    cost: "Strand kostenlos",
    mapQuery: "Plage de Mesnil-Saint-Père, Lac d'Orient, France",
    summary: "Ein echter Ferientag am See: wenig Programm, viel Wasser, Sand und Zeit zum Treibenlassen.",
    rhythm: "Hafen → Picknick → Baden → Tretboot → Eis",
    plan: [
      { time: "Vormittag", title: "Ankommen", text: "Am Übergang von Sand und Rasen eine Basis einrichten und gemütlich zum Hafen spazieren." },
      { time: "Mittag", title: "Seezeit", text: "Direkt am Wasser picknicken, danach lange baden, spielen oder einfach ausruhen." },
      { time: "Nachmittag", title: "Aufs Wasser", text: "Ein Tretboot mieten; für fünf Personen vorher nach einem größeren Modell fragen." },
      { time: "Ausklang", title: "Langsam zurück", text: "Ein letztes Bad oder ein Eis am Hafen, dann entspannt nach Troyes fahren." },
    ],
    pack: "Badesachen, Picknickdecke, Sonnenschutz, Ball oder Frisbee",
    note: "Tretbootpreis und Bootsgröße bitte vor Ort prüfen.",
  },
  {
    id: "lac-action",
    number: "02",
    title: "Natur & Beaver AquaPark",
    region: "Lac d’Orient · Mesnil-Saint-Père",
    weather: ["sun"],
    mood: ["active", "water"],
    range: ["near", "full"],
    distance: "ca. 30 Min. ab Troyes",
    cost: "AquaPark ab 18 € / 1 Std.",
    mapQuery: "Beaver AquaPark, 22 Rue du Lac d'Orient, 10140 Mesnil-Saint-Père, France",
    summary: "Erst eine kleine Entdeckertour am See, dann Wassertrampoline, Rutschen und Balancehindernisse.",
    rhythm: "Naturweg → Picknick → Baden → AquaPark",
    plan: [
      { time: "Vormittag", title: "Entdecken", text: "Vom eingerichteten Strandplatz zu einer lockeren Runde von vier bis fünf Kilometern starten." },
      { time: "Mittag", title: "Pause", text: "Zum Strand zurückkehren, picknicken, trinken und vor der Action etwas ruhen." },
      { time: "Nachmittag", title: "AquaPark", text: "Für eine oder zwei Stunden auf den schwimmenden Parcours; beide Kinder müssen sicher schwimmen." },
      { time: "Ausklang", title: "Trocknen & Eis", text: "Am Strand zusammenpacken und den Tag ruhig am Wasser beenden." },
    ],
    pack: "Badesachen, Handtücher, Wasser, Sonnenschutz, Wechselkleidung",
    note: "Stand 24.07.2026: Park XL ab 8 Jahren und 1,20 m; im Juli/August täglich 11–19 Uhr.",
    officialUrl: "https://www.beaver-aquapark.fr/les-tarifs",
  },
  {
    id: "kletterwald",
    number: "03",
    title: "Kletterwald & Strand",
    region: "Grimpobranches · Lac d’Orient",
    weather: ["sun", "dry"],
    mood: ["active", "water"],
    range: ["near", "full"],
    distance: "ca. 30 Min. ab Troyes",
    cost: "Kinder 15 €, Erwachsene 20 €",
    mapQuery: "Grimpobranches Orient, Route du Lac, 10270 Lusigny-sur-Barse, France",
    summary: "Ein sportlicher Vormittag zwischen den Bäumen und danach ein ganz freier Nachmittag am See.",
    rhythm: "Klettern → Picknick → Strand → Baden",
    plan: [
      { time: "Vormittag", title: "In die Höhe", text: "Nach Einweisung und Testparcours Schritt für Schritt zu schwierigeren Routen wechseln." },
      { time: "Mittag", title: "Stimmungswechsel", text: "Die kurze Strecke zum See fahren und dort erst einmal in Ruhe picknicken." },
      { time: "Nachmittag", title: "Alles kann", text: "Baden, Ball spielen, Sandburgen bauen oder einfach auf der Decke liegen." },
      { time: "Ausklang", title: "Eis am Wasser", text: "Ohne weiteren Programmpunkt den Tag am See ausklingen lassen." },
    ],
    pack: "Geschlossene Schuhe, Sportkleidung, Badesachen, Wasser, kleiner Snack",
    note: "Bodenbegleitung ist kostenlos; eine Reservierung ist bei weniger als sechs Teilnehmenden nicht nötig.",
    officialUrl: "https://www.grimpobranches-lusigny.com/tarifs-horaires",
  },
  {
    id: "riceys",
    number: "04",
    title: "Cadoles & Pumptrack",
    region: "Les Riceys · Côte des Bar",
    weather: ["sun", "dry"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "ca. 50–55 km ab Troyes",
    cost: "Nahezu kostenlos",
    mapQuery: "Parc du Château Saint-Louis, Les Riceys, France",
    summary: "Leichte Weinbergwanderung, versteckte Steinhütten und ein Spielplatz mit Pumptrack als Belohnung.",
    rhythm: "Weinberge → Picknick → Pumptrack → Dorf",
    plan: [
      { time: "10:00", title: "Cadoles suchen", text: "Die 6,56 km lange, leichte Rundwanderung durch Weinberge und Waldränder beginnen." },
      { time: "12:30", title: "Picknick", text: "Im Parc du Château Saint-Louis essen und danach auf Spielplatz und Pumptrack wechseln." },
      { time: "15:00", title: "Drei Dörfer", text: "Winzerhäuser, Kirchen, kleine Brücken und Gassen in Les Riceys entdecken." },
      { time: "17:30", title: "Optionaler Stopp", text: "Auf dem Rückweg im Park von Bar-sur-Seine noch einmal spielen oder spazieren." },
    ],
    pack: "Viel Wasser, Sonnenschutz, feste Schuhe; für den Pumptrack Roller oder Fahrrad",
    note: "Die Weinbergwege bieten im Sommer nur wenig Schatten.",
  },
  {
    id: "avize",
    number: "05",
    title: "Parc Vix & Weinberge",
    region: "Avize & Cramant · Côte des Blancs",
    weather: ["sun", "dry"],
    mood: ["calm", "discover"],
    range: ["full"],
    distance: "ca. 1 Std. 25 Min. ab Troyes",
    cost: "Fast vollständig kostenlos",
    mapQuery: "Parc Vix, Avize, France",
    summary: "Weite Ausblicke, Wasserläufe, Klangstationen und ruhige Grand-Cru-Dörfer in einem entspannten Tag.",
    rhythm: "Parc Vix → Picknick → Avize → Cramant",
    plan: [
      { time: "Vormittag", title: "Parc Vix", text: "Wasserbecken, Klanginstrumente und die weißen Champagnerblasen erkunden." },
      { time: "Mittag", title: "Blick in die Reben", text: "Durch Avize spazieren und mit Aussicht über die Weinberge picknicken." },
      { time: "Nachmittag", title: "Cramant", text: "Den Jardin de Vignes besuchen und noch eine kleine Runde zwischen den Reben gehen." },
      { time: "Ausklang", title: "Ohne Eile", text: "Das schönste Familienfoto suchen und die Rückfahrt ruhig angehen." },
    ],
    pack: "Picknick, Wasser, Sonnenschutz, bequeme Schuhe",
  },
  {
    id: "hautvillers",
    number: "06",
    title: "Dorf-Rallye & Schlosspark",
    region: "Hautvillers & Dormans · Marnetal",
    weather: ["sun", "dry"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "ca. 1 Std. 30 Min. ab Troyes",
    cost: "Meist kostenlos · Rallye ca. 5 €",
    mapQuery: "Hautvillers, France",
    summary: "Historische Gassen und Weinberge am Vormittag, danach viel Platz zum Spielen und Durchatmen.",
    rhythm: "Rallye → Reben → Schlosspark → Mémorial",
    plan: [
      { time: "Vormittag", title: "Hautvillers", text: "Schmiedeschilder suchen und optional die etwa 45-minütige Curiocity-Rallye spielen." },
      { time: "Mittag", title: "Circuit des Moines", text: "Eine kurze Weinbergrunde gehen und mit Blick ins Marnetal picknicken." },
      { time: "Nachmittag", title: "Dormans", text: "Im Schlosspark spielen, am Teich pausieren und die großen Wiesen genießen." },
      { time: "Ausklang", title: "Zum Mémorial", text: "Den Weg zum burgähnlichen Denkmal hinaufgehen und den Talblick mitnehmen." },
    ],
    pack: "Picknick, Wasser, bequeme Schuhe, kleine Rätselstifte",
  },
  {
    id: "namur",
    number: "07",
    title: "Zitadelle & Flüsse-Rallye",
    region: "Namur · Reisetag in Belgien",
    weather: ["sun", "dry", "mixed"],
    mood: ["calm", "active", "discover"],
    range: ["travel"],
    distance: "Ideal als 3-Stunden-Zwischenstopp",
    cost: "Grundprogramm kostenlos",
    mapQuery: "Citadelle de Namur, Route Merveilleuse, Namur, Belgium",
    summary: "Festungsmauern, zwei Flüsse und kleine Suchaufgaben machen aus dem Zwischenstopp ein echtes Abenteuer.",
    rhythm: "Le Grognon → Altstadt → Zitadelle → Picknick",
    plan: [
      { time: "20 Min.", title: "Zwei Flüsse", text: "Am Grognon den Zusammenfluss von Sambre und Maas entdecken und Boote beobachten." },
      { time: "45 Min.", title: "Stadt-Rallye", text: "Belfried, besondere Gassen und Kunstfiguren in der Altstadt suchen." },
      { time: "60–90 Min.", title: "Zitadelle", text: "Mauern, alte Tore und Aussichtspunkte frei erkunden; der Fußweg hinauf ist steil." },
      { time: "Optional", title: "Schlechtwetter-Puffer", text: "Terra Nova mit Kinder-Audioguide besuchen oder Touristenzug beziehungsweise Seilbahn wählen." },
    ],
    pack: "Bequeme Schuhe, Wasser, Snack; bei Regen eine leichte Jacke",
    note: "Terra Nova: Erwachsene 6 €, Kinder 6–18 Jahre 5 €; deutscher Kinder-Audioguide inklusive.",
    officialUrl: "https://billetterie.citadelle.namur.be/events/le-petit-train-copy",
  },
];

const questions: { key: ChoiceKey; kicker: string; title: string; hint: string; options: { value: string; label: string; detail: string }[] }[] = [
  {
    key: "weather",
    kicker: "Schritt 1 · Tageslage",
    title: "Wie sieht es draußen aus?",
    hint: "Keine Wetter-App nötig – ein Gefühl für den Tag reicht.",
    options: [
      { value: "sun", label: "Sonne & warm", detail: "Perfekt für Wasser und lange Tage draußen" },
      { value: "dry", label: "Trocken, nicht heiß", detail: "Gutes Wander- und Entdeckerwetter" },
      { value: "mixed", label: "Unbeständig", detail: "Lieber mit flexiblem Plan und Ausweichidee" },
      { value: "any", label: "Noch völlig offen", detail: "Zeig mir später die breiteste Auswahl" },
    ],
  },
  {
    key: "mood",
    kicker: "Schritt 2 · Stimmung",
    title: "Was braucht ihr heute?",
    hint: "Wählt die Energie, die wirklich da ist – nicht die, die im Plan stehen sollte.",
    options: [
      { value: "calm", label: "Leicht & entspannt", detail: "Wenig Wechsel, viel freie Zeit" },
      { value: "active", label: "Bewegung & Action", detail: "Klettern, laufen, springen und spielen" },
      { value: "water", label: "Unbedingt ans Wasser", detail: "Baden, Strand oder AquaPark" },
      { value: "discover", label: "Entdecken & staunen", detail: "Dörfer, Weinberge und kleine Rallyes" },
    ],
  },
  {
    key: "range",
    kicker: "Schritt 3 · Rahmen",
    title: "Wie groß darf der Tag werden?",
    hint: "Der Weg gehört zum Urlaub – aber nicht an jedem Tag gleich viel.",
    options: [
      { value: "near", label: "Nah & unkompliziert", detail: "Etwa 30 Minuten ab Troyes" },
      { value: "full", label: "Ein richtiger Tagesausflug", detail: "Bis etwa 1½ Stunden Anfahrt" },
      { value: "travel", label: "Zwischenstopp auf Reise", detail: "Drei abwechslungsreiche Stunden in Namur" },
      { value: "any", label: "Entfernung ist egal", detail: "Die Stimmung entscheidet" },
    ],
  },
];

const initialChoices = { weather: "", mood: "", range: "" };

function scoreTrip(trip: Trip, choices: typeof initialChoices) {
  const weather = choices.weather === "any" || trip.weather.includes(choices.weather) ? 4 : 0;
  const mood = trip.mood.includes(choices.mood) ? 5 : 0;
  const range = choices.range === "any" || trip.range.includes(choices.range) ? 4 : 0;
  const mixedBonus = choices.weather === "mixed" && trip.id === "namur" ? 2 : 0;
  return weather + mood + range + mixedBonus;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState(initialChoices);
  const [openTrip, setOpenTrip] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("urlaub-favoriten");
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  const rankedTrips = useMemo(
    () => [...trips].sort((a, b) => scoreTrip(b, choices) - scoreTrip(a, choices)),
    [choices],
  );

  const question = questions[step];
  const visibleTrips = showAll ? rankedTrips : rankedTrips.slice(0, 3);

  function choose(key: ChoiceKey, value: string) {
    setChoices((current) => ({ ...current, [key]: value }));
  }

  function next() {
    if (step < 2) setStep((current) => current + 1);
    else setStep(3);
  }

  function restart() {
    setChoices(initialChoices);
    setStep(0);
    setOpenTrip(null);
    setShowAll(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openIdea(id: string) {
    setStep(3);
    setShowAll(true);
    setOpenTrip(id);
    window.setTimeout(() => {
      document.getElementById(`trip-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function toggleSaved(id: string) {
    setSaved((current) => {
      const updated = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("urlaub-favoriten", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#start" aria-label="Urlaubskompass – zum Anfang">
          <span className="brand-mark" aria-hidden="true">U</span>
          <span>Urlaubskompass</span>
        </a>
        <div className="header-meta">
          <span>7 Ideen</span>
          <span className="meta-dot" aria-hidden="true" />
          <span>für eure Familie</span>
        </div>
      </header>

      <section className="hero" id="start">
        <div className="hero-copy">
          <p className="eyebrow">Champagne · Lac d’Orient · Namur</p>
          <h1>Was passt <em>heute</em> zu euch?</h1>
          <p className="hero-intro">Drei kurze Fragen. Danach seht ihr nur die Ausflüge, die sich für diesen Tag wirklich gut anfühlen.</p>
        </div>
        <div className="sun-orbit" aria-hidden="true">
          <span className="sun-core">7</span>
          <span className="orbit-label">gesammelte<br />Tagesideen</span>
        </div>
      </section>

      <section className="all-ideas" aria-labelledby="all-ideas-title">
        <div className="all-ideas-header">
          <div>
            <p className="eyebrow">Direkter Einstieg</p>
            <h2 id="all-ideas-title">Alle sieben Ideen</h2>
          </div>
          <p>Schon entschieden? Springt direkt zum Tagesplan.</p>
        </div>
        <div className="idea-links">
          {trips.map((trip) => (
            <button className="idea-jump" type="button" key={trip.id} onClick={() => openIdea(trip.id)}>
              <span>{trip.number}</span>
              <strong>{trip.title}</strong>
              <small>{trip.region}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="planner-shell" aria-live="polite">
        <div className="progress-row">
          <span>{step < 3 ? `0${step + 1}` : "✓"}</span>
          <div className="progress-track" aria-label={`Planung ${Math.min(step + 1, 3)} von 3`}>
            <i style={{ width: `${step >= 3 ? 100 : ((step + 1) / 3) * 100}%` }} />
          </div>
          <span>{step < 3 ? "03" : "bereit"}</span>
        </div>

        {step < 3 && question ? (
          <div className="question-panel" key={question.key}>
            <div className="question-copy">
              <p className="eyebrow">{question.kicker}</p>
              <h2>{question.title}</h2>
              <p>{question.hint}</p>
            </div>
            <div className="option-grid" role="radiogroup" aria-label={question.title}>
              {question.options.map((option, index) => {
                const selected = choices[question.key] === option.value;
                return (
                  <button
                    className={`option-card ${selected ? "selected" : ""}`}
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => choose(question.key, option.value)}
                  >
                    <span className="option-number">0{index + 1}</span>
                    <strong>{option.label}</strong>
                    <small>{option.detail}</small>
                    <span className="option-check" aria-hidden="true">{selected ? "✓" : "→"}</span>
                  </button>
                );
              })}
            </div>
            <div className="planner-actions">
              {step > 0 ? <button className="text-button" type="button" onClick={() => setStep((current) => current - 1)}>← Zurück</button> : <span />}
              <button className="primary-button" type="button" disabled={!choices[question.key]} onClick={next}>
                {step === 2 ? "Meine Ideen zeigen" : "Weiter"}<span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="results-panel">
            <div className="results-heading">
              <div>
                <p className="eyebrow">Eure Auswahl für heute</p>
                <h2>Das passt am besten.</h2>
                <p>Die Reihenfolge verbindet Wetter, Stimmung und euren Tagesrahmen.</p>
              </div>
              <button className="text-button restart" type="button" onClick={restart}>Auswahl ändern ↺</button>
            </div>

            <div className="trip-list">
              {visibleTrips.map((trip, index) => {
                const isOpen = openTrip === trip.id;
                const isSaved = saved.includes(trip.id);
                return (
                  <article className={`trip-card ${index === 0 ? "top-match" : ""}`} key={trip.id} id={`trip-${trip.id}`}>
                    <div className="trip-index">
                      <span>{trip.number}</span>
                      <small>{index === 0 ? "Beste Idee" : index < 3 ? "Passt gut" : "Weitere Idee"}</small>
                    </div>
                    <div className="trip-main">
                      <div className="trip-title-row">
                        <div>
                          <p className="trip-region">{trip.region}</p>
                          <h3>{trip.title}</h3>
                        </div>
                        <button
                          className={`save-button ${isSaved ? "saved" : ""}`}
                          type="button"
                          aria-label={isSaved ? `${trip.title} aus Favoriten entfernen` : `${trip.title} als Favorit merken`}
                          onClick={() => toggleSaved(trip.id)}
                        >
                          {isSaved ? "♥" : "♡"}
                        </button>
                      </div>
                      <p className="trip-summary">{trip.summary}</p>
                      <div className="fact-row">
                        <span>{trip.distance}</span>
                        <span>{trip.cost}</span>
                        <a
                          className="map-link"
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.mapQuery)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          In Google Maps öffnen ↗
                        </a>
                      </div>
                      <p className="rhythm"><b>So fließt der Tag</b>{trip.rhythm}</p>
                      <button className="details-button" type="button" onClick={() => setOpenTrip(isOpen ? null : trip.id)} aria-expanded={isOpen}>
                        {isOpen ? "Tagesplan schließen" : "Tagesplan öffnen"}<span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                      </button>

                      {isOpen && (
                        <div className="day-plan">
                          <div className="timeline">
                            {trip.plan.map((item) => (
                              <div className="timeline-item" key={`${trip.id}-${item.time}`}>
                                <span>{item.time}</span>
                                <div><strong>{item.title}</strong><p>{item.text}</p></div>
                              </div>
                            ))}
                          </div>
                          <div className="plan-note">
                            <p><b>Einpacken</b>{trip.pack}</p>
                            {trip.note && <p><b>Gut zu wissen</b>{trip.note}</p>}
                            {trip.officialUrl && <a href={trip.officialUrl} target="_blank" rel="noreferrer">Aktuelle offizielle Angaben ↗</a>}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="show-all-row">
              <button className="secondary-button" type="button" onClick={() => setShowAll((current) => !current)}>
                {showAll ? "Nur Top 3 anzeigen" : "Alle 7 Ideen ansehen"}
              </button>
              <span>{saved.length ? `${saved.length} Favorit${saved.length > 1 ? "en" : ""} gemerkt` : "Noch nichts gemerkt"}</span>
            </div>
          </div>
        )}
      </section>

      <section className="footer-note">
        <p className="eyebrow">Ein kleiner Urlaubsgrundsatz</p>
        <blockquote>„Eine schöne Hauptidee und genug Zeit zum Treibenlassen.“</blockquote>
        <p>Alle Vorschläge basieren auf euren sieben Urlaubsunterlagen. Kosten und Öffnungszeiten können sich ändern; kostenpflichtige Angebote bitte kurz vor der Abfahrt prüfen.</p>
      </section>
    </main>
  );
}
