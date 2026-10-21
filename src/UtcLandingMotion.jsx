import { useState, useEffect, useRef, useMemo, useId, createContext, useContext } from "react";
import {
  motion, AnimatePresence, MotionConfig, useScroll, useSpring, useMotionValue, useMotionTemplate, useTransform, useInView,
} from "framer-motion";
import {
  Menu, X, Mail, MapPin, Plus, Minus, ArrowUpRight, Trophy, Check,
  Megaphone, Wrench, Clapperboard, Users,
} from "lucide-react";

/* Ikon merek dibuat sendiri karena lucide-react versi baru sudah tidak menyediakannya */
const brand = (paths) => ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths}</svg>
);
const Github = brand(<><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>);
const Instagram = brand(<><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>);
const Linkedin = brand(<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>);

/* ───────── IMAGES (Unsplash, ada fallback kalau gagal dimuat) ───────── */
const u = (id, w = 900) => `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;
const MEN = ["photo-1507003211169-0a1dd7228f2d", "photo-1500648767791-00dcc994a43e", "photo-1472099645785-5658abf4ff4e", "photo-1506794778202-cad84cf45f1d", "photo-1519085360753-af0119f7cbe7", "photo-1463453091185-61582044d556"];
const WOMEN = ["photo-1494790108377-be9c29b29330", "photo-1438761681033-6461ffad8d80", "photo-1580489944761-15a19d654956", "photo-1544005313-94ddf0286df2", "photo-1531427186611-ecfd6d936c79", "photo-1573496359142-b8d87734a5a2"];
const person = (g, i) => ({ n: g === "m" ? "John Doe" : "Jane Doe", img: u(g === "m" ? MEN[i] : WOMEN[i], 600) });

/* ───────── MOCK DATA ───────── */
const NAV = [["about", "Tentang"], ["divisions", "Divisi"], ["events", "Agenda"], ["projects", "Project"], ["team", "BPH"], ["news", "Berita"], ["faq", "FAQ"]];
const STATS = [[100, "Anggota"], [15, "Project"], [10, "Prestasi"]];
const MARQUEE = ["innovation", "technology", "community", "creativity", "collaboration"];
const ABOUT = {
  Visi: ["Menjadi wadah mahasiswa UPITRA yang melahirkan talenta teknologi yang kreatif, kolaboratif, dan siap bersaing."],
  Misi: ["Mengadakan workshop dan pelatihan teknologi secara rutin.", "Mendorong anggota membuat project nyata yang dipakai orang lain.", "Mengirim tim ke kompetisi tingkat nasional.", "Membangun jaringan dengan komunitas dan industri."],
  Nilai: ["Belajar sambil membuat.", "Berbagi ilmu tanpa gengsi.", "Bekerja sebagai tim."],
};
const DIVISIONS = [
  { key: "Humas", full: "Hubungan Masyarakat", icon: Megaphone, img: u("photo-1522071820081-009f0129c71c"),
    desc: "Menjaga hubungan UTC dengan mitra, sponsor, kampus, dan komunitas luar.",
    tasks: ["Surat dan proposal kerja sama", "Kunjungan ke komunitas dan instansi", "Mencari sponsor kegiatan"],
    members: [["Koordinator", person("f", 0)], ["Anggota", person("m", 0)], ["Anggota", person("f", 1)], ["Anggota", person("m", 1)]] },
  { key: "Perkab", full: "Perkab", icon: Wrench, img: u("photo-1518770660439-4636190af475"),
    desc: "Mengurus perlengkapan dan kebutuhan operasional agar setiap kegiatan UTC berjalan lancar.",
    tasks: ["Pendataan dan perawatan inventaris", "Menyiapkan perlengkapan acara", "Mengatur peminjaman ruang dan alat"],
    members: [["Koordinator", person("m", 2)], ["Anggota", person("f", 2)], ["Anggota", person("m", 3)], ["Anggota", person("f", 3)]] },
  { key: "Mulmed", full: "Multimedia", icon: Clapperboard, img: u("photo-1492691527719-9d1e07e534b4"),
    desc: "Memproduksi desain, foto, video, dan konten publikasi untuk seluruh kegiatan UTC.",
    tasks: ["Desain poster dan feed Instagram", "Foto dan video dokumentasi acara", "Penyuntingan video profil dan aftermovie"],
    members: [["Koordinator", person("f", 4)], ["Anggota", person("m", 4)], ["Anggota", person("f", 5)], ["Anggota", person("m", 5)]] },
  { key: "SDM", full: "Sumber Daya Manusia", icon: Users, img: u("photo-1529156069898-49953e39b3ac"),
    desc: "Membina anggota, menjaga suasana organisasi, dan mengelola pengembangan diri anggota.",
    tasks: ["Pendataan dan evaluasi anggota", "Acara kebersamaan dan gathering", "Pendampingan anggota baru"],
    members: [["Koordinator", person("m", 0)], ["Anggota", person("f", 0)], ["Anggota", person("m", 2)], ["Anggota", person("f", 4)]] },
];
const BPH = [["Ketua Umum", person("m", 1)], ["Wakil Ketua", person("f", 1)], ["Sekretaris", person("f", 2)], ["Bendahara", person("m", 3)]];
const EVENTS = [
  { title: "Open Recruitment Anggota Baru", d: "10", m: "Nov", type: "Oprec", up: true, img: u("photo-1523580846011-d3a5bc25702b", 400) },
  { title: "Workshop React untuk Pemula", d: "28", m: "Nov", type: "Workshop", up: true, img: u("photo-1531297484001-80022131f5a1", 400) },
  { title: "UTC Hackathon 24 Jam", d: "15", m: "Des", type: "Hackathon", up: true, img: u("photo-1504384308090-c894fdcc538d", 400) },
  { title: "Gathering Anggota Semester Ganjil", d: "05", m: "Sep", type: "Gathering", up: false, img: u("photo-1529156069898-49953e39b3ac", 400) },
  { title: "Workshop Git dan GitHub", d: "20", m: "Agu", type: "Workshop", up: false, img: u("photo-1555949963-ff9fe0c870eb", 400) },
  { title: "Seminar Karier di Dunia IT", d: "12", m: "Jul", type: "Seminar", up: false, img: u("photo-1540575467063-178a50c2df87", 400) },
];
const PROJECTS = [
  { name: "Website Fakultas", desc: "Situs resmi fakultas dengan berita, agenda, dan data dosen.", tags: ["React", "Node.js"], img: u("photo-1498050108023-c5249f4df085") },
  { name: "Aplikasi Catatan", desc: "Aplikasi catatan Android dengan widget layar utama.", tags: ["React", "Capacitor"], img: u("photo-1517694712202-14dd9538aa97") },
  { name: "Rekap Infaq", desc: "Pencatatan iuran bulanan komunitas dengan laporan otomatis.", tags: ["Laravel", "Tailwind"], img: u("photo-1551288049-bebda4e38f71") },
  { name: "Minimal Launcher", desc: "Launcher Android yang mengurangi distraksi dari ponsel.", tags: ["Flutter"], img: u("photo-1512941937669-90a1b58e7e9c") },
];
const NEWS = [
  { title: "UTC Kirim Dua Tim ke Kompetisi Web Nasional", date: "14 Okt 2026", tag: "Prestasi", summary: "Dua tim anggota UTC lolos ke babak final dan akan berangkat bulan depan.", img: u("photo-1522202176988-66273c2fd55f", 700) },
  { title: "Workshop Git dan GitHub Diikuti 60 Peserta", date: "21 Agu 2026", tag: "Kegiatan", summary: "Peserta belajar alur kerja tim, mulai dari branch sampai pull request.", img: u("photo-1531482615713-2afd69097998", 700) },
  { title: "Kunjungan ke Startup Lokal Surakarta", date: "02 Agu 2026", tag: "Kegiatan", summary: "Anggota berdiskusi langsung dengan tim produk tentang proses pengembangan.", img: u("photo-1573164713714-d95e436ab8d6", 700) },
  { title: "Tim UTC Juara Lomba Web Regional", date: "18 Jun 2026", tag: "Prestasi", summary: "Tim beranggotakan tiga mahasiswa membawa pulang juara pertama.", img: u("photo-1517048676732-d65bc937f952", 700) },
];
const AWARDS = [
  { title: "Juara 1 Lomba Web Development", event: "Kompetisi IT Regional 2026", team: "John Doe & Team", note: "Membangun sistem informasi dalam waktu 48 jam.", img: u("photo-1521737604893-d14cc237f11d", 600) },
  { title: "Juara 2 Capture The Flag", event: "CTF Mahasiswa Jawa Tengah", team: "Jane Doe & Team", note: "Menyelesaikan 14 dari 20 soal babak final.", img: u("photo-1552664730-d307ca884978", 600) },
  { title: "Finalis Hackathon Nasional", event: "Digital Innovation Hack", team: "John Doe & Team", note: "Membuat prototipe aplikasi layanan kampus.", img: u("photo-1556761175-5973dc0f32e7", 600) },
];
const FAQ = [
  ["Siapa saja yang boleh bergabung dengan UTC?", "Semua mahasiswa aktif UPITRA dari program studi mana pun. Tidak perlu bisa coding sebelumnya."],
  ["Apa syarat mendaftar?", "Mahasiswa aktif, mengisi formulir pendaftaran, dan mengikuti wawancara singkat."],
  ["Berapa waktu yang dibutuhkan untuk berkegiatan?", "Rapat divisi berjalan mingguan dan jadwalnya disesuaikan dengan jam kuliah."],
  ["Apakah ada biaya keanggotaan?", "Tidak ada biaya pendaftaran. Kas bulanan dipakai untuk kegiatan organisasi."],
  ["Kapan oprec dibuka?", "Setiap awal semester. Jadwal terbaru ada di bagian Agenda dan Instagram kami."],
];

/* ───────── TOKENS ───────── */
// hitam #04060B · biru tua #0A192F · biru muda #38BDF8 · putih #FFFFFF
const TONES = {
  black: { bg: "bg-[#04060B] text-white", line: "border-white/25", mute: "text-white/70", faint: "text-white/50", accent: "text-[#38BDF8]", card: "bg-white/5 border-white/20", row: "hover:bg-white/5", pill: "border-white/70 hover:bg-white hover:text-[#04060B]" },
  navy: { bg: "bg-[#0A192F] text-white", line: "border-white/25", mute: "text-white/75", faint: "text-white/50", accent: "text-[#38BDF8]", card: "bg-[#04060B]/40 border-white/20", row: "hover:bg-white/5", pill: "border-white/70 hover:bg-white hover:text-[#0A192F]" },
  white: { bg: "bg-white text-[#0A192F]", line: "border-[#0A192F]/25", mute: "text-[#0A192F]/75", faint: "text-[#0A192F]/55", accent: "text-[#0A192F] font-semibold", card: "bg-white border-[#0A192F]/25", row: "hover:bg-[#38BDF8]/15", pill: "border-[#0A192F] hover:bg-[#0A192F] hover:text-white" },
};
const Tone = createContext(TONES.black);
const EASE = [0.22, 1, 0.36, 1];
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const pillBase = "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]";
const pillSolid = `${pillBase} border-[#38BDF8] bg-[#38BDF8] text-[#04060B] hover:border-white hover:bg-white`;
const disp = "utc-disp";

/* ───────── SMALL PIECES ───────── */
function Img({ src, alt, className = "", imgClass = "" }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div role="img" aria-label={alt} className={`grid place-items-center bg-[#0A192F] text-2xl text-[#38BDF8] ${className}`}>{alt.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`${className} ${imgClass}`} />;
}

const Dots = ({ o = 0.4 }) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ opacity: o, backgroundImage: "radial-gradient(#000 38%,transparent 41%)", backgroundSize: "4px 4px" }} />
);

// duotone biru muda + hitam, berwarna saat di-hover
function Duo({ src, alt, className = "", style }) {
  return (
    <div className={`group relative isolate overflow-hidden bg-[#38BDF8] ${className}`} style={style}>
      <Img src={src} alt={alt} className="h-full w-full" imgClass="h-full w-full object-cover grayscale contrast-125 mix-blend-multiply transition duration-500 group-hover:scale-105 group-hover:mix-blend-normal group-hover:grayscale-0" />
      <Dots />
    </div>
  );
}

const Asterisk = ({ size = 90, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    {[0, 45, 90, 135].map((a) => <line key={a} x1="50" y1="4" x2="50" y2="96" transform={`rotate(${a} 50 50)`} />)}
  </svg>
);
const Mark = () => (
  <svg width="34" height="22" viewBox="0 0 34 22" fill="currentColor" aria-hidden>
    {[0, 6, 12, 18].map((y, i) => <rect key={y} x={i % 2 ? 4 : 0} y={y} width="30" height="3" />)}
  </svg>
);

function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const Stagger = ({ children, className = "" }) => (
  <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className={className}>{children}</motion.div>
);

function useCountUp(target, run, ms = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(target);
    let raf, t0;
    const tick = (t) => {
      t0 ??= t;
      const p = Math.min((t - t0) / ms, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return n;
}

function Chips({ options, value, onChange }) {
  const T = useContext(Tone);
  const id = useId();
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((o) => (
        <button key={o} role="tab" aria-selected={value === o} onClick={() => onChange(o)} className={`relative rounded-full border px-4 py-1.5 text-sm transition-colors ${value === o ? "border-[#38BDF8]" : `${T.line} hover:border-current`}`}>
          {value === o && <motion.span layoutId={id} className="absolute inset-0 rounded-full bg-[#38BDF8]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          <span className={`relative ${value === o ? "text-[#04060B]" : ""}`}>{o}</span>
        </button>
      ))}
    </div>
  );
}

function Section({ id, tone = "black", title, intro, action, children, blob = "-right-40 top-10" }) {
  const T = TONES[tone];
  return (
    <Tone.Provider value={T}>
      <section id={id} className={`relative overflow-hidden px-5 py-24 sm:py-32 ${T.bg}`}>
        <motion.div aria-hidden animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.3, 0.18] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className={`pointer-events-none absolute h-80 w-[26rem] rounded-full bg-[#38BDF8] blur-[120px] ${blob}`} />
        <div className="relative mx-auto max-w-6xl">
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} className={`origin-left border-t ${T.line}`} />
          <div className="mb-14 mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal className="max-w-xl">
              <h2 className={`${disp} text-[1.9rem] sm:text-5xl lg:text-6xl`}>{title}</h2>
              {intro && <p className={`mt-5 ${T.mute}`}>{intro}</p>}
            </Reveal>
            {action}
          </div>
          {children}
        </div>
      </section>
    </Tone.Provider>
  );
}

/* ───────── SECTIONS ───────── */
function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const nav = (id) => { setOpen(false); go(id); };
  return (
    <header className="sticky top-0 z-50 bg-[#04060B]/85 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <button onClick={() => go("top")} aria-label="Ke atas" className="flex items-center gap-3"><Mark /><span className="text-sm tracking-widest">UTC</span></button>
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map(([id, l]) => (
            <button key={id} onClick={() => nav(id)} className={`relative py-1 text-xs uppercase tracking-widest transition-colors ${active === id ? "text-[#38BDF8]" : "text-white/70 hover:text-white"}`}>
              {l}
              {active === id && <motion.span layoutId="navline" className="absolute inset-x-0 -bottom-0.5 h-px bg-[#38BDF8]" />}
            </button>
          ))}
          <button onClick={() => nav("join")} className={`${pillBase} border-white/70 py-1.5 text-xs uppercase tracking-widest hover:bg-white hover:text-[#04060B]`}>Daftar Oprec</button>
        </nav>
        <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="lg:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      <div className="relative h-px bg-white/20"><motion.div className="absolute inset-y-0 left-0 h-[2px] w-full origin-left bg-[#38BDF8]" style={{ scaleX: bar }} /></div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[#04060B] px-5 lg:hidden">
            {NAV.map(([id, l]) => <button key={id} onClick={() => nav(id)} className="block w-full border-b border-white/20 py-3.5 text-left text-sm uppercase tracking-widest">{l}</button>)}
            <button onClick={() => nav("join")} className={`${pillSolid} my-4 w-full`}>Daftar Oprec</button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

const BARS = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3];
const faceCls = "absolute inset-0 overflow-hidden rounded-2xl border border-white/40";
const hide = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

function MemberCard() {
  const [k, setK] = useState(0);
  const [flip, setFlip] = useState(false);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const gx = useMotionValue(50), gy = useMotionValue(30);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 }), sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const sheen = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.3), transparent 55%)`;
  const D = DIVISIONS[k];
  const P = D.members[1][1];
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 28); rx.set((0.5 - y) * 22); gx.set(x * 100); gy.set(y * 100);
  };
  const leave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(30); };
  const toggle = () => setFlip((f) => !f);
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="relative">
        <div aria-hidden className="absolute inset-0 translate-y-3 -rotate-6 rounded-2xl border border-white/20 bg-[#0A192F]/60" />
        <div aria-hidden className="absolute inset-0 -translate-y-1 rotate-[5deg] rounded-2xl border border-[#38BDF8]/40 bg-[#38BDF8]/10" />
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ perspective: 1100 }} className="relative">
          <motion.div role="button" tabIndex={0} aria-label="Kartu anggota UTC. Tekan untuk membalik kartu." aria-pressed={flip}
            onPointerMove={move} onPointerLeave={leave} onClick={toggle}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
            style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", touchAction: "pan-y" }}
            className="relative aspect-[1.586] w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38BDF8]">
            <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.7, ease: EASE }} style={{ transformStyle: "preserve-3d" }} className="absolute inset-0">
              {/* depan */}
              <div className={`${faceCls} bg-[#0A192F]`} style={hide}>
                <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent 0 14px, rgba(56,189,248,.08) 14px 15px)" }} />
                <Asterisk size={150} className="absolute -bottom-10 -right-8 text-[#38BDF8]/25" />
                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white"><Mark /><span className="text-[10px] tracking-widest sm:text-xs">UKM UTC UPITRA</span></div>
                    <span className={`${disp} text-lg text-[#38BDF8] sm:text-2xl`}>26</span>
                  </div>
                  <motion.div key={k} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 sm:gap-5">
                    <Duo src={P.img} alt={P.n} className="h-[4.5rem] w-14 shrink-0 rounded-lg border border-white/40 sm:h-28 sm:w-24" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/60 sm:text-xs">Nama</p>
                      <p className={`${disp} truncate text-base sm:text-xl`}>{P.n}</p>
                      <p className="mt-1.5 text-[10px] text-white/60 sm:text-xs">Divisi</p>
                      <p className="flex items-center gap-1.5 text-sm text-[#38BDF8] sm:text-base"><D.icon size={16} />{D.key}</p>
                    </div>
                  </motion.div>
                  <div className="flex items-end justify-between">
                    <div className="flex h-5 items-end gap-[2px] sm:h-7">{BARS.map((w, i) => <span key={i} className="h-full bg-white" style={{ width: w }} />)}</div>
                    <span className="text-[10px] tracking-widest text-white/60 sm:text-xs">UTC-26-0001</span>
                  </div>
                </div>
                <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: sheen }} />
              </div>
              {/* belakang */}
              <div className={`${faceCls} bg-[#04060B]`} style={{ ...hide, transform: "rotateY(180deg)" }}>
                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                  <div>
                    <p className="text-[10px] tracking-widest text-[#38BDF8] sm:text-xs">TUGAS DIVISI {D.key.toUpperCase()}</p>
                    <ul className="mt-3 space-y-2 text-xs leading-snug sm:text-sm">
                      {D.tasks.map((t) => <li key={t} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[#38BDF8]" />{t}</li>)}
                    </ul>
                  </div>
                  <p className="text-[10px] text-white/50 sm:text-xs">Ketuk kartu untuk kembali ke depan.</p>
                </div>
                <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: sheen }} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <Chips options={DIVISIONS.map((d) => d.key)} value={D.key} onChange={(key) => setK(DIVISIONS.findIndex((d) => d.key === key))} />
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={toggle} className={`${pillBase} border-white/70 hover:bg-white hover:text-[#04060B]`}>Balik kartu</button>
          <button onClick={() => { window.dispatchEvent(new CustomEvent("utc-division", { detail: k })); go("divisions"); }} className={pillSolid}>Lihat divisi {D.key}</button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 }), sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bx = useTransform(sx, [-0.5, 0.5], [60, -60]), by = useTransform(sy, [-0.5, 0.5], [40, -40]);
  const px = useTransform(sx, [-0.5, 0.5], [-18, 18]), py = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <section id="top" ref={ref} onMouseMove={move} className="relative overflow-hidden bg-[#04060B] px-5 pb-20 pt-12 text-white sm:pb-24 sm:pt-20">
      <motion.div aria-hidden style={{ x: bx, y: by }} className="pointer-events-none absolute -left-32 top-24">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="h-72 w-[30rem] rounded-full bg-[#0A3A7A] opacity-80 blur-[100px]" />
      </motion.div>
      <motion.div aria-hidden style={{ x: px, y: py }} className="pointer-events-none absolute right-0 top-0">
        <motion.div animate={{ scale: [1.1, 0.9, 1.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="h-96 w-[28rem] rounded-full bg-[#38BDF8] opacity-30 blur-[120px]" />
      </motion.div>
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: EASE }} className="origin-left border-t border-white/50" />
          <h1 className={`${disp} mt-8 text-[1.8rem] leading-[1.12] sm:text-5xl lg:text-[3.2rem]`}>
            {["Jadi Bagian", "\u2014 dari UTC"].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-1">
                <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: EASE }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5, ease: EASE }} className="mt-8 origin-left border-t border-white/50" />
          <Reveal delay={0.6}>
            <p className="mt-6 max-w-md text-white/80">UKM UTC adalah komunitas teknologi di Universitas Pignatelli Triputra. Pilih divisimu, lihat kartu anggotamu, lalu daftar saat oprec dibuka.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => go("join")} className={pillSolid}>Bergabung Sekarang</button>
              <button onClick={() => go("projects")} className={`${pillBase} border-white/70 hover:bg-white hover:text-[#04060B]`}>Lihat Project</button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 border-t border-white/40 pt-5">
              {STATS.map(([v, l]) => <Stat key={l} v={v} l={l} run={inView} />)}
            </dl>
          </Reveal>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: EASE }} className="px-3 sm:px-0">
          <MemberCard />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ v, l, run }) {
  const n = useCountUp(v, run);
  return <div><dd className={`${disp} text-3xl sm:text-4xl`}>{n}+</dd><dt className="mt-1 text-sm text-white/60">{l}</dt></div>;
}

function Marquee() {
  const [paused, setPaused] = useState(false);
  const items = [...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="overflow-hidden bg-[#38BDF8] py-5 text-[#04060B]">
      <style>{`@keyframes utc-m{to{transform:translateX(-50%)}}.utc-m{animation:utc-m 32s linear infinite}@media(prefers-reduced-motion:reduce){.utc-m{animation:none}}`}</style>
      <div className="utc-m flex w-max gap-12 whitespace-nowrap" style={{ animationPlayState: paused ? "paused" : "running" }}>
        {items.map((w, i) => (
          <span key={i} aria-hidden={i >= MARQUEE.length} className={`${disp} flex items-center gap-12 text-5xl text-transparent transition-colors hover:text-[#04060B]`} style={{ WebkitTextStroke: "1px #04060B" }}>
            {w}<Asterisk size={34} className="text-[#0A192F]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  const [tab, setTab] = useState("Visi");
  const body = ABOUT[tab];
  return (
    <Section id="about" tone="navy" title="Tentang UTC" intro="UTC adalah ruang belajar yang terbuka untuk semua program studi di UPITRA." action={<Chips options={Object.keys(ABOUT)} value={tab} onChange={setTab} />}>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="min-h-[220px] border-l border-[#38BDF8] pl-6 sm:pl-10">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              {body.length === 1
                ? <p className={`${disp} text-2xl leading-snug sm:text-3xl`}>{body[0]}</p>
                : <ul className="space-y-5 text-lg">{body.map((m) => <li key={m} className="flex gap-4"><Check className="mt-1 shrink-0 text-[#38BDF8]" size={20} />{m}</li>)}</ul>}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative mx-auto h-80 w-full max-w-md sm:h-96">
          <motion.div whileHover={{ rotate: -3, scale: 1.03 }} className="absolute left-0 top-0 h-56 w-3/4 overflow-hidden rounded-2xl border border-white/30 sm:h-64"><Duo src={u("photo-1519389950473-47ba0277781c")} alt="Anggota UTC bekerja" className="h-full w-full" /></motion.div>
          <motion.div whileHover={{ rotate: 3, scale: 1.03 }} className="absolute bottom-0 right-0 h-48 w-2/3 overflow-hidden rounded-2xl border border-white/30 sm:h-56"><Duo src={u("photo-1517245386807-bb43f82c33c4")} alt="Rapat UTC" className="h-full w-full" /></motion.div>
        </div>
      </div>
    </Section>
  );
}

function MemberRow({ role, p, lead }) {
  return (
    <motion.article variants={item} whileHover={{ x: 4 }}
      className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${lead ? "border-[#38BDF8] bg-[#38BDF8]/10" : "border-white/20 bg-white/5 hover:border-white/50"}`}>
      <Duo src={p.img} alt={p.n} className={`shrink-0 rounded-xl ${lead ? "h-14 w-14" : "h-11 w-11"}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{p.n}</p>
        <p className={`text-sm ${lead ? "text-[#38BDF8]" : "text-white/55"}`}>{role}</p>
      </div>
      <div className="flex shrink-0 gap-2.5 text-white/55">
        <a href="#" aria-label={`Instagram ${p.n}`} className="transition-colors hover:text-[#38BDF8]"><Instagram size={16} /></a>
        <a href="#" aria-label={`LinkedIn ${p.n}`} className="transition-colors hover:text-[#38BDF8]"><Linkedin size={16} /></a>
      </div>
    </motion.article>
  );
}

function Divisions() {
  const [i, setI] = useState(0);
  const D = DIVISIONS[i];
  useEffect(() => {
    const h = (e) => setI(e.detail);
    window.addEventListener("utc-division", h);
    return () => window.removeEventListener("utc-division", h);
  }, []);
  return (
    <Section id="divisions" tone="black" title="Divisi" intro="Pilih divisi untuk melihat tugas utama dan anggotanya." blob="-left-40 bottom-10">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {DIVISIONS.map(({ key, icon: Icon }, k) => (
          <button key={key} onClick={() => setI(k)} aria-pressed={i === k} className={`relative flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors ${i === k ? "border-[#38BDF8] text-[#04060B]" : "border-white/25 hover:border-white"}`}>
            {i === k && <motion.span layoutId="divtab" className="absolute inset-0 rounded-2xl bg-[#38BDF8]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <Icon size={20} className="relative shrink-0" /><span className="relative font-medium">{key}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-white/25"><Duo src={D.img} alt={D.full} className="h-full w-full" /></div>
            <h3 className={`${disp} mt-6 text-2xl sm:text-3xl`}>{D.full}</h3>
            <p className="mt-3 text-white/75">{D.desc}</p>
          </div>
          <div className="space-y-8">
            <div>
              <h4 className="text-sm text-white/55">Tugas utama</h4>
              <ul className="mt-3 divide-y divide-white/15 border-y border-white/15">
                {D.tasks.map((t) => <li key={t} className="flex gap-3 py-3"><Check size={18} className="mt-0.5 shrink-0 text-[#38BDF8]" />{t}</li>)}
              </ul>
            </div>
            <div>
              <div className="flex items-baseline justify-between"><h4 className="text-sm text-white/55">Anggota</h4><span className="text-sm text-white/55">{D.members.length} orang</span></div>
              <motion.div variants={stagger} initial="hidden" animate="show" className="mt-3 grid gap-3">
                {D.members.map(([role, p], k) => <MemberRow key={k} role={role} p={p} lead={k === 0} />)}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

function Events() {
  const [f, setF] = useState("Semua");
  const T = TONES.white;
  const list = EVENTS.filter((e) => f === "Semua" || (f === "Mendatang" ? e.up : !e.up));
  return (
    <Section id="events" tone="white" title="Agenda" intro="Kegiatan yang akan datang dan yang sudah berjalan." action={<Chips options={["Semua", "Mendatang", "Selesai"]} value={f} onChange={setF} />}>
      <ul className={`border-t ${T.line}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((e) => (
            <motion.li layout key={e.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
              className={`group flex items-center gap-5 border-b ${T.line} py-5 transition-colors ${T.row}`}>
              <div className="w-20 shrink-0"><span className={`${disp} text-5xl ${e.up ? "" : "opacity-40"}`}>{e.d}</span><span className="ml-1 text-sm opacity-60">{e.m}</span></div>
              <div className="min-w-0 flex-1"><h3 className="text-lg sm:text-xl">{e.title}</h3><p className="text-sm opacity-60">{e.type}</p></div>
              <span className={`hidden rounded-full border px-4 py-1 text-sm md:block ${e.up ? "border-[#0A192F] bg-[#0A192F] text-white" : "border-[#0A192F]/30 opacity-60"}`}>{e.up ? "Mendatang" : "Selesai"}</span>
              <div className="hidden h-16 w-28 shrink-0 overflow-hidden rounded-lg sm:block"><Duo src={e.img} alt={e.title} className="h-full w-full" /></div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Section>
  );
}

function Projects() {
  const tags = useMemo(() => ["Semua", ...new Set(PROJECTS.flatMap((p) => p.tags))], []);
  const [f, setF] = useState("Semua");
  const list = PROJECTS.filter((p) => f === "Semua" || p.tags.includes(f));
  return (
    <Section id="projects" tone="navy" title="Project" intro="Karya anggota UTC yang sudah dipakai atau sedang dikembangkan." action={<Chips options={tags} value={f} onChange={setF} />} blob="-left-40 top-1/3">
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <motion.article layout key={p.name} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35 }}>
              <Duo src={p.img} alt={`Tampilan ${p.name}`} className="h-64 w-full rounded-2xl border border-white/30" />
              <h3 className={`${disp} mt-5 text-2xl`}>{p.name}</h3>
              <p className="mt-2 max-w-sm text-white/75">{p.desc}</p>
              <p className="mt-3 text-sm text-[#38BDF8]">{p.tags.join(", ")}</p>
              <div className="mt-5 flex gap-3">
                <a href="#" className={pillSolid}>Demo <ArrowUpRight size={15} /></a>
                <a href="#" className={`${pillBase} border-white/70 hover:bg-white hover:text-[#0A192F]`}><Github size={15} /> GitHub</a>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function Team() {
  return (
    <Section id="team" tone="black" title="BPH" intro="Badan Pengurus Harian UTC periode ini.">
      <Stagger className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {BPH.map(([role, p], i) => (
          <motion.article key={i} variants={item} whileHover="hover" className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/5">
            <Duo src={p.img} alt={p.n} className="aspect-[4/5] w-full" />
            <div className="flex items-center justify-between p-4">
              <div><h3 className="font-medium">{p.n}</h3><p className="text-sm text-[#38BDF8]">{role}</p></div>
              <div className="flex gap-2 text-white/70">
                <a href="#" aria-label={`Instagram ${p.n}`} className="hover:text-[#38BDF8]"><Instagram size={17} /></a>
                <a href="#" aria-label={`LinkedIn ${p.n}`} className="hover:text-[#38BDF8]"><Linkedin size={17} /></a>
              </div>
            </div>
          </motion.article>
        ))}
      </Stagger>
    </Section>
  );
}

function News() {
  const [f, setF] = useState("Semua");
  const list = NEWS.filter((n) => f === "Semua" || n.tag === f);
  return (
    <Section id="news" tone="white" title="Berita" intro="Kabar terbaru dari kegiatan UKM UTC." action={<Chips options={["Semua", "Kegiatan", "Prestasi"]} value={f} onChange={setF} />} blob="-left-40 top-20">
      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((n) => (
            <motion.article layout key={n.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl border border-[#0A192F]/25 bg-white transition-colors hover:border-[#0A192F] hover:bg-[#0A192F] hover:text-white">
              <div className="h-48 overflow-hidden"><Duo src={n.img} alt={n.title} className="h-full w-full" /></div>
              <div className="p-7">
                <p className="text-sm font-semibold">{n.tag}</p>
                <h3 className={`${disp} mt-3 text-2xl leading-snug`}>{n.title}</h3>
                <p className="mt-4 opacity-75">{n.summary}</p>
                <p className="mt-6 border-t border-[#0A192F]/20 pt-4 group-hover:border-white/30 text-sm opacity-60">{n.date}, oleh John Doe</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function Awards() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="awards" tone="navy" title="Prestasi" intro="Hasil kerja keras tim UTC di berbagai kompetisi.">
      <ul className="border-t border-white/25">
        {AWARDS.map((a, i) => {
          const on = open === i;
          return (
            <li key={i} className="border-b border-white/25">
              <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="flex w-full items-center gap-5 py-7 text-left transition-colors hover:text-[#38BDF8]">
                <Trophy size={24} strokeWidth={1.5} className="shrink-0" />
                <span className="flex-1"><span className={`${disp} block text-xl sm:text-2xl`}>{a.title}</span><span className="text-sm text-white/55">{a.event}</span></span>
                {on ? <Minus /> : <Plus />}
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                    <div className="flex flex-col gap-6 pb-8 sm:flex-row sm:pl-12">
                      <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl sm:w-56"><Duo src={a.img} alt={a.title} className="h-full w-full" /></div>
                      <div><p className="w-fit rounded-full border border-[#38BDF8] bg-[#38BDF8]/20 px-4 py-1 text-sm">{a.team}</p><p className="mt-3 text-white/80">{a.note}</p></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" tone="black" title="FAQ" intro="Jawaban untuk pertanyaan yang paling sering masuk." blob="-left-40 top-1/2">
      <div className="max-w-3xl border-t border-white/25">
        {FAQ.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q} className="border-b border-white/25">
              <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className={`flex w-full items-center justify-between gap-4 py-6 text-left text-lg transition-colors hover:text-[#38BDF8] ${on ? "text-[#38BDF8]" : ""}`}>
                {q}<motion.span animate={{ rotate: on ? 180 : 0 }} className="shrink-0">{on ? <Minus /> : <Plus />}</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {on && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden"><p className="pb-6 text-white/75">{a}</p></motion.div>}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Join() {
  return (
    <section id="join" className="relative overflow-hidden bg-[#38BDF8] px-5 py-24 text-[#04060B] sm:py-32">
      <motion.div className="pointer-events-none absolute -right-16 -top-12 text-[#0A192F]/40" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}><Asterisk size={280} /></motion.div>
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2 className={`${disp} text-[1.9rem] leading-tight sm:text-5xl lg:text-6xl`}>Oprec anggota baru dibuka 10 November.</h2>
          <p className="mt-6 max-w-lg text-lg text-[#04060B]/80">Daftar dan pilih divisi yang ingin kamu dalami. Tidak perlu pengalaman.</p>
          <motion.a href="#" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#04060B] px-8 py-3.5 text-white">Daftar Oprec <ArrowUpRight size={16} /></motion.a>
        </Reveal>
        <Reveal delay={0.15}><div className="h-64 overflow-hidden rounded-3xl border-2 border-[#04060B]"><Duo src={u("photo-1522071820081-009f0129c71c", 800)} alt="Anggota UTC" className="h-full w-full" /></div></Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const submit = (e) => {
    e.preventDefault();
    const ok = /^\S+@\S+\.\S+$/.test(email);
    setState(ok ? "ok" : "err");
    if (ok) setEmail("");
  };
  return (
    <footer className="bg-[#0A192F] px-5 pb-8 pt-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_2fr]">
          <div>
            <div className="flex items-center gap-3"><Mark /><span className={`${disp} min-w-0 text-lg sm:text-xl`}>UKM UTC UPITRA</span></div>
            <p className="mt-5 flex gap-2 text-white/70"><MapPin size={18} className="mt-1 shrink-0" />Sekretariat UKM UTC, Universitas Pignatelli Triputra, Surakarta</p>
            <p className="mt-2 flex gap-2 text-white/70"><Mail size={18} className="mt-1" />utc@example.com</p>
            <div className="mt-6 flex gap-3">
              {[[Instagram, "Instagram"], [Linkedin, "LinkedIn"], [Github, "GitHub"]].map(([I, l]) => (
                <motion.a key={l} href="#" aria-label={l} whileHover={{ y: -4 }} className="rounded-full border border-white/50 p-2.5 hover:bg-[#38BDF8] hover:text-[#04060B]"><I size={17} /></motion.a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/55">Tautan cepat</h3>
            <ul className="mt-4 space-y-2">{NAV.slice(0, 5).map(([id, l]) => <li key={id}><button onClick={() => go(id)} className="text-white/80 underline-offset-4 hover:text-[#38BDF8] hover:underline">{l}</button></li>)}</ul>
          </div>
          <form onSubmit={submit} noValidate>
            <h3 className="text-sm uppercase tracking-widest text-white/55">Kabar dari UTC</h3>
            <p className="mt-4 text-sm text-white/70">Terima info oprec dan acara langsung di email.</p>
            <div className="mt-4 flex rounded-full border border-white/50 p-1 focus-within:border-[#38BDF8]">
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} placeholder="nama@email.com" aria-label="Email" aria-invalid={state === "err"} className="min-w-0 flex-1 bg-transparent px-4 placeholder:text-white/40 focus:outline-none" />
              <button className="rounded-full bg-[#38BDF8] px-5 py-2 text-sm text-[#04060B] transition-colors hover:bg-white">Kirim</button>
            </div>
            <p role="status" className={`mt-2 text-sm ${state === "err" ? "text-red-300" : "text-[#38BDF8]"}`}>
              {state === "ok" && "Email kamu sudah tercatat."}{state === "err" && "Format email belum benar. Contoh: nama@email.com"}
            </p>
          </form>
        </div>
        <p className="mt-16 border-t border-white/20 pt-6 text-sm text-white/50">&copy; 2026 UKM UTC UPITRA. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}

export default function UtcLandingMotion() {
  const [active, setActive] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    ref.current.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="antialiased" style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&family=Unbounded:wght@300;400&display=swap');
html{scroll-behavior:smooth}body{margin:0;background:#04060B}#root{max-width:none;margin:0;padding:0;text-align:left}
.utc-disp{font-family:'Unbounded',ui-sans-serif,system-ui,sans-serif;font-weight:300;letter-spacing:-0.01em}`}</style>
        <Navbar active={active} />
        <Hero /><Marquee /><About /><Divisions /><Events /><Projects />
        <Team /><News /><Awards /><Faq /><Join /><Footer />
      </div>
    </MotionConfig>
  );
}
