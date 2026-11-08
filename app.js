(function () {
  var app = document.getElementById("app");
  var hero = document.getElementById("hero");
  var searchInput = document.getElementById("q");
  var BOOKS = window.BOOKS || [];
  var BY_ID = {};
  BOOKS.forEach(function (b) { BY_ID[b.id] = b; });

  var LEVEL_TITLE = { sec: "Secondary (Class 10)", sr: "Senior Secondary (Class 12)" };
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    grad: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/><path d="M22 10v6"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7 15h10"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>',
    video: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(name, cls) {
    var s = el("span", "ic" + (cls ? " " + cls : ""));
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.book) + "</svg>";
    return s;
  }
  function internal(href, cls, text) {
    var a = el("a", cls, text);
    a.href = href;
    return a;
  }
  function directPdf(href) { return /\.pdf($|[?#])/i.test(href || ""); }
  function ext(href, cls, text) {
    var a = el("a", cls, text);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (directPdf(href)) {
      a.type = "application/pdf";
      a.addEventListener("click", function (e) {
        if (document.documentElement.classList.contains("edit-on")) return;
        if (!/Android/i.test(navigator.userAgent)) return;
        var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
        if (!standalone || !/^https:\/\//i.test(href)) return;
        e.preventDefault();
        location.href = "intent://" + String(href).replace(/^https:\/\//i, "") + "#Intent;scheme=https;type=application/pdf;action=android.intent.action.VIEW;S.browser_fallback_url=" + encodeURIComponent(href) + ";end";
      });
    }
    return a;
  }
  function load(k, fallback) {
    try { var v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  }
  function save(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function subjColor(t) {
    if (/Math/i.test(t)) return "#1d4ed8";
    if (/Physic/i.test(t)) return "#7c3aed";
    if (/Chemi|Scien|Biol|Envir/i.test(t)) return "#059669";
    if (/Social|Geog|Hist|Polit/i.test(t)) return "#d97706";
    if (/Econ|Account|Business|Entrep/i.test(t)) return "#e11d48";
    if (/Computer|Data Entry/i.test(t)) return "#0284c7";
    return "#0d9488";
  }

  function cleanChapterTitle(raw) {
    var s = String(raw || "").trim();
    s = s.replace(/^(?:chapter|lesson|unit|पाठ|अध्याय)\s*\d+\s*[\.\:\-–—]?\s*/i, "");
    return s || raw;
  }

  /* Read progress */
  var readMap = load("nios-read", {});
  function readOf(b) { return Array.isArray(readMap[b.id]) ? readMap[b.id] : []; }
  function setRead(b, idx, done) {
    var cur = readOf(b).slice();
    var p = cur.indexOf(idx);
    if (done && p === -1) cur.push(idx);
    if (!done && p !== -1) cur.splice(p, 1);
    if (cur.length) readMap[b.id] = cur; else delete readMap[b.id];
    save("nios-read", readMap);
  }

  /* Edit mode state */
  var editMode = !!load("nios-edit", false);
  var edits = load("nios-edits", null);
  if (!edits || typeof edits !== "object") edits = { v: {}, s: {} };
  if (!edits.v) edits.v = {};
  if (!edits.s) edits.s = {};

  function ytId(s) {
    s = String(s || "").trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    var m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  function overrideOf(kind, b, i) {
    var o = edits[kind] && edits[kind][b.id];
    return o && Object.prototype.hasOwnProperty.call(o, String(i)) ? o[String(i)] : null;
  }
  function setOverride(kind, b, i, val) {
    if (!edits[kind]) edits[kind] = {};
    if (!edits[kind][b.id]) edits[kind][b.id] = {};
    if (!val) delete edits[kind][b.id][String(i)];
    else edits[kind][b.id][String(i)] = val;
    if (!Object.keys(edits[kind][b.id]).length) delete edits[kind][b.id];
    save("nios-edits", edits);
  }
  function editCount() {
    var n = 0;
    ["v", "s"].forEach(function (k) {
      Object.keys(edits[k] || {}).forEach(function (id) { n += Object.keys(edits[k][id]).length; });
    });
    return n;
  }
  function setEditMode(on) {
    editMode = !!on;
    save("nios-edit", editMode);
    document.documentElement.classList.toggle("edit-on", editMode);
    var bar = document.getElementById("editBar");
    if (bar) bar.hidden = !editMode;
  }

  var editing = null;
  function openEdit(b, i) {
    editing = { b: b, i: i };
    var sheet = document.getElementById("editSheet");
    document.getElementById("editSheetTitle").textContent = b.t + " · Lesson " + (i + 1);
    document.getElementById("editSheetHint").textContent = b.ch[i][0];
    var v = overrideOf("v", b, i) || "";
    document.getElementById("editVid").value = v ? "https://www.youtube.com/watch?v=" + v : "";
    document.getElementById("editVidErr").hidden = true;
    document.getElementById("editSol").value = overrideOf("s", b, i) || "";
    if (sheet && sheet.showModal) sheet.showModal();
  }

  var installPrompt = null;
  function isInstalled() {
    return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  }

  /* ========================================================================
     HOME VIEW (Curved Navy Header + Equal Course Cards + 2x2 Quick Grid + Spines)
     ======================================================================== */
  function viewHome() {
    var secCount = BOOKS.filter(function (b) { return b.level === "sec"; }).length;
    var srCount = BOOKS.filter(function (b) { return b.level === "sr"; }).length;

    var duo = el("div", "duo");
    [
      { href: "#/sec", badge: "CLASS 10", cnt: secCount + " books", t: "Secondary", d: "Hindi, English, Maths, Science, Social Sci & 17 mediums", cta: "Open Class 10", c: "#1d4ed8" },
      { href: "#/sr", badge: "CLASS 12", cnt: srCount + " books", t: "Sr. Secondary", d: "PCM, PCB, Commerce, Humanities & vocational streams", cta: "Open Class 12", c: "#059669" }
    ].forEach(function (x) {
      var card = internal(x.href, "course-card");
      card.style.setProperty("--c", x.c);
      var ct = el("div", "course-top");
      ct.appendChild(el("span", "course-badge", x.badge));
      ct.appendChild(el("span", "course-cnt", x.cnt));
      card.appendChild(ct);
      card.appendChild(el("b", null, x.t));
      card.appendChild(el("span", "course-desc", x.d));
      var cta = el("span", "course-cta");
      cta.appendChild(el("span", null, x.cta));
      cta.appendChild(el("span", null, "→"));
      card.appendChild(cta);
      duo.appendChild(card);
    });
    app.appendChild(duo);

    var last = BY_ID[load("nios-last", "")];
    if (last) {
      var rc = internal("#/book/" + encodeURIComponent(last.id), "resume-card");
      rc.appendChild(el("span", "resume-mark", last.code));
      var rm = el("div", "resume-mid");
      rm.appendChild(el("small", null, "Continue reading"));
      rm.appendChild(el("b", null, last.t + " (" + last.m + ")"));
      var done = readOf(last).length;
      rm.appendChild(el("span", null, (last.level === "sec" ? "Class 10" : "Class 12") + " · " + done + "/" + last.ch.length + " lessons read"));
      rc.appendChild(rm);
      rc.appendChild(icon("chev"));
      app.appendChild(rc);
    }

    var qgrid = el("div", "quick-grid");
    [
      ["#/papers", "clipboard", "TMA PDFs", "2026 assignments", "#d97706"],
      ["#/papers", "file", "Sample Papers", "68 question sets", "#7c3aed"],
      ["#/labs", "flask", "Lab Manuals", "34 practical guides", "#e11d48"],
      ["#/settings", "download", isInstalled() ? "App Settings" : "Install App", isInstalled() ? "Theme & offline cache" : "Add to home screen", "#0284c7"]
    ].forEach(function (p, idx) {
      var a = internal(p[0], "qcard");
      a.style.setProperty("--c", p[4]);
      var ic = el("span", "qcard-ic");
      ic.appendChild(icon(p[1]));
      a.appendChild(ic);
      var tx = el("div", "qcard-txt");
      tx.appendChild(el("b", null, p[2]));
      tx.appendChild(el("small", null, p[3]));
      a.appendChild(tx);
      if (idx === 3 && installPrompt) {
        a.addEventListener("click", function (e) {
          if (installPrompt) {
            e.preventDefault();
            var pr = installPrompt;
            installPrompt = null;
            pr.prompt();
          }
        });
      }
      qgrid.appendChild(a);
    });
    app.appendChild(qgrid);

    var sh = el("div", "sec-head");
    sh.appendChild(el("h2", null, "Popular Textbooks"));
    sh.appendChild(internal("#/sec", null, "Browse all " + BOOKS.length + " →"));
    app.appendChild(sh);

    var shelf = el("div", "shelf-grid");
    [
      ["sec-211-en", "211", "Mathematics", "26 ch · Eng", "#1d4ed8"],
      ["sec-212-en", "212", "Science & Tech", "33 ch · Eng", "#059669"],
      ["sr-312-en", "312", "Physics (12th)", "32 ch · Eng", "#7c3aed"],
      ["sec-213-en", "213", "Social Science", "28 ch · Eng", "#d97706"],
      ["sr-313-en", "313", "Chemistry", "35 ch · Eng", "#e11d48"],
      ["sr-320-en", "320", "Accountancy", "37 ch · Eng", "#0d9488"]
    ].forEach(function (b) {
      var card = internal("#/book/" + b[0], "spine-card");
      var sp = el("div", "spine-cover");
      sp.style.setProperty("--c", b[4]);
      sp.appendChild(el("small", null, "Code " + b[1]));
      sp.appendChild(el("b", null, b[2]));
      card.appendChild(sp);
      card.appendChild(el("div", "spine-meta", b[3]));
      shelf.appendChild(card);
    });
    app.appendChild(shelf);

    var sb = el("div", "stats-bar");
    [[String(BOOKS.length), "books"], ["2,550", "lesson PDFs"], ["17", "mediums"]].forEach(function (s) {
      var c = el("div", "stat-cell");
      c.appendChild(el("b", null, s[0]));
      c.appendChild(el("span", null, s[1]));
      sb.appendChild(c);
    });
    app.appendChild(sb);
  }

  /* ========================================================================
     COURSE LEVEL VIEW (Secondary 10th / Senior Secondary 12th)
     ======================================================================== */
  var currentMed = load("nios-medium", "All");
  function subjectRow(b) {
    var a = internal("#/book/" + encodeURIComponent(b.id), "subj-row");
    var col = subjColor(b.t);
    a.style.setProperty("--c", col);
    var cd = el("span", "subj-code");
    cd.appendChild(el("small", null, "Code"));
    cd.appendChild(el("span", null, b.code));
    a.appendChild(cd);

    var mid = el("div", "subj-mid");
    mid.appendChild(el("b", null, b.t));
    mid.appendChild(el("small", null, b.m + " · " + b.ch.length + (b.ch.length === 1 ? " lesson" : " lessons")));
    if (b.extra && b.extra.length) {
      var tags = el("div", "subj-tags");
      var seen = {};
      b.extra.forEach(function (x) {
        var lbl = /sample|question/i.test(x[0]) ? "Sample Paper" : /tma|assignment/i.test(x[0]) ? "TMA" : /lab|manual/i.test(x[0]) ? "Lab Manual" : "Guide";
        if (seen[lbl]) return;
        seen[lbl] = 1;
        tags.appendChild(el("span", "stag" + (lbl === "Sample Paper" ? " good" : ""), lbl));
      });
      mid.appendChild(tags);
    }
    a.appendChild(mid);

    var done = readOf(b).length;
    if (done > 0) {
      a.appendChild(el("span", "subj-prog", done + "/" + b.ch.length));
    } else {
      a.appendChild(icon("chev"));
    }
    return a;
  }

  function viewLevel(level) {
    var back = internal("#/", "back-link");
    back.appendChild(icon("back"));
    back.appendChild(document.createTextNode("Home"));
    app.appendChild(back);
    app.appendChild(el("h1", "page-h1", LEVEL_TITLE[level]));
    app.appendChild(el("p", "page-lead", "Pick your language medium and tap any subject to open its chapter PDFs, sample paper and TMA."));

    var books = BOOKS.filter(function (b) { return b.level === level; });
    var meds = ["All"];
    books.forEach(function (b) { if (meds.indexOf(b.m) === -1) meds.push(b.m); });
    if (meds.indexOf(currentMed) === -1) currentMed = "All";

    var chips = el("div", "chips");
    meds.forEach(function (m) {
      var count = m === "All" ? books.length : books.filter(function (b) { return b.m === m; }).length;
      var btn = el("button", "chip", m + " (" + count + ")");
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(m === currentMed));
      btn.addEventListener("click", function () { currentMed = m; save("nios-medium", m); route(); });
      chips.appendChild(btn);
    });
    app.appendChild(chips);

    var list = el("div", "subj-list");
    books.filter(function (b) { return currentMed === "All" || b.m === currentMed; })
      .sort(function (a, b) { return a.t.localeCompare(b.t) || a.m.localeCompare(b.m); })
      .forEach(function (b) { list.appendChild(subjectRow(b)); });
    app.appendChild(list);
  }

  /* ========================================================================
     BOOK DETAIL VIEW (Balanced 2-Column Action Grid + Clean Chapter Titles)
     ======================================================================== */
  function viewBook(id) {
    var b = BY_ID[id];
    if (!b) { app.appendChild(el("p", "empty", "Subject not found.")); return; }
    save("nios-last", id);

    var back = internal("#/" + b.level, "back-link");
    back.appendChild(icon("back"));
    back.appendChild(document.createTextNode(LEVEL_TITLE[b.level]));
    app.appendChild(back);

    var bh = el("section", "book-hero");
    var bht = el("div", "book-hero-top");
    var sp = el("div", "book-hero-spine", b.code);
    sp.style.setProperty("--c", subjColor(b.t));
    bht.appendChild(sp);
    var txt = el("div", "book-hero-txt");
    txt.appendChild(el("small", null, LEVEL_TITLE[b.level] + " · " + b.m + " Medium · Code " + b.code));
    txt.appendChild(el("h1", null, b.t));
    var subText = el("p", null, b.ch.length + " official lessons · Direct nios.ac.in PDFs");
    txt.appendChild(subText);
    bht.appendChild(txt);
    bh.appendChild(bht);

    var extras = el("div", "book-extras");
    if (b.ch[0]) {
      var first = ext(b.ch[0][1], "extra-btn primary span-all");
      first.appendChild(icon("file"));
      first.appendChild(document.createTextNode("Open Lesson 1 PDF"));
      extras.appendChild(first);
    }
    if (b.extra && b.extra.length) {
      var seen = {};
      b.extra.forEach(function (x) {
        var label = /sample|question/i.test(x[0]) ? "Sample Paper" : /tma|assignment/i.test(x[0]) ? "TMA PDF" : /lab|manual/i.test(x[0]) ? "Lab Manual" : /guide|lesson/i.test(x[0]) ? "Learner Guide" : x[0];
        if (seen[label]) return;
        seen[label] = 1;
        var eb = ext(x[1], "extra-btn" + (label === "Sample Paper" ? " good" : ""));
        eb.appendChild(icon("file"));
        eb.appendChild(document.createTextNode(label));
        extras.appendChild(eb);
      });
    }
    bh.appendChild(extras);
    app.appendChild(bh);

    var pbar = el("div", "progress-bar");
    var pfill = el("span");
    pbar.appendChild(pfill);
    app.appendChild(pbar);

    var list = el("ol", "ch-list");
    var rows = [];
    function refresh() {
      var done = readOf(b);
      var pct = b.ch.length ? Math.round((done.length / b.ch.length) * 100) : 0;
      pfill.style.width = pct + "%";
      subText.textContent = b.ch.length + " lessons · " + done.length + " read (" + pct + "%)";
      rows.forEach(function (r) {
        var on = done.indexOf(r.i) !== -1;
        r.num.setAttribute("aria-pressed", String(on));
        r.num.textContent = on ? "✓" : String(r.i + 1);
        r.li.classList.toggle("done", on);
      });
    }

    b.ch.forEach(function (c, i) {
      var li = el("li", "ch-row");
      var num = el("button", "ch-num", String(i + 1));
      num.type = "button";
      num.setAttribute("aria-label", "Mark " + c[0] + " as read");
      num.addEventListener("click", function () { setRead(b, i, readOf(b).indexOf(i) === -1); refresh(); });
      li.appendChild(num);

      li.appendChild(el("span", "ch-name", cleanChapterTitle(c[0])));

      var acts = el("span", "ch-acts");
      var pdf = ext(c[1], "pill-btn");
      pdf.appendChild(icon("file"));
      pdf.appendChild(document.createTextNode("PDF"));
      pdf.addEventListener("click", function () { setRead(b, i, true); refresh(); });
      acts.appendChild(pdf);

      var vid = overrideOf("v", b, i) || "";
      var sol = overrideOf("s", b, i) || "";
      if (editMode && (!vid || !sol)) li.classList.add("needs");

      if (vid || editMode) {
        var vd = ext(vid ? "https://www.youtube.com/watch?v=" + vid : "#", "pill-btn vid" + (vid ? " custom" : " add"));
        vd.appendChild(icon("video"));
        vd.appendChild(document.createTextNode(vid ? "Video" : "Add"));
        if (editMode) vd.addEventListener("click", function (e) { e.preventDefault(); openEdit(b, i); });
        acts.appendChild(vd);
      }
      if (sol || editMode) {
        var solPdf = directPdf(sol);
        var sv = ext(sol || "#", "pill-btn sol" + (sol ? " custom" : " add"));
        sv.appendChild(icon(solPdf ? "file" : "bulb"));
        sv.appendChild(document.createTextNode(!sol ? "Add" : (solPdf ? "PDF" : "Solve")));
        if (editMode) sv.addEventListener("click", function (e) { e.preventDefault(); openEdit(b, i); });
        acts.appendChild(sv);
      }

      li.appendChild(acts);
      rows.push({ num: num, i: i, li: li });
      list.appendChild(li);
    });
    app.appendChild(list);
    refresh();
  }

  /* ========================================================================
     PAPERS / LAB MANUALS VIEW
     ======================================================================== */
  function viewPapers(kind) {
    var back = internal("#/", "back-link");
    back.appendChild(icon("back"));
    back.appendChild(document.createTextNode("Home"));
    app.appendChild(back);
    var isLab = kind === "labs";
    app.appendChild(el("h1", "page-h1", isLab ? "Lab Manuals & Learner Guides" : "Sample Papers & TMA PDFs"));
    app.appendChild(el("p", "page-lead", isLab ? "Official practical manuals and chapter-wise learner guides from nios.ac.in." : "Official sample question papers and Tutor Marked Assignments (TMA)."));

    var list = el("div", "subj-list");
    BOOKS.forEach(function (b) {
      (b.extra || []).forEach(function (x) {
        var match = isLab ? /lab|manual|guide/i.test(x[0]) : /sample|tma|question|assignment/i.test(x[0]);
        if (!match) return;
        var row = ext(x[1], "subj-row");
        row.style.setProperty("--c", subjColor(b.t));
        var cd = el("span", "subj-code");
        cd.appendChild(el("small", null, "Code"));
        cd.appendChild(el("span", null, b.code));
        row.appendChild(cd);
        var mid = el("div", "subj-mid");
        mid.appendChild(el("b", null, b.t + " (" + b.m + ")"));
        mid.appendChild(el("small", null, x[0] + " · " + LEVEL_TITLE[b.level]));
        row.appendChild(mid);
        var p = el("span", "pill-btn", "PDF");
        p.prepend(icon("file"));
        row.appendChild(p);
        list.appendChild(row);
      });
    });
    app.appendChild(list.childNodes.length ? list : el("p", "empty", "No files listed in this category."));
  }

  /* ========================================================================
     SEARCH VIEW
     ======================================================================== */
  function viewSearch(q) {
    var back = internal("#/", "back-link");
    back.appendChild(icon("back"));
    back.appendChild(document.createTextNode("Home"));
    app.appendChild(back);
    app.appendChild(el("h1", "page-h1", "Search results"));
    var query = q.toLowerCase();
    var hits = BOOKS.filter(function (b) {
      return (b.t + " " + b.m + " " + b.code + " " + b.ch.map(function (c) { return c[0]; }).join(" ")).toLowerCase().indexOf(query) !== -1;
    });
    app.appendChild(el("p", "page-lead", hits.length + " subjects matching “" + q + "”."));
    var list = el("div", "subj-list");
    hits.forEach(function (b) { list.appendChild(subjectRow(b)); });
    app.appendChild(hits.length ? list : el("p", "empty", "No subjects matched that search."));
  }

  /* ========================================================================
     SETTINGS VIEW (Grouped, Well-Proportioned, Fits One Screen Cleanly)
     ======================================================================== */
  function appInstallAndUpdateCard() {
    var card = el("section", "set-card");
    card.id = "set-install";
    var row = el("div", "set-row");
    var img = el("img", "set-app-ic");
    img.src = "icon-192.png";
    img.alt = "";
    row.appendChild(img);
    var txt = el("div", "set-copy");
    txt.appendChild(el("b", null, "NIOS Open Library App"));
    txt.appendChild(el("span", null, isInstalled()
      ? "Installed on this device. Use Update App below to pull the newest pages."
      : "Install on your home screen for full-screen reading and offline access."));
    row.appendChild(txt);
    card.appendChild(row);

    var steps = el("ol", "set-steps");
    steps.hidden = true;
    var ua = navigator.userAgent;
    var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var lines = ios
      ? ["Open this site in Safari.", "Tap the Share button (square with an arrow).", "Tap “Add to Home Screen”, then Add."]
      : ["Open the browser menu (⋮ at the top right).", "Tap “Install app” or “Add to Home screen”.", "Confirm with Install."];
    lines.forEach(function (s) { steps.appendChild(el("li", null, s)); });

    var btns = el("div", "set-app-btns");
    var ibtn = el("button", "btn primary", isInstalled() ? "Installed ✓" : "Install on Home Screen");
    ibtn.type = "button";
    ibtn.disabled = isInstalled();
    ibtn.addEventListener("click", function () {
      if (installPrompt) {
        var p = installPrompt;
        installPrompt = null;
        p.prompt();
        if (p.userChoice) p.userChoice.then(function () { refreshInstallCard(); });
        return;
      }
      steps.hidden = !steps.hidden;
    });

    var ubtn = el("button", "btn", "Update App Now");
    ubtn.type = "button";
    ubtn.addEventListener("click", function () {
      ubtn.disabled = true;
      ubtn.textContent = "Updating…";
      var work = window.caches
        ? caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })
        : Promise.resolve();
      work.catch(function () {}).then(function () { location.reload(); });
    });

    btns.appendChild(ibtn);
    btns.appendChild(ubtn);
    card.appendChild(btns);
    card.appendChild(steps);
    return card;
  }
  function refreshInstallCard() {
    var old = document.getElementById("set-install");
    if (old) old.replaceWith(appInstallAndUpdateCard());
  }

  function viewSettings() {
    var back = internal("#/", "back-link");
    back.appendChild(icon("back"));
    back.appendChild(document.createTextNode("Home"));
    app.appendChild(back);
    app.appendChild(el("h1", "page-h1", "Settings"));
    app.appendChild(el("p", "page-lead", "Install on your home screen, update offline cache, or customize chapter links."));

    app.appendChild(appInstallAndUpdateCard());

    /* Grouped Preferences Card: Dark Mode + Edit Mode */
    var prefs = el("section", "set-card");
    prefs.appendChild(el("h2", null, "Preferences"));

    var drow = el("div", "set-row");
    var dtxt = el("div", "set-copy");
    dtxt.appendChild(el("b", null, "Dark mode"));
    dtxt.appendChild(el("span", null, "Switch between light and dark appearance."));
    drow.appendChild(dtxt);
    var dtog = el("button", "toggle");
    dtog.type = "button";
    dtog.setAttribute("role", "switch");
    dtog.setAttribute("aria-checked", String(document.documentElement.dataset.theme === "dark"));
    dtog.setAttribute("aria-label", "Dark mode");
    dtog.addEventListener("click", function () {
      document.getElementById("themeBtn").click();
      dtog.setAttribute("aria-checked", String(document.documentElement.dataset.theme === "dark"));
    });
    drow.appendChild(dtog);
    prefs.appendChild(drow);

    var erow = el("div", "set-row");
    var etxt = el("div", "set-copy");
    etxt.appendChild(el("b", null, "Edit mode"));
    etxt.appendChild(el("span", null, "Add or edit chapter YouTube videos and solution PDF links."));
    erow.appendChild(etxt);
    var etog = el("button", "toggle");
    etog.type = "button";
    etog.setAttribute("role", "switch");
    etog.setAttribute("aria-checked", String(editMode));
    etog.setAttribute("aria-label", "Edit mode");
    etog.addEventListener("click", function () { setEditMode(!editMode); route(); });
    erow.appendChild(etog);
    prefs.appendChild(erow);

    if (editMode) {
      var go = el("p", "set-hint");
      go.appendChild(document.createTextNode("Edit mode is on. Open any subject and tap Add/Video/Solve to set a link. "));
      go.appendChild(internal("#/sec", null, "Browse Class 10 →"));
      prefs.appendChild(go);
    }
    app.appendChild(prefs);

    /* Custom Links & Backup Card */
    var backup = el("section", "set-card");
    backup.appendChild(el("h2", null, "Custom links & backup (" + editCount() + ")"));
    if (!editCount()) {
      backup.appendChild(el("p", "set-hint", "No custom links saved yet. Turn on Edit mode above to add chapter videos or notes, or paste a backup below."));
    } else {
      var ul = el("ul", "set-edits");
      ["v", "s"].forEach(function (kind) {
        Object.keys(edits[kind] || {}).forEach(function (id) {
          var b = BY_ID[id];
          if (!b) return;
          Object.keys(edits[kind][id]).forEach(function (k) {
            var idx = Number(k);
            var val = edits[kind][id][k];
            var li = el("li", "set-edit");
            var left = el("div");
            left.appendChild(el("b", null, b.t + " · " + (b.ch[idx] ? cleanChapterTitle(b.ch[idx][0]) : "Lesson " + (idx + 1))));
            left.appendChild(el("small", null, (kind === "v" ? "Video: " : "Notes: ") + val));
            li.appendChild(left);
            var acts = el("div", "set-mini");
            if (val) {
              var open = ext(kind === "v" ? "https://www.youtube.com/watch?v=" + val : val, "set-mini-btn", "Open");
              acts.appendChild(open);
            }
            acts.appendChild(internal("#/book/" + encodeURIComponent(b.id), "set-mini-btn", "Book"));
            var drop = el("button", "set-mini-btn", "Remove");
            drop.type = "button";
            drop.addEventListener("click", function () { setOverride(kind, b, idx, ""); route(); });
            acts.appendChild(drop);
            li.appendChild(acts);
            ul.appendChild(li);
          });
        });
      });
      backup.appendChild(ul);
    }

    var brow = el("div", "backup-acts");
    var copyBtn = el("button", "btn", "Copy backup");
    copyBtn.type = "button";
    copyBtn.disabled = !editCount();
    copyBtn.addEventListener("click", function () {
      var data = JSON.stringify(edits);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(data).then(function () { copyBtn.textContent = "Copied!"; });
      } else {
        window.prompt("Copy your backup JSON:", data);
      }
    });
    var pasteBtn = el("button", "btn", "Paste backup");
    pasteBtn.type = "button";
    pasteBtn.addEventListener("click", function () {
      var raw = window.prompt("Paste backup JSON:");
      if (!raw) return;
      try {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          edits = { v: parsed.v || {}, s: parsed.s || {} };
          save("nios-edits", edits);
          route();
        }
      } catch (e) { window.alert("Invalid backup JSON."); }
    });
    var clearBtn = el("button", "btn danger", "Clear all");
    clearBtn.type = "button";
    clearBtn.disabled = !editCount();
    var armed = false;
    clearBtn.addEventListener("click", function () {
      if (!armed) { armed = true; clearBtn.textContent = "Tap again"; return; }
      edits = { v: {}, s: {} };
      save("nios-edits", edits);
      route();
    });
    brow.appendChild(copyBtn);
    brow.appendChild(pasteBtn);
    brow.appendChild(clearBtn);
    backup.appendChild(brow);
    app.appendChild(backup);
  }

  /* ========================================================================
     NAVIGATION & INIT
     ======================================================================== */
  function buildDock() {
    var dock = document.getElementById("dock");
    dock.textContent = "";
    [
      ["home", "#/", "Home", "home"],
      ["sec", "#/sec", "Class 10", "book"],
      ["sr", "#/sr", "Class 12", "grad"],
      ["papers", "#/papers", "Papers", "clipboard"],
      ["settings", "#/settings", "Settings", "gear"]
    ].forEach(function (x) {
      var a = internal(x[1]);
      a.dataset.route = x[0];
      a.appendChild(icon(x[3]));
      a.appendChild(el("span", null, x[2]));
      dock.appendChild(a);
    });
  }

  function route() {
    var parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
    var name = parts[0] || "home";
    var isHome = !parts.length;
    hero.classList.toggle("compact", !isHome);
    app.classList.toggle("overlap", isHome);
    document.documentElement.classList.toggle("edit-on", editMode);
    var bar = document.getElementById("editBar");
    if (bar) bar.hidden = !editMode;

    app.textContent = "";
    if (isHome) viewHome();
    else if (name === "sec" || name === "sr") viewLevel(name);
    else if (name === "book") viewBook(decodeURIComponent(parts[1] || ""));
    else if (name === "papers" || name === "labs") viewPapers(name);
    else if (name === "search") viewSearch(decodeURIComponent(parts.slice(1).join("/")));
    else if (name === "settings") viewSettings();
    else { name = "home"; hero.classList.remove("compact"); app.classList.add("overlap"); viewHome(); }

    [].forEach.call(document.querySelectorAll("[data-route]"), function (a) {
      if (a.dataset.route === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var setBtn = document.getElementById("settingsBtn");
    if (setBtn) {
      if (name === "settings") setBtn.setAttribute("aria-current", "page");
      else setBtn.removeAttribute("aria-current");
    }
    if (name !== "search") searchInput.value = "";
    window.scrollTo(0, 0);
  }

  buildDock();
  document.getElementById("searchIc").appendChild(icon("search"));
  document.getElementById("bookCountBadge").textContent = BOOKS.length + " books";
  document.getElementById("settingsBtn").appendChild(icon("gear"));

  var themeBtn = document.getElementById("themeBtn");
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === "dark" ? "#090e1a" : "#0a2540";
    themeBtn.textContent = "";
    themeBtn.appendChild(icon(t === "dark" ? "sun" : "moon"));
  }
  applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  themeBtn.addEventListener("click", function () {
    var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("nios-theme", next); } catch (e) {}
    applyTheme(next);
  });

  document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = searchInput.value.trim();
    if (q) location.hash = "#/search/" + encodeURIComponent(q);
  });

  /* Edit sheet wiring */
  var sheet = document.getElementById("editSheet");
  document.getElementById("editSheetX").addEventListener("click", function () { sheet.close(); });
  sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
  document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!editing) return;
    var rawV = document.getElementById("editVid").value.trim();
    var vid = rawV ? ytId(rawV) : "";
    if (rawV && !vid) {
      var err = document.getElementById("editVidErr");
      err.textContent = "Paste a valid YouTube link or 11-character video ID.";
      err.hidden = false;
      return;
    }
    var sol = document.getElementById("editSol").value.trim();
    setOverride("v", editing.b, editing.i, vid);
    setOverride("s", editing.b, editing.i, sol);
    sheet.close();
    route();
  });
  document.getElementById("editReset").addEventListener("click", function () {
    if (!editing) return;
    setOverride("v", editing.b, editing.i, "");
    setOverride("s", editing.b, editing.i, "");
    sheet.close();
    route();
  });

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installPrompt = e;
    refreshInstallCard();
  });
  window.addEventListener("appinstalled", function () {
    installPrompt = null;
    refreshInstallCard();
  });
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
  window.addEventListener("hashchange", route);
  route();
})();
