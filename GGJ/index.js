import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "super-secret-mafia",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

// Role generator based on player count
function buildRoles(n) {
  if (n < 3) {
    // fallback: 1 مجرم + باقي مواطن
    return ["المجرم", ...Array(Math.max(0, n - 1)).fill("مواطن")];
  }
  if (n >= 5) {
    // 1 مجرم، 1 طبيب، 1 شرطي، والباقي مواطن
    const base = ["المتحول", "مواطن", "مواطن"]; 
    return [...base, ...Array(n - base.length).fill("مواطن")];
  }
  // 3-4 لاعبين: 1 مجرم + 1 طبيب + باقي مواطن
  const base = ["المتحول", "مواطن"]; 
  return [...base, ...Array(n - base.length).fill("مواطن")];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

app.get("/", (req, res) => {
  res.render("index", { error: null, playersInput: "" });
});

app.post("/setup", (req, res) => {
  const names = (req.body.players || "")
    .split(/\r?\n|,/)
    .map(s => s.trim())
    .filter(Boolean);

  if (names.length < 2) {
    return res.render("index", { error: "أقل شيء لاعبين اثنين.", playersInput: req.body.players });
  }

  const roles = shuffle(buildRoles(names.length));
  const assignments = names.map((name, idx) => ({ name, role: roles[idx] }));

  req.session.game = {
    assignments, // [{name, role}]
    current: 0
  };

  res.redirect("/card");
});

app.get("/card", (req, res) => {
  const game = req.session.game;
  if (!game) return res.redirect("/");

  const { assignments, current } = game;
  if (current >= assignments.length) return res.redirect("/summary");

  const player = assignments[current];
  res.render("card", {
    user: player.name,
    secret: player.role,
    index: current + 1,
    total: assignments.length
  });
});

app.post("/card/next", (req, res) => {
  if (!req.session.game) return res.redirect("/");
  req.session.game.current += 1;
  res.redirect("/card");
});

// طاولة البطاقات + زر بدء التسلسل
app.get("/summary", (req, res) => {
  const game = req.session.game;
  if (!game) return res.redirect("/");
  res.render("summary", { assignments: game.assignments, count: game.assignments.length });
});

// صفحة تسلسل “غمّض العيون” خطوة بخطوة
app.get("/night", (req, res) => {
  const game = req.session.game;
  if (!game) return res.redirect("/");

  // ترتيب الأدوار في التسلسل
  const sequence = [
    { key: "all", text: "الكل يغمّض عيونه الآن." },
    { key: "criminal", role: "المتحول", text: "المجرم يفتح عينه ويختار ضحية (بإشارة)." },
    { key: "doctor", role: "مواطن", text: "الطبيب يفتح عينه ويختار شخصًا للعلاج." },
    { key: "police", role: "مواطن", text: "الشرطي يفتح عينه ويسأل عن شخص (نعم/لا)." },
    { key: "done", text: "انتهى الليل. افتحوا عيونكم!" }
  ];

  res.render("night", { sequence });
});

app.post("/reset", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});