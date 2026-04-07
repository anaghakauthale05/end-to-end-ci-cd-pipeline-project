import { useState, useRef, useEffect } from "react";
import {
  CheckCircle2, Circle, Plus, Trash2, LayoutDashboard,
  ListTodo, Calendar, Star, Settings, Search, Bell,
  ChevronRight, Flame, Target, TrendingUp, X, Tag,
  Clock, SlidersHorizontal, Sparkles
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  { id: 1, title: "Redesign onboarding flow", tag: "Design", priority: "high", done: false, starred: true, due: "Today" },
  { id: 2, title: "Fix auth token expiry bug", tag: "Engineering", priority: "high", done: false, starred: false, due: "Today" },
  { id: 3, title: "Write Q2 retrospective doc", tag: "Docs", priority: "medium", done: true, starred: false, due: "Yesterday" },
  { id: 4, title: "Sync with design team on new DS tokens", tag: "Design", priority: "medium", done: false, starred: true, due: "Tomorrow" },
  { id: 5, title: "Review PR #482 — search indexing", tag: "Engineering", priority: "low", done: false, starred: false, due: "Fri" },
  { id: 6, title: "Update billing page copy", tag: "Marketing", priority: "low", done: true, starred: false, due: "Mon" },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: ListTodo, label: "My Tasks", id: "tasks" },
  { icon: Calendar, label: "Calendar", id: "calendar" },
  { icon: Star, label: "Starred", id: "starred" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const TAG_COLORS = {
  Design: { bg: "rgba(139,92,246,0.15)", text: "#a78bfa", dot: "#8b5cf6" },
  Engineering: { bg: "rgba(6,182,212,0.15)", text: "#22d3ee", dot: "#06b6d4" },
  Docs: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", dot: "#f59e0b" },
  Marketing: { bg: "rgba(52,211,153,0.15)", text: "#34d399", dot: "#10b981" },
};

const PRIORITY_STYLE = {
  high: { color: "#f87171", label: "High" },
  medium: { color: "#fbbf24", label: "Med" },
  low: { color: "#6b7280", label: "Low" },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div 
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default"
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}55`; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ background: `${accent}18`, borderRadius: 10, padding: 8, display: "inline-flex" }}>
          <Icon size={18} color={accent} />
        </div>
        <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#f9fafb", lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete, onStar }) {
  const [hovered, setHovered] = useState(false);
  const pri = PRIORITY_STYLE[task.priority];
  const tag = TAG_COLORS[task.tag] || TAG_COLORS.Docs;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "13px 16px",
        borderRadius: 12,
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        transition: "background 0.15s",
        cursor: "default",
      }}
    >
      <button onClick={() => onToggle(task.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, display: "flex", alignItems: "center" }}>
        {task.done
          ? <CheckCircle2 size={20} color="#06b6d4" />
          : <Circle size={20} color={hovered ? "#4b5563" : "#374151"} style={{ transition: "color 0.15s" }} />}
      </button>

      <span style={{
        flex: 1, fontSize: 14, color: task.done ? "#4b5563" : "#e5e7eb",
        textDecoration: task.done ? "line-through" : "none",
        transition: "color 0.15s",
        fontWeight: 450,
      }}>{task.title}</span>

      <span style={{
        fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6,
        background: tag.bg, color: tag.text, flexShrink: 0,
        letterSpacing: "0.03em",
      }}>{task.tag}</span>

      <span style={{ fontSize: 12, color: "#4b5563", minWidth: 52, textAlign: "right", flexShrink: 0 }}>
        <Clock size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
        {task.due}
      </span>

      <span style={{ width: 7, height: 7, borderRadius: "50%", background: pri.color, flexShrink: 0, boxShadow: `0 0 6px ${pri.color}88` }} title={pri.label} />

      <button onClick={() => onStar(task.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: task.starred || hovered ? 1 : 0, transition: "opacity 0.15s" }}>
        <Star size={14} color={task.starred ? "#fbbf24" : "#374151"} fill={task.starred ? "#fbbf24" : "none"} />
      </button>

      <button onClick={() => onDelete(task.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}>
        <Trash2 size={14} color="#ef4444" />
      </button>
    </div>
  );
}

function AddModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Engineering");
  const [due, setDue] = useState("Today");
  const [priority, setPriority] = useState("medium");
  const inputRef = useRef();
  
  useEffect(() => inputRef.current?.focus(), []);

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), tag, priority, due });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#111318", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
        padding: 28, width: 440, boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        animation: "modalIn 0.2s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#f9fafb" }}>New Task</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color="#6b7280" /></button>
        </div>
        
        <input ref={inputRef} value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="What needs to be done?"
          style={{
            width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "11px 14px", color: "#f9fafb", fontSize: 14, outline: "none",
            boxSizing: "border-box", fontFamily: "inherit", marginBottom: 14,
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Tag</label>
            <select value={tag} onChange={e => setTag(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px", color: "#e5e7eb" }}>
              {Object.keys(TAG_COLORS).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px", color: "#e5e7eb" }}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <button onClick={submit} style={{ width: "100%", background: "linear-gradient(135deg, #06b6d4, #0891b2)", border: "none", borderRadius: 10, padding: "11px", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Create Task
        </button>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  return (
    <aside style={{ width: 220, background: "#0b0d10", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 28px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={16} color="#fff" />
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#f9fafb" }}>Vertex</span>
      </div>
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ icon: Icon, label, id }) => (
          <button key={id} onClick={() => setActive(id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: active === id ? "rgba(6,182,212,0.12)" : "transparent",
            color: active === id ? "#22d3ee" : "#6b7280",
            fontSize: 13, textAlign: "left"
          }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Header({ onAdd }) {
  return (
    <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(11,13,16,0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 800 }}>Dashboard</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #06b6d4, #0891b2)", border: "none", borderRadius: 10, padding: "8px 16px", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          <Plus size={15} /> New Task
        </button>
      </div>
    </header>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const addTask = ({ title, tag, priority, due }) => {
    setTasks(t => [{ id: Date.now(), title, tag, priority, due, done: false, starred: false }, ...t]);
  };
  const toggleTask = id => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const deleteTask = id => setTasks(t => t.filter(x => x.id !== id));
  const starTask = id => setTasks(t => t.map(x => x.id === id ? { ...x, starred: !x.starred } : x));

  const done = tasks.filter(t => t.done).length;
  const pending = tasks.filter(t => !t.done).length;
  const starred = tasks.filter(t => t.starred).length;

  const visible = tasks.filter(t => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    if (filter === "starred") return t.starred;
    return true;
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0b0d10", color: "#f9fafb", fontFamily: "sans-serif" }}>
      <Sidebar active={activeNav} setActive={setActiveNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header onAdd={() => setShowModal(true)} />
        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            <StatCard icon={Target} label="Total" value={tasks.length} sub="all tasks" accent="#06b6d4" />
            <StatCard icon={Flame} label="Pending" value={pending} sub="needs attention" accent="#f87171" />
            <StatCard icon={CheckCircle2} label="Done" value={done} sub="completed" accent="#34d399" />
            <StatCard icon={TrendingUp} label="Starred" value={starred} sub="priority" accent="#fbbf24" />
          </div>
          
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10 }}>
                {["all", "active", "done", "starred"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(6,182,212,0.2)" : "transparent", border: "none", color: filter === f ? "#22d3ee" : "#6b7280", padding: "5px 10px", borderRadius: 8, cursor: "pointer" }}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: 10 }}>
              {visible.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onStar={starTask} />)}
            </div>
          </div>
        </main>
      </div>
      {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={addTask} />}
    </div>
  );
}
