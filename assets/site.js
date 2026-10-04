/* =========================================================
   Site logic. Needs assets/data.js to be loaded first.
   To add or rename a tab, edit the NAV list below once and
   every page picks it up.
   ========================================================= */

const NAV = [
  ["home",         "index.html",        "Home"],
  ["research",     "research.html",     "Research"],
  ["publications", "publications.html", "Publications"],
  ["teaching",     "teaching.html",     "Teaching"],
  ["students",     "students.html",     "Students"],
  ["service",      "service.html",      "Service and awards"],
  ["gallery",      "gallery.html",      "Gallery"],
  ["contact",      "contact.html",      "Contact"],
];

// Visitor counter. Create a free account at https://www.goatcounter.com, choose a site code
// (the part before .goatcounter.com), put it here, and turn on
// "Allow adding visitor counts on your website" in the GoatCounter settings.
// Leave empty to switch the counter off.
const GOATCOUNTER_CODE = "abhikjana";

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = id => document.getElementById(id);

/* ---------- theme ---------- */
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;

/* ---------- header and footer ---------- */
(function buildChrome() {
  const page = document.body.dataset.page;
  const header = $("site-header");
  if (header) {
    const tabs = NAV.map(([id, href, label]) =>
      `<li><a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
    header.insertAdjacentHTML("beforebegin", `
      <div class="masthead">
        <div class="wrap mast-in">
          <a class="brand" href="index.html">
            <span class="mono" aria-hidden="true">AJ</span>
            <span class="brand-text">
              <span class="brand-name">Abhik Jana</span>
              <span class="brand-sub"><b>Assistant Professor</b>, Computer Science and Engineering<br><span class="inst">Indian Institute of Technology Bhubaneswar</span></span>
            </span>
          </a>
          <button class="theme-btn" id="themeBtn" type="button"></button>
        </div>
      </div>
      <nav class="tabs" aria-label="Main"><div class="wrap"><ul>${tabs}</ul></div></nav>`);
    header.remove();

    const btn = $("themeBtn");
    const label = () => { btn.textContent = isDark() ? "Light mode" : "Dark mode"; btn.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode"); };
    label();
    btn.addEventListener("click", () => {
      root.dataset.theme = isDark() ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
      label();
    });
    // breadcrumb above the title on inner pages
    const h1 = document.querySelector(".pagehead h1");
    const here = NAV.find(n => n[0] === page);
    if (h1 && here) h1.insertAdjacentHTML("beforebegin", `<p class="crumbs"><a href="index.html">Home</a><span>/</span>${here[2]}</p>`);
    // keep the active tab visible on narrow screens (scroll the tab strip only, never the page)
    const cur = document.querySelector('.tabs [aria-current="page"]');
    const strip = document.querySelector(".tabs .wrap");
    if (cur && strip) strip.scrollLeft = cur.offsetLeft - (strip.clientWidth - cur.offsetWidth) / 2;
  }

  const footer = $("site-footer");
  if (footer) {
    const updated = new Date(document.lastModified).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    footer.outerHTML = `
      <footer class="site-footer"><div class="wrap">
        <div>
          <p class="fname">Dr. Abhik Jana</p>
          <p>Department of Computer Science and Engineering, IIT Bhubaneswar. Last updated ${updated}.</p>
        </div>
        <div class="foot-right">
          <p class="visits" id="visits" hidden title="Counted without cookies by GoatCounter">Visitors <b id="visitCount"></b></p>
          <p>Official profile: <a href="https://secs.iitbbs.ac.in/index.php/abhik/" rel="noopener">SECS, IIT Bhubaneswar</a></p>
        </div>
      </div></footer>`;
    startCounter();
  }
})();

/* ---------- visitor counter (GoatCounter) ---------- */
function startCounter() {
  if (!GOATCOUNTER_CODE) return;
  const base = `https://${GOATCOUNTER_CODE}.goatcounter.com`;
  const show = () => {
    fetch(`${base}/counter/TOTAL.json`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(j => {
        const n = j.count_unique !== undefined ? j.count_unique : j.count;
        if (n === undefined) return;
        $("visitCount").textContent = n;
        $("visits").hidden = false;
      })
      .catch(() => {});            // if the service is unreachable, simply show nothing
  };
  const sc = document.createElement("script");
  sc.async = true; sc.src = "https://gc.zgo.at/count.js";
  sc.dataset.goatcounter = `${base}/count`;
  sc.onload = () => setTimeout(show, 700);
  sc.onerror = show;
  document.head.appendChild(sc);
}

/* ---------- LinkedIn links ---------- */
function liUrl(name) {
  const key = name.replace(/\s*\(.*?\)\s*$/, "").trim();
  const u = (typeof LINKEDIN !== "undefined" && LINKEDIN[key]) || "";
  return /^https:\/\/([a-z0-9-]+\.)?linkedin\.com\//i.test(u) ? u : "";
}
function nameHTML(name) {
  const u = liUrl(name);
  return u
    ? `<a class="li" href="${esc(u)}" rel="noopener" aria-label="${esc(name)} on LinkedIn"><span>${esc(name)}</span><span class="li-badge" aria-hidden="true">in</span></a>`
    : esc(name);
}

/* ---------- publications ---------- */
const TYPE_ORDER = ["Journal", "Conference", "Workshop", "Preprint"];

function authorsHTML(str) {
  return str.split(", ").map(a => a === MY_NAME ? `<b>${esc(a)}</b>` : esc(a)).join(", ");
}
function pubHTML(p) {
  const title = p.link ? `<a href="${esc(p.link)}" rel="noopener">${esc(p.title)}</a>` : esc(p.title);
  return `
    <article class="pub">
      <span class="title">${title}</span>
      <span class="authors">${authorsHTML(p.authors)}</span>
      <span class="venue"><span class="tag">${esc(p.type)}</span>${p.soon ? `<span class="tag soon">To appear</span>` : ""}${esc(p.venue)}</span>
    </article>`;
}

if ($("pubList")) {
  const filters = $("filters"), list = $("pubList"), count = $("pubCount"), search = $("pubSearch");
  let activeType = "All", query = "";

  const renderFilters = () => {
    const present = TYPE_ORDER.filter(t => PUBS.some(p => p.type === t));
    const n = t => t === "All" ? PUBS.length : PUBS.filter(p => p.type === t).length;
    filters.innerHTML = ["All", ...present].map(t =>
      `<button type="button" data-type="${t}" aria-pressed="${t === activeType}">${t} (${n(t)})</button>`).join("");
  };
  const render = () => {
    const q = query.trim().toLowerCase();
    const items = PUBS.filter(p =>
      (activeType === "All" || p.type === activeType) &&
      (!q || (p.title + " " + p.authors + " " + p.venue + " " + p.y).toLowerCase().includes(q)));
    count.textContent = items.length === PUBS.length ? `${items.length} publications` : `Showing ${items.length} of ${PUBS.length} publications`;
    if (!items.length) { list.innerHTML = `<p class="empty">No publications match. Try a different word or clear the filter.</p>`; return; }
    const years = [...new Set(items.map(p => p.y))].sort((a, b) => b - a);
    list.innerHTML = years.map(y =>
      `<section class="yeargroup" aria-label="Publications from ${y}"><h2>${y}</h2><div>${items.filter(p => p.y === y).map(pubHTML).join("")}</div></section>`).join("");
  };
  filters.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    activeType = b.dataset.type; renderFilters(); render();
  });
  search.addEventListener("input", () => { query = search.value; render(); });
  renderFilters(); render();
}

/* ---------- recent publications on the home page ---------- */
if ($("recentPubs")) {
  $("recentPubs").innerHTML = PUBS.filter(p => !p.soon).slice(0, 5).map(p => {
    const t = p.link ? `<a href="${esc(p.link)}" rel="noopener">${esc(p.title)}</a>` : esc(p.title);
    return `<li><span class="y">${p.y}</span><div><span class="t">${t}</span><span class="v">${esc(p.venue)}</span></div></li>`;
  }).join("");
}

/* ---------- thesis tables ---------- */
function thesisTable(el, rows) {
  el.innerHTML = `<table>
    <thead><tr><th scope="col">Student</th><th scope="col">Thesis title</th><th scope="col">Degree</th><th scope="col">Years</th><th scope="col">Placement</th></tr></thead>
    <tbody>${rows.map(r => `<tr><td class="name">${nameHTML(r[0])}</td><td>${esc(r[1])}</td><td class="nw">${esc(r[2])}</td><td class="nw">${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join("")}</tbody>
  </table>`;
}
if ($("scholarList")) {
  $("scholarList").innerHTML = SCHOLARS.map(r =>
    `<li><b>${nameHTML(r[0])}</b><span>${esc(r[1])}, since ${esc(r[2])}</span></li>`).join("");
}
if ($("mtechTable")) thesisTable($("mtechTable"), MTECH);
if ($("btechTable")) thesisTable($("btechTable"), BTECH);
if ($("liNote") && typeof LINKEDIN !== "undefined" && Object.keys(LINKEDIN).some(k => liUrl(k))) $("liNote").hidden = false;
if ($("nMasters")) $("nMasters").textContent = MTECH.length;
if ($("nBachelors")) $("nBachelors").textContent = BTECH.length;

/* ---------- gallery + lightbox ---------- */
if ($("galleryGrid")) {
  const grid = $("galleryGrid");
  if (!GALLERY.length) {
    grid.outerHTML = `<p class="empty">...</p>`;
  } else {
    const lb = $("lightbox"), lbImg = $("lbImg"), lbCap = $("lbCap");
    grid.innerHTML = GALLERY.map((g, i) =>
      `<button type="button" data-i="${i}" aria-label="Open photo: ${esc(g.caption || "photo")}">
         <img src="${esc(g.src)}" alt="${esc(g.caption || "")}" loading="lazy">
         ${g.caption ? `<span class="cap">${esc(g.caption)}</span>` : ""}
       </button>`).join("");
    grid.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const g = GALLERY[+b.dataset.i];
      lbImg.src = g.src; lbImg.alt = g.caption || ""; lbCap.textContent = g.caption || "";
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    });
    $("lbClose").addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  }
}
