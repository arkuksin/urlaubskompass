"use client";

import { useEffect, useState } from "react";
import DestinationMap, { type MapPlace } from "./DestinationMap";

type PlatformRating = {
  score: string;
  count: string;
  url: string;
};

type Trip = {
  id: string;
  number: string;
  title: string;
  region: string;
  image: string;
  imageAlt: string;
  weather: string[];
  mood: string[];
  range: string[];
  distance: string;
  cost: string;
  mapQuery: string;
  reviews: {
    subject: string;
    google: PlatformRating | null;
    tripadvisor: PlatformRating | null;
  };
  summary: string;
  rhythm: string;
  plan: { time: string; title: string; text: string }[];
  pack: string;
  note?: string;
  officialUrl?: string;
};

const googleMapsSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const trips: Trip[] = [
  {
    id: "lac-ruhig",
    number: "01",
    title: "Strand, Hafen & Tretboot",
    region: "Lac d’Orient · Mesnil-Saint-Père",
    image: "/activities/lac-tretboot.webp",
    imageAlt: "Familie am Strand des Lac d’Orient vor einem Tretboot und dem kleinen Hafen",
    weather: ["sun"],
    mood: ["calm", "water"],
    range: ["near", "full"],
    distance: "37 Min. · 41,8 km ab Ferienhaus",
    cost: "Strand kostenlos",
    mapQuery: "Plage de Mesnil-Saint-Père, Lac d'Orient, France",
    reviews: {
      subject: "Plage de Mesnil-Saint-Père",
      google: { score: "4,5", count: "595", url: googleMapsSearch("Plage de Mesnil-Saint-Père, France") },
      tripadvisor: { score: "3,5", count: "8", url: "https://www.tripadvisor.com/Attraction_Review-g1720851-d23594395-Reviews-Plage_de_Mesnil_St_Pere-Mesnil_Saint_Pere_Aube_Grand_Est.html" },
    },
    summary: "Ein echter Ferientag am See: wenig Programm, viel Wasser, Sand und Zeit zum Treibenlassen.",
    rhythm: "Hafen → Picknick → Baden → Tretboot → Eis",
    plan: [
      { time: "Vormittag", title: "Ankommen", text: "Am Übergang von Sand und Rasen eine Basis einrichten und gemütlich zum Hafen spazieren." },
      { time: "Mittag", title: "Seezeit", text: "Direkt am Wasser picknicken, danach lange baden, spielen oder einfach ausruhen." },
      { time: "Nachmittag", title: "Aufs Wasser", text: "Ein Tretboot mieten; für fünf Personen vorher nach einem größeren Modell fragen." },
      { time: "Ausklang", title: "Langsam zurück", text: "Ein letztes Bad oder ein Eis am Hafen, dann entspannt zum Ferienhaus zurückfahren." },
    ],
    pack: "Badesachen, Picknickdecke, Sonnenschutz, Ball oder Frisbee",
    note: "Tretbootpreis und Bootsgröße bitte vor Ort prüfen.",
  },
  {
    id: "lac-action",
    number: "02",
    title: "Natur & Beaver AquaPark",
    region: "Lac d’Orient · Mesnil-Saint-Père",
    image: "/activities/beaver-aquapark.webp",
    imageAlt: "Familie mit Schwimmwesten auf einem aufblasbaren Hindernisparcours im See",
    weather: ["sun"],
    mood: ["active", "water"],
    range: ["near", "full"],
    distance: "39 Min. · 42,4 km ab Ferienhaus",
    cost: "AquaPark ab 18 € / 1 Std.",
    mapQuery: "Beaver AquaPark, 22 Rue du Lac d'Orient, 10140 Mesnil-Saint-Père, France",
    reviews: {
      subject: "Beaver AquaPark",
      google: { score: "4,5", count: "99", url: googleMapsSearch("Beaver AquaPark Mesnil-Saint-Père") },
      tripadvisor: { score: "4,2", count: "22", url: "https://www.tripadvisor.com/Attraction_Review-g1720851-d17697696-Reviews-Beaver_Aquapark-Mesnil_Saint_Pere_Aube_Grand_Est.html" },
    },
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
    image: "/activities/kletterwald.webp",
    imageAlt: "Kind und Erwachsener gesichert auf einem Kletterparcours zwischen Bäumen am See",
    weather: ["sun", "dry"],
    mood: ["active", "water"],
    range: ["near", "full"],
    distance: "31 Min. · 36,6 km ab Ferienhaus",
    cost: "Kinder 15 €, Erwachsene 20 €",
    mapQuery: "Grimpobranches Orient, Route du Lac, 10270 Lusigny-sur-Barse, France",
    reviews: {
      subject: "Grimpobranches Orient",
      google: { score: "4,7", count: "1.080", url: googleMapsSearch("Grimpobranches Lusigny-sur-Barse") },
      tripadvisor: { score: "4,5", count: "45", url: "https://www.tripadvisor.com/Attraction_Review-g1544737-d7033777-Reviews-Grimpobranches-Lusigny_sur_Barse_Aube_Grand_Est.html" },
    },
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
    image: "/activities/riceys-cadoles.webp",
    imageAlt: "Kinder auf einem Pumptrack vor einer Cadole und grünen Weinbergen bei Les Riceys",
    weather: ["sun", "dry"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "1 Std. 1 Min. · 80,3 km ab Ferienhaus",
    cost: "Nahezu kostenlos",
    mapQuery: "Parc du Château Saint-Louis, Les Riceys, France",
    reviews: {
      subject: "Circuit des Cadoles & Pumptrack",
      google: null,
      tripadvisor: null,
    },
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
    image: "/activities/avize-parc-vix.webp",
    imageAlt: "Familie zwischen Wasserläufen und weißen Kugelinstallationen im Parc Vix vor Weinbergen",
    weather: ["sun", "dry"],
    mood: ["calm", "discover"],
    range: ["full"],
    distance: "1 Std. 1 Min. · 63,8 km ab Ferienhaus",
    cost: "Fast vollständig kostenlos",
    mapQuery: "Parc Vix, Avize, France",
    reviews: {
      subject: "Parc Vix",
      google: { score: "4,5", count: "26", url: googleMapsSearch("Parc Vix Avize France") },
      tripadvisor: null,
    },
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
    image: "/activities/hautvillers-rallye.webp",
    imageAlt: "Familie bei einer Rätsel-Rallye in einer Gasse von Hautvillers mit Weinbergblick",
    weather: ["sun", "dry"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "1 Std. 12 Min. · 96,1 km ab Ferienhaus",
    cost: "Meist kostenlos · Rallye ca. 5 €",
    mapQuery: "Hautvillers, France",
    reviews: {
      subject: "Abteikirche Hautvillers",
      google: { score: "4,6", count: "31", url: googleMapsSearch("Église Saint-Sindulphe Hautvillers") },
      tripadvisor: { score: "4,1", count: "244", url: "https://www.tripadvisor.com/Attraction_Review-g2209359-d6825422-Reviews-Abbaye_Saint_Pierre_d_Hautvillers-Hautvillers_Marne_Grand_Est.html" },
    },
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
    id: "nigloland",
    number: "07",
    title: "Ein ganzer Tag Nigloland",
    region: "Dolancourt · Freizeitpark",
    image: "/activities/nigloland.webp",
    imageAlt: "Familie vor Achterbahn und Wasserbahn in einem begrünten Freizeitpark",
    weather: ["sun", "dry", "mixed"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "53 Min. · 62,6 km ab Ferienhaus",
    cost: "Ab 34 € p. P. online",
    mapQuery: "Nigloland, D619, 10200 Dolancourt, France",
    reviews: {
      subject: "Nigloland",
      google: { score: "4,6", count: "19.557", url: googleMapsSearch("Nigloland Dolancourt") },
      tripadvisor: { score: "4,3", count: "2.168", url: "https://www.tripadvisor.com/Attraction_Review-g672831-d2243995-Reviews-Nigloland-Dolancourt_Aube_Grand_Est.html" },
    },
    summary: "Achterbahnen, Wasserfahrten und ruhigere Familienattraktionen – ein großer Urlaubstag ohne weiteres Programm.",
    rhythm: "Früh starten → Lieblingsfahrten → Picknickpause → zweite Runde",
    plan: [
      { time: "Vormittag", title: "Die Favoriten zuerst", text: "Direkt zu den wichtigsten Fahrgeschäften gehen, solange Wege und Wartezeiten noch kurz sind." },
      { time: "Mittag", title: "Tempo herausnehmen", text: "Picknick oder Restaurantpause einplanen und gemeinsam die zweite Tageshälfte auswählen." },
      { time: "Nachmittag", title: "Freie zweite Runde", text: "Wasserfahrten, Shows und alles nachholen, das morgens auf der Wunschliste gelandet ist." },
      { time: "Ausklang", title: "Ohne Extra-Stopp heim", text: "Der Park ist genug für einen Tag – nach der letzten Runde direkt zum Ferienhaus zurückfahren." },
    ],
    pack: "Bequeme Schuhe, Sonnenschutz, Wasser, leichte Regenjacke",
    note: "Der günstigste datierte Tarif gilt bei Onlinekauf mindestens acht Tage vorher und nach Verfügbarkeit; Kinder unter 1 m sind frei.",
    officialUrl: "https://www.nigloland.fr/toutes-nos-offres",
  },
  {
    id: "vaux",
    number: "08",
    title: "Schlossrätsel & alte Spiele",
    region: "Château de Vaux · Fouchères",
    image: "/activities/chateau-vaux.webp",
    imageAlt: "Familie löst mit Hinweiskarten ein Rätsel vor dem Château de Vaux",
    weather: ["sun", "dry", "mixed"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "45 Min. · 48,5 km ab Ferienhaus",
    cost: "Erw. 10 € · Kinder 8 €",
    mapQuery: "Château de Vaux, 10260 Fouchères, France",
    reviews: {
      subject: "Château de Vaux",
      google: { score: "4,4", count: "1.034", url: googleMapsSearch("Château de Vaux Fouchères") },
      tripadvisor: { score: "4,4", count: "114", url: "https://www.tripadvisor.com/Attraction_Review-g1370426-d8595745-Reviews-Chateau_De_Vaux-Foucheres_Aube_Grand_Est.html" },
    },
    summary: "Ein Schlossbesuch, der sich wie ein gemeinsames Detektivspiel anfühlt – mit Rätseln in 20 Räumen und Spielen im Park.",
    rhythm: "Schloss-Ermittlung → Picknick → historische Spiele → Parkrunde",
    plan: [
      { time: "Vormittag", title: "Vidocqs Spur aufnehmen", text: "Als Team durch die Schlossräume gehen, Hinweise kombinieren und das Geheimnis lösen." },
      { time: "Mittag", title: "Picknick am Schloss", text: "Draußen Pause machen und die besten Verdächtigungen miteinander vergleichen." },
      { time: "Nachmittag", title: "Spiele im Park", text: "Historische Holzspiele ausprobieren, den Spielplatz nutzen und das Gelände erkunden." },
      { time: "Ausklang", title: "Kleine Dorfrunde", text: "Wenn noch Energie da ist, kurz durch Fouchères spazieren; sonst entspannt zurückfahren." },
    ],
    pack: "Picknick, Wasser, bequeme Schuhe, leichte Jacke für die Schlossräume",
    note: "Das Ermittlerspiel ist für Teams von zwei bis sechs Personen angelegt und damit ideal für euch fünf.",
    officialUrl: "https://www.chateau-vaux.com/le-chateau/preparer-ma-visite/tarifs/",
  },
  {
    id: "espace-faune",
    number: "09",
    title: "Bisons, Elche & Beobachterpfad",
    region: "Espace Faune · Forêt d’Orient",
    image: "/activities/espace-faune.webp",
    imageAlt: "Familie beobachtet mit Ferngläsern Bisons und einen Hirsch auf einer großen Waldwiese",
    weather: ["sun", "dry"],
    mood: ["calm", "active", "discover"],
    range: ["near", "full"],
    distance: "40 Min. · 37,4 km ab Ferienhaus",
    cost: "Erw. 7 € · Kinder 5 €",
    mapQuery: "Espace Faune de la Forêt d'Orient, Chemin du Gaty, 10220 Piney, France",
    reviews: {
      subject: "Espace Faune",
      google: { score: "4,3", count: "300", url: googleMapsSearch("Espace Faune de la Forêt d'Orient Piney") },
      tripadvisor: { score: "3,9", count: "8", url: "https://www.tripadvisor.com/Attraction_Review-g1055964-d21209907-Reviews-Espace_Faune_de_la_Foret_d_Orient-Piney_Aube_Grand_Est.html" },
    },
    summary: "Auf einem 2,5-km-Pfad leben Bisons, Elche, Auerochsen und Wildpferde in großen, naturnahen Gehegen.",
    rhythm: "Tierpfad → Beobachtungsposten → Picknick → See oder Maison du Parc",
    plan: [
      { time: "Vormittag", title: "Leise auf Tier-Suche", text: "Den Rundweg langsam gehen und an den Beobachtungsposten nach großen Pflanzenfressern Ausschau halten." },
      { time: "Mittag", title: "Picknick im Grünen", text: "Die vorhandenen Picknicktische nutzen und Fernglas-Funde miteinander vergleichen." },
      { time: "Nachmittag", title: "Tag flexibel verlängern", text: "Je nach Energie zur Maison du Parc oder noch kurz an den nahen Lac d’Orient wechseln." },
      { time: "Ausklang", title: "Lieblingstier küren", text: "Vor der Rückfahrt jedes Familienmitglied seinen besten Fund wählen lassen." },
    ],
    pack: "Fernglas, Wasser, Picknick, feste Schuhe, Mückenschutz",
    note: "Freie Besichtigung etwa 1½ Stunden; Haustiere sind auf dem Gelände nicht erlaubt.",
    officialUrl: "https://www.pnr-foret-orient.fr/pratique/centre-de-ressources/brochure-de-lespace-faune-de-la-foret-dorient-2026/",
  },
  {
    id: "troyes",
    number: "10",
    title: "Vitrail-Rätsel & Altstadt",
    region: "Troyes · kurzer Stadt-Ausflug",
    image: "/activities/troyes-vitrail.webp",
    imageAlt: "Familie löst mit einem Spieleheft Aufgaben vor farbigen Glasfenstern in Troyes",
    weather: ["sun", "dry", "mixed"],
    mood: ["calm", "discover"],
    range: ["near", "full"],
    distance: "24 Min. · 24,8 km ab Ferienhaus",
    cost: "Grundprogramm kostenlos",
    mapQuery: "Cité du Vitrail, 31 Quai des Comtes de Champagne, 10000 Troyes, France",
    reviews: {
      subject: "Cité du Vitrail",
      google: { score: "4,6", count: "749", url: googleMapsSearch("Cité du Vitrail Troyes") },
      tripadvisor: { score: "4,0", count: "152", url: "https://www.tripadvisor.com/Attraction_Review-g187138-d4545183-Reviews-Cite_du_Vitrail-Troyes_Aube_Grand_Est.html" },
    },
    summary: "Ein unkomplizierter Mix aus kostenlosem Familienrätsel, leuchtenden Glasfenstern und Troyes’ verwinkelter Altstadt.",
    rhythm: "Cité du Vitrail → Altstadt-Picknick → Ruelle des Chats → Park",
    plan: [
      { time: "Vormittag", title: "Licht und Rätsel", text: "In der Cité du Vitrail das kostenlose Spieleheft für 6–12-Jährige holen und gemeinsam die Details suchen." },
      { time: "Mittag", title: "In der Altstadt", text: "Zwischen Fachwerkhäusern essen und anschließend ohne festen Kurs durch das historische Zentrum ziehen." },
      { time: "Nachmittag", title: "Kleine Stadt-Challenge", text: "Ruelle des Chats, Herz von Troyes und die schiefsten Häuser auf Familienfotos sammeln." },
      { time: "Ausklang", title: "Grün oder Eis", text: "Je nach Laune im Parc des Moulins auslaufen oder in der Stadt ein Eis holen." },
    ],
    pack: "Bequeme Schuhe, kleine Stifte, Wasser; bei Sonne Picknickdecke",
    note: "Die Familienmaterialien im permanenten Rundgang sind kostenlos; Sonderausstellungen und vermittelte Workshops können extra kosten.",
    officialUrl: "https://cite-vitrail.fr/fr/famille",
  },
  {
    id: "provins",
    number: "11",
    title: "Mittelalterstadt Provins",
    region: "Provins · UNESCO-Altstadt",
    image: "/activities/provins.webp",
    imageAlt: "Familie entdeckt die mittelalterlichen Mauern und den Tour César in Provins",
    weather: ["sun", "dry", "mixed"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "1 Std. 8 Min. · 72,9 km ab Ferienhaus",
    cost: "Altstadt frei · Familienpass 49 € online",
    mapQuery: "Office de Tourisme de Provins, Chemin de Villecran, 77160 Provins, France",
    reviews: {
      subject: "Tour César",
      google: { score: "4,5", count: "4.543", url: googleMapsSearch("Tour César Provins") },
      tripadvisor: { score: "4,1", count: "771", url: "https://www.tripadvisor.com/Attraction_Review-g608778-d2323437-Reviews-La_Tour_Cesar-Provins_Seine_et_Marne_Ile_de_France.html" },
    },
    summary: "Türme, Mauern, unterirdische Gänge und mittelalterliche Gassen machen den längsten neuen Ausflug besonders abwechslungsreich.",
    rhythm: "Stadtmauer → Tour César → Picknick → Unterwelt oder freie Gassen",
    plan: [
      { time: "Vormittag", title: "Obere Stadt", text: "An den Mauern starten, zur Tour César gehen und die mittelalterliche Silhouette von oben erleben." },
      { time: "Mittag", title: "Picknick mit Geschichte", text: "Im Grünen an der Stadtmauer pausieren und danach gemeinsam einen zweiten Schwerpunkt wählen." },
      { time: "Nachmittag", title: "Fünf Monumente oder freie Runde", text: "Mit dem Pass etwa Untergrundgänge und Zehntscheune besuchen – oder kostenlos weiter durch die Altstadt ziehen." },
      { time: "Ausklang", title: "Ein letzter Mauerblick", text: "Vor der Rückfahrt eine ruhige Runde entlang der Befestigung machen." },
    ],
    pack: "Feste Schuhe, Picknick, Wasser, leichte Jacke für unterirdische Räume",
    note: "Der Familienpass gilt für zwei Erwachsene und bis zu fünf Kinder von 4–12 Jahren; einzelne Termine können ausgenommen sein.",
    officialUrl: "https://provins.net/le-pass-provins/",
  },
  {
    id: "reims",
    number: "12",
    title: "Königsstadt Reims",
    region: "Reims · Kathedrale & Stadtspaziergang",
    image: "/activities/reims.webp",
    imageAlt: "Familie mit Stadtplan vor der Kathedrale Notre-Dame de Reims",
    weather: ["sun", "dry", "mixed"],
    mood: ["calm", "discover"],
    range: ["full"],
    distance: "1 Std. 7 Min. · 104 km ab Ferienhaus",
    cost: "Grundprogramm kostenlos · Maut/Parken extra",
    mapQuery: "Cathédrale Notre-Dame de Reims, Place du Cardinal Luçon, 51100 Reims, France",
    reviews: {
      subject: "Kathedrale Notre-Dame de Reims",
      google: { score: "4,8", count: "29.192", url: googleMapsSearch("Cathédrale Notre-Dame de Reims") },
      tripadvisor: { score: "4,6", count: "7.889", url: "https://www.tripadvisor.com/Attraction_Review-g187137-d230790-Reviews-Cathedrale_Notre_Dame_de_Reims-Reims_Marne_Grand_Est.html" },
    },
    summary: "Eine kompakte Stadtentdeckung rund um die gewaltige Krönungskathedrale, historische Plätze und eine entspannte Pause im Grünen.",
    rhythm: "Kathedrale → Altstadt → Picknick → Porte de Mars",
    plan: [
      { time: "Vormittag", title: "Die Kathedrale entdecken", text: "Die Fassade gemeinsam nach Engeln, Königen und kleinen Details absuchen und anschließend die farbigen Fenster im Inneren ansehen." },
      { time: "Mittag", title: "Durch die Innenstadt", text: "Über Place Royale und Place Drouet-d’Erlon schlendern und unterwegs picknicken oder in einer Bäckerei einkehren." },
      { time: "Nachmittag", title: "Römische Spuren", text: "Zu den Halles du Boulingrin und zur Porte de Mars laufen; kleine Suchaufgaben halten den Stadtweg für Kinder lebendig." },
      { time: "Ausklang", title: "Grüne Pause", text: "In den Hautes Promenades spielen und ausruhen, bevor es zurück zum Ferienhaus geht." },
    ],
    pack: "Bequeme Schuhe, Wasser, kleiner Stadtplan, Sonnenschutz",
    note: "Die Kathedrale ist frei zugänglich; Gottesdienste und Sonderveranstaltungen können den Besuch beeinflussen.",
    officialUrl: "https://www.cathedrale-reims.fr/",
  },
  {
    id: "paris",
    number: "13",
    title: "Paris & Eiffelturm",
    region: "Paris · großer Tagesausflug",
    image: "/activities/paris.webp",
    imageAlt: "Familie blickt von den Trocadéro-Gärten auf den Eiffelturm",
    weather: ["sun", "dry", "mixed"],
    mood: ["active", "discover"],
    range: ["full"],
    distance: "2 Std. 25 Min. · 202 km ab Ferienhaus",
    cost: "Stadtprogramm kostenlos · Maut/Parken/Metro extra",
    mapQuery: "Tour Eiffel, 5 Avenue Anatole France, 75007 Paris, France",
    reviews: {
      subject: "Eiffelturm",
      google: { score: "4,7", count: "483.204", url: googleMapsSearch("Tour Eiffel Paris") },
      tripadvisor: { score: "4,6", count: "143.986", url: "https://www.tripadvisor.com/Attraction_Review-g187147-d188151-Reviews-Eiffel_Tower-Paris_Ile_de_France.html" },
    },
    summary: "Der weiteste Ausflug – dafür ein ganzer Paris-Tag mit Eiffelturm, Seine und genau einer überschaubaren Stadtroute.",
    rhythm: "Früh los → Trocadéro → Seine → Tuilerien → heim",
    plan: [
      { time: "Früh", title: "Entspannt hinein", text: "Sehr früh starten und außerhalb des Zentrums parken; für die letzten Kilometer Metro oder RER nutzen." },
      { time: "Vormittag", title: "Der große Blick", text: "Vom Trocadéro zum Eiffelturm gehen, Fotos machen und die Größe direkt unter der Konstruktion erleben." },
      { time: "Mittag", title: "An der Seine", text: "Am Fluss picknicken und anschließend eine einzige, gut machbare Strecke Richtung Place de la Concorde wählen." },
      { time: "Nachmittag", title: "Tuilerien statt To-do-Liste", text: "Im Jardin des Tuileries Pause machen, Karussell oder Spielplatz mitnehmen und rechtzeitig die Rückfahrt beginnen." },
    ],
    pack: "Sehr bequeme Schuhe, Wasser, Snacks, leichte Jacke, geladene Fahrkarten-App",
    note: "Google Maps zeigte am 25.07.2026 rund 2½ Stunden pro Strecke bei normalem Verkehr. Paris nur mit frühem Start und großzügigem Rückfahrtpuffer planen.",
    officialUrl: "https://www.toureiffel.paris/de",
  },
];

const stopover: Trip = {
  id: "namur",
  number: "→",
  title: "Zitadelle & Flüsse-Rallye",
  region: "Namur · Stopp auf der An- oder Abreise",
  image: "/activities/namur-zitadelle.webp",
  imageAlt: "Familie mit Stadtplan am Aussichtspunkt der Zitadelle über Namur und den beiden Flüssen",
  weather: ["sun", "dry", "mixed"],
  mood: ["calm", "active", "discover"],
  range: ["travel"],
  distance: "Etwa 3 Std. Aufenthalt",
  cost: "Grundprogramm kostenlos",
  mapQuery: "Citadelle de Namur, Route Merveilleuse, Namur, Belgium",
  reviews: {
    subject: "Zitadelle von Namur",
    google: { score: "4,5", count: "17.308", url: googleMapsSearch("Citadelle de Namur") },
    tripadvisor: { score: "4,3", count: "1.249", url: "https://www.tripadvisor.com/Attraction_Review-g188663-d536242-Reviews-Citadelle_Citadel-Namur_The_Ardennes_Wallonia.html" },
  },
  summary: "Kein Ausflug ab dem Ferienhaus: Namur ist eine optionale Pause auf der langen Reisestrecke – mit Bewegung, Aussicht und einem klaren Zeitrahmen.",
  rhythm: "Le Grognon → Altstadt → Zitadelle → weiterfahren",
  plan: [
    { time: "20 Min.", title: "Zwei Flüsse", text: "Am Grognon den Zusammenfluss von Sambre und Maas entdecken und Boote beobachten." },
    { time: "45 Min.", title: "Stadt-Rallye", text: "Belfried, besondere Gassen und Kunstfiguren in der Altstadt suchen." },
    { time: "60–90 Min.", title: "Zitadelle", text: "Mauern, alte Tore und Aussichtspunkte frei erkunden; der Fußweg hinauf ist steil." },
    { time: "Optional", title: "Schlechtwetter-Puffer", text: "Terra Nova mit Kinder-Audioguide besuchen oder Touristenzug beziehungsweise Seilbahn wählen." },
  ],
  pack: "Bequeme Schuhe, Wasser, Snack; bei Regen eine leichte Jacke",
  note: "Die genaue Einbindung hängt von eurer Anreiseroute ab; den Stopp deshalb vor Abfahrt in der Gesamtroute prüfen.",
  officialUrl: "https://citadelle.namur.be/",
};

const holidayHome = "17 Rue du Moulin, 10700 Saint-Remy-sous-Barbuise, France";

const coordinatesById: Record<string, [number, number]> = {
  "lac-ruhig": [48.2486804, 4.3336143],
  "lac-action": [48.2551035, 4.3408905],
  kletterwald: [48.26382, 4.2958745],
  riceys: [47.9944982, 4.3657721],
  avize: [48.9710543, 4.0011324],
  hautvillers: [49.0830468, 3.9433382],
  nigloland: [48.2614779, 4.6129127],
  vaux: [48.1247403, 4.2622246],
  "espace-faune": [48.2809477, 4.3686851],
  troyes: [48.298578, 4.0787106],
  provins: [48.5609345, 3.2811352],
  reims: [49.253828, 4.0340474],
  paris: [48.8584011, 2.294499],
  namur: [50.459349, 4.8614296],
};

const mapPlaces: MapPlace[] = [
  {
    id: "holiday-home",
    number: "⌂",
    title: "Ferienwohnung",
    subtitle: "17 Rue du Moulin · Saint-Remy-sous-Barbuise",
    coordinates: [48.4837869, 4.1208245],
    mapQuery: holidayHome,
    kind: "home",
  },
  ...trips.map((trip) => ({
    id: trip.id,
    number: trip.number,
    title: trip.title,
    subtitle: `${trip.distance.split(" · ")[0]} · ${trip.region}`,
    coordinates: coordinatesById[trip.id],
    mapQuery: trip.mapQuery,
    kind: "destination" as const,
  })),
  {
    id: stopover.id,
    number: stopover.number,
    title: "Namur als Reisepause",
    subtitle: stopover.region,
    coordinates: coordinatesById.namur,
    mapQuery: stopover.mapQuery,
    kind: "stopover",
  },
];

function ReviewScores({ trip, compact = false }: { trip: Trip; compact?: boolean }) {
  const platforms = [
    { name: "Google", rating: trip.reviews.google },
    { name: "Tripadvisor", rating: trip.reviews.tripadvisor },
  ];

  return (
    <div className={`review-scores ${compact ? "compact" : ""}`} aria-label={`Bewertungen für ${trip.reviews.subject}`}>
      <p className="review-subject">{compact ? "Bewertet:" : "Bewertungen für"} <b>{trip.reviews.subject}</b>{!compact && <span>Stand 24.07.2026</span>}</p>
      <div className="review-platforms">
        {platforms.map(({ name, rating }) => {
          const content = rating ? (
            <><span>{name}</span><strong><i aria-hidden="true">★</i> {rating.score}</strong><small>{rating.count} Bewertungen</small></>
          ) : (
            <><span>{name}</span><strong>—</strong><small>kein eigener Eintrag</small></>
          );

          return compact || !rating ? (
            <div className={`review-chip ${rating ? "" : "unavailable"}`} key={name}>{content}</div>
          ) : (
            <a className="review-chip" href={rating.url} target="_blank" rel="noreferrer" key={name}>{content}</a>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [openTrip, setOpenTrip] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("urlaub-favoriten");
    if (!stored) return;

    const timer = window.setTimeout(() => setSaved(JSON.parse(stored)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function openIdea(id: string) {
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
          <span>13 Ziele + 1 Reisestopp</span>
          <span className="meta-dot" aria-hidden="true" />
          <span>ab eurem Ferienhaus</span>
        </div>
      </header>

      <section className="hero" id="start">
        <div className="hero-copy">
          <p className="eyebrow">Champagne · Aube · Paris · Namur</p>
          <h1>Alle Ziele <em>auf einen Blick.</em></h1>
          <p className="hero-intro">Vom Ferienhaus bis Paris: Die Karte zeigt euch sofort, wo alle Ideen liegen. Darunter findet ihr für jedes Ziel den fertigen Tagesplan.</p>
        </div>
        <div className="sun-orbit" aria-hidden="true">
          <span className="sun-core">13</span>
          <span className="orbit-label">Ziele<br />zum Entdecken</span>
        </div>
      </section>

      <section className="map-section" aria-labelledby="map-title">
        <div className="map-heading">
          <div>
            <p className="eyebrow">Die ganze Umgebung</p>
            <h2 id="map-title">Euer Urlaub auf der Karte.</h2>
          </div>
          <p>Auf einen Marker tippen, um Ziel, Fahrzeit und Route zu sehen. Die Karte lässt sich verschieben und zoomen.</p>
        </div>
        <DestinationMap places={mapPlaces} />
        <div className="map-legend" aria-label="Kartenlegende">
          <span><i className="legend-home">⌂</i> Ferienwohnung</span>
          <span><i className="legend-destination">01</i> Ziel</span>
          <span><i className="legend-stopover">→</i> Reisestopp Namur</span>
        </div>
      </section>

      <section className="all-ideas" aria-labelledby="all-ideas-title">
        <div className="all-ideas-header">
          <div>
            <p className="eyebrow">Direkter Einstieg</p>
            <h2 id="all-ideas-title">Alle dreizehn Ziele</h2>
          </div>
          <p>Tippt auf ein Ziel und springt direkt zum Tagesplan. Alle Fahrzeiten starten an eurem Ferienhaus in Saint-Remy-sous-Barbuise.</p>
        </div>
        <div className="idea-links">
          {trips.map((trip) => (
            <button className="idea-jump" type="button" key={trip.id} onClick={() => openIdea(trip.id)}>
              <span className="idea-image">
                <img src={trip.image} alt={trip.imageAlt} loading="lazy" />
                <i>{trip.number}</i>
              </span>
              <strong>{trip.title}</strong>
              <small>{trip.region}</small>
              <div className="idea-meta" aria-label={`Fahrzeit ${trip.distance.split(" · ")[0]}, Kosten ${trip.cost}`}>
                <p className="idea-time"><span>Fahrzeit</span><b>{trip.distance.split(" · ")[0]}</b></p>
                <p className="idea-price"><span>Kosten</span><b>{trip.cost}</b></p>
              </div>
              <ReviewScores trip={trip} compact />
            </button>
          ))}
        </div>
      </section>

      <section className="planner-shell" aria-labelledby="destinations-title">
          <div className="results-panel destinations-panel">
            <div className="results-heading">
              <div>
                <p className="eyebrow">Ziele & fertige Tagespläne</p>
                <h2 id="destinations-title">Einfach ein Ziel aussuchen.</h2>
                <p>Keine Fragen, kein Ranking: Hier stehen alle Ziele in derselben Reihenfolge wie auf der Karte.</p>
              </div>
              <span className="saved-count">{saved.length ? `${saved.length} Favorit${saved.length > 1 ? "en" : ""} gemerkt` : "♡ Favoriten auf diesem Gerät merken"}</span>
            </div>

            <div className="trip-list">
              {trips.map((trip) => {
                const isOpen = openTrip === trip.id;
                const isSaved = saved.includes(trip.id);
                return (
                  <article className="trip-card" key={trip.id} id={`trip-${trip.id}`}>
                    <div className="trip-index">
                      <span>{trip.number}</span>
                      <small>Ziel</small>
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
                      <div className="trip-visual">
                        <img src={trip.image} alt={trip.imageAlt} loading="lazy" />
                        <span>{trip.region}</span>
                      </div>
                      <p className="trip-summary">{trip.summary}</p>
                      <div className="fact-row">
                        <div className="fact-card fact-time">
                          <small>Fahrzeit ab Ferienhaus</small>
                          <strong>{trip.distance}</strong>
                        </div>
                        <div className="fact-card fact-cost">
                          <small>Kosten</small>
                          <strong>{trip.cost}</strong>
                        </div>
                        <a
                          className="map-link"
                          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(holidayHome)}&destination=${encodeURIComponent(trip.mapQuery)}&travelmode=driving`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Route ab Ferienhaus ↗
                        </a>
                      </div>
                      <ReviewScores trip={trip} />
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

          </div>
      </section>

      <section className="stopover-section" aria-labelledby="stopover-title">
        <div className="stopover-label">Reisestopp · kein Ausflug ab Ferienhaus</div>
        <div className="stopover-grid">
          <div className="stopover-intro">
            <div className="stopover-image"><img src={stopover.image} alt={stopover.imageAlt} loading="lazy" /></div>
            <p className="eyebrow">Für die An- oder Abreise</p>
            <h2 id="stopover-title">Namur als Reisepause.</h2>
            <p>{stopover.summary}</p>
            <div className="stopover-facts">
              <div className="fact-card fact-time"><small>Zeit vor Ort</small><strong>{stopover.distance}</strong></div>
              <div className="fact-card fact-cost"><small>Kosten</small><strong>{stopover.cost}</strong></div>
            </div>
            <ReviewScores trip={stopover} />
            <div className="stopover-links">
              <a
                className="map-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stopover.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
              >Zitadelle in Google Maps ↗</a>
              {stopover.officialUrl && <a href={stopover.officialUrl} target="_blank" rel="noreferrer">Offizielle Informationen ↗</a>}
            </div>
          </div>
          <div className="stopover-plan">
            <p className="rhythm"><b>So passt der Stopp dazwischen</b>{stopover.rhythm}</p>
            {stopover.plan.map((item) => (
              <div className="stopover-step" key={`stopover-${item.time}`}>
                <span>{item.time}</span>
                <div><strong>{item.title}</strong><p>{item.text}</p></div>
              </div>
            ))}
            <p className="stopover-note"><b>Vorher prüfen:</b> {stopover.note}</p>
          </div>
        </div>
      </section>

      <section className="footer-note">
        <p className="eyebrow">Ein kleiner Urlaubsgrundsatz</p>
        <blockquote>„Eine schöne Hauptidee und genug Zeit zum Treibenlassen.“</blockquote>
        <p>Dreizehn Ziele und der Namur-Reisestopp sind jetzt gemeinsam auf der Karte sichtbar. Die Angaben basieren auf euren Urlaubsunterlagen und ergänzender Recherche. Fahrzeiten sowie Google- und Tripadvisor-Bewertungen wurden am 24./25.07.2026 geprüft und können sich ändern. Kosten und Öffnungszeiten bitte kurz vor der Abfahrt prüfen.</p>
      </section>
    </main>
  );
}
