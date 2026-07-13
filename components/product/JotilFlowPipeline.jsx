"use client";

import { useEffect, useRef } from "react";

/**
 * JotilFlowPipeline
 * Isolated, self-contained Lead Routing Workflow animation.
 * Behavior is identical to the vanilla version: one run loops through
 * New Lead -> AI Classify -> (CRM Update + Notify Team).
 *
 * Props (all optional):
 *   gapMs     pause between cycles (default 1100)
 *   className extra classes on the wrapper
 *
 * Retune colors by overriding --trigger / --ai / --action via a parent
 * style or by editing the CSS block below.
 */
export default function JotilFlowPipeline({ gapMs = 1100, className = "" }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const nodes = useRef({}); // { n1: el, n2: el, n3: el, n4: el }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    const cssv = getComputedStyle(root);

    let mounted = true;
    const timers = new Set();
    let paths = {};
    let resizeRT = null;

    const edges = [
      ["n1", "n2", "--trigger"],
      ["n2", "n3", "--action"],
      ["n2", "n4", "--action"],
    ];

    const wait = (ms) =>
      new Promise((res) => {
        const t = setTimeout(() => {
          timers.delete(t);
          res();
        }, reduce ? Math.min(ms, 90) : ms);
        timers.add(t);
      });

    const label = (id, t) => {
      const el = nodes.current[id];
      if (el) el.querySelector(".state span").textContent = t;
    };
    const fire = (id, t) => {
      nodes.current[id]?.classList.add("fire");
      label(id, t);
    };
    const idle = (id) => {
      nodes.current[id]?.classList.remove("fire");
      label(id, "Idle");
    };

    const center = (el) => {
      const c = canvas.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 };
    };

    const mkPath = (d, stroke, w, op) => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", d);
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", stroke);
      p.setAttribute("stroke-width", w);
      p.setAttribute("opacity", op);
      return p;
    };

    const build = () => {
      svg.innerHTML = "";
      paths = {};
      edges.forEach((e) => {
        const a = center(nodes.current[e[0]]);
        const b = center(nodes.current[e[1]]);
        const mx = (a.x + b.x) / 2;
        const d = `M ${a.x} ${a.y} C ${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
        const col = cssv.getPropertyValue(e[2]).trim();
        const base = mkPath(d, "#e3e6f0", 2, 1);
        const flow = mkPath(d, col, 1.4, 0.16);
        flow.setAttribute("stroke-linecap", "round");
        flow.setAttribute("stroke-dasharray", "1.5 9");
        flow.setAttribute("class", "flow");
        const lit = mkPath(d, col, 2.4, 0);
        lit.setAttribute("stroke-linecap", "round");
        svg.appendChild(base);
        svg.appendChild(flow);
        svg.appendChild(lit);
        paths[`${e[0]}-${e[1]}`] = {
          base,
          lit,
          len: base.getTotalLength(),
          color: col,
        };
      });
    };

    const travel = (key) =>
      new Promise((res) => {
        const p = paths[key];
        if (!p || reduce || !mounted) {
          res();
          return;
        }
        const NS = "http://www.w3.org/2000/svg";
        const g = document.createElementNS(NS, "g");
        const halo = document.createElementNS(NS, "circle");
        halo.setAttribute("r", "9");
        halo.setAttribute("fill", p.color);
        halo.setAttribute("opacity", "0.16");
        halo.style.filter = "blur(3px)";
        const core = document.createElementNS(NS, "circle");
        core.setAttribute("r", "4.6");
        core.setAttribute("fill", p.color);
        core.style.filter = `drop-shadow(0 0 6px ${p.color})`;
        g.appendChild(halo);
        g.appendChild(core);
        svg.appendChild(g);
        p.lit.style.transition = "opacity .2s";
        p.lit.style.opacity = "0.9";

        const dur = 640;
        let start = null;
        const step = (ts) => {
          if (!mounted) {
            if (g.parentNode) svg.removeChild(g);
            res();
            return;
          }
          if (!start) start = ts;
          const t = Math.min((ts - start) / dur, 1);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const pt = p.base.getPointAtLength(e * p.len);
          g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            if (g.parentNode) svg.removeChild(g);
            p.lit.style.transition = "opacity .5s";
            p.lit.style.opacity = "0";
            res();
          }
        };
        requestAnimationFrame(step);
      });

    const cycle = async () => {
      ["n1", "n2", "n3", "n4"].forEach(idle);
      if (!mounted) return;
      fire("n1", "Received");
      await wait(420);
      await travel("n1-n2");
      idle("n1");
      fire("n2", "Scoring");
      nodes.current.n2?.classList.add("think");
      await wait(900);
      nodes.current.n2?.classList.remove("think");
      label("n2", "Routed");
      await wait(150);
      idle("n2");
      fire("n3", "Writing");
      fire("n4", "Sending");
      await Promise.all([travel("n2-n3"), travel("n2-n4")]);
      label("n3", "Created");
      label("n4", "Sent");
      await wait(820);
      idle("n3");
      idle("n4");
    };

    const loop = () => {
      if (!mounted) return;
      cycle().then(() => {
        if (!mounted) return;
        const t = setTimeout(loop, reduce ? 1600 : gapMs);
        timers.add(t);
      });
    };

    const onResize = () => {
      clearTimeout(resizeRT);
      resizeRT = setTimeout(() => mounted && build(), 150);
    };

    // start after layout settles
    const boot = setTimeout(() => {
      if (!mounted) return;
      build();
      loop();
    }, 60);
    timers.add(boot);
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      clearTimeout(resizeRT);
      window.removeEventListener("resize", onResize);
    };
  }, [gapMs]);

  const setNode = (id) => (el) => {
    if (el) nodes.current[id] = el;
  };

  return (
    <div ref={rootRef} className={`jf-pipeline ${className}`}>
      <style>{CSS}</style>

      <div className="canvas-wrap">
        <div className="canvas-head">
          <span className="h">Lead Routing Workflow</span>
          <span className="badge"><i />Active</span>
        </div>

        <div className="canvas" ref={canvasRef}>
          <svg id="wires" ref={svgRef} />

          <div className="node" data-accent="trigger" ref={setNode("n1")} style={{ left: "18%", top: "30%" }}>
            <div className="top">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
                </svg>
              </div>
              <div>
                <div className="title">New Lead</div>
                <div className="kind">webhook.trigger</div>
              </div>
            </div>
            <div className="state"><i /><span>Idle</span></div>
          </div>

          <div className="node" data-accent="ai" ref={setNode("n2")} style={{ left: "50%", top: "56%" }}>
            <div className="top">
              <div className="ic">
                <span className="ic-ring" aria-hidden="true" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3 3 3 0 0 0 6 0 3 3 0 0 0 3-3 3 3 0 0 0 0-6 3 3 0 0 0-3-3 3 3 0 0 0-3-3z" />
                  <path d="M12 8v8M9 12h6" />
                </svg>
              </div>
              <div>
                <div className="title">AI Classify</div>
                <div className="kind">score.route</div>
              </div>
            </div>
            <div className="state"><i /><span>Idle</span></div>
          </div>

          <div className="node" data-accent="action" ref={setNode("n3")} style={{ left: "82%", top: "26%" }}>
            <div className="top">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="8" ry="3" />
                  <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
                </svg>
              </div>
              <div>
                <div className="title">CRM Update</div>
                <div className="kind">create.record</div>
              </div>
            </div>
            <div className="state"><i /><span>Idle</span></div>
          </div>

          <div className="node" data-accent="action" ref={setNode("n4")} style={{ left: "82%", top: "82%" }}>
            <div className="top">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
              </div>
              <div>
                <div className="title">Notify Team</div>
                <div className="kind">slack + email</div>
              </div>
            </div>
            <div className="state"><i /><span>Idle</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.jf-pipeline{
  --trigger:#3B82F6; --ai:#3859a8; --action:#12a06b;
  --slate:#3a4160; --muted:#9aa0b6; --faint:#b7bccd;
  --card:#fff; --wash:#f7f8fc; --line:#e8eaf2;
  --grid:rgba(40,52,110,0.055);
  --ease:cubic-bezier(.22,.61,.36,1);
  font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.jf-pipeline *{box-sizing:border-box}
.jf-pipeline .canvas-wrap{width:100%;max-width:640px;background:var(--card);border:1px solid var(--line);
  border-radius:14px;box-shadow:0 10px 30px -14px rgba(31,37,64,.28);overflow:hidden}
.jf-pipeline .canvas-head{display:flex;align-items:center;justify-content:space-between;padding:11px 15px;border-bottom:1px solid #eef0f6}
.jf-pipeline .canvas-head .h{font-size:13px;font-weight:700;color:#232a45}
.jf-pipeline .badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--action);
  background:#e7f6ef;border:1px solid #c9ecdd;padding:3px 9px;border-radius:999px}
.jf-pipeline .badge i{width:6px;height:6px;border-radius:50%;background:var(--action);animation:jf-breathe 2.4s ease-in-out infinite}
@keyframes jf-breathe{0%,100%{opacity:.55;transform:scale(.82)}50%{opacity:1;transform:scale(1.12)}}

.jf-pipeline .canvas{position:relative;height:360px;
  background:
    radial-gradient(460px 260px at 50% 42%, rgba(56,89,168,.07), transparent 72%),
    radial-gradient(circle at 1px 1px, var(--grid) 1px, transparent 0) 0 0 / 22px 22px}
.jf-pipeline #wires{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.jf-pipeline #wires .flow{animation:jf-flow 1.3s linear infinite}
@keyframes jf-flow{to{stroke-dashoffset:-21}}

.jf-pipeline .node{position:absolute;transform:translate(-50%,-50%);width:156px;background:var(--card);
  border:1px solid var(--line);border-radius:12px;padding:10px 11px;z-index:3;
  box-shadow:0 1px 2px rgba(31,37,64,.06),0 14px 30px -18px rgba(31,37,64,.45);
  transition:border-color .4s var(--ease),box-shadow .4s var(--ease),transform .4s var(--ease)}
.jf-pipeline .node.fire{transform:translate(-50%,-50%) scale(1.035);z-index:5}
.jf-pipeline .node .top{display:flex;align-items:center;gap:9px}
.jf-pipeline .node .ic{width:29px;height:29px;border-radius:8px;flex:0 0 auto;position:relative;display:grid;place-items:center;
  background:var(--wash);color:var(--faint);transition:background .3s,color .3s}
.jf-pipeline .node .ic svg{width:15px;height:15px;position:relative;z-index:1}
.jf-pipeline .node .title{font-size:13.5px;font-weight:700;color:#232a45;line-height:1.15}
.jf-pipeline .node .kind{display:inline-block;font-size:10.5px;color:#4c5578;font-weight:600;margin-top:4px;
  padding:2px 6px;border-radius:5px;background:#eef0f7;letter-spacing:.01em;
  font-family:"JetBrains Mono",ui-monospace,monospace}
.jf-pipeline .node .state{margin-top:10px;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;
  color:#565f7d;padding:3px 9px;border-radius:6px;background:var(--wash)}
.jf-pipeline .node .state i{width:5px;height:5px;border-radius:50%;background:var(--faint);transition:background .3s}

.jf-pipeline .node[data-accent="trigger"].fire{border-color:var(--trigger);box-shadow:0 0 0 1px var(--trigger),0 10px 26px -10px rgba(59,130,246,.55)}
.jf-pipeline .node[data-accent="ai"].fire{border-color:var(--ai);box-shadow:0 0 0 1px var(--ai),0 10px 26px -10px rgba(56,89,168,.55)}
.jf-pipeline .node[data-accent="action"].fire{border-color:var(--action);box-shadow:0 0 0 1px var(--action),0 10px 26px -10px rgba(18,160,107,.5)}
.jf-pipeline .node[data-accent="trigger"].fire .ic{background:#eaf1fe;color:var(--trigger)}
.jf-pipeline .node[data-accent="ai"].fire .ic{background:#e8eefb;color:var(--ai)}
.jf-pipeline .node[data-accent="action"].fire .ic{background:#e6f7f0;color:var(--action)}
.jf-pipeline .node[data-accent="trigger"].fire .state{color:var(--trigger);background:#eaf1fe}
.jf-pipeline .node[data-accent="ai"].fire .state{color:var(--ai);background:#e8eefb}
.jf-pipeline .node[data-accent="action"].fire .state{color:var(--action);background:#e6f7f0}
.jf-pipeline .node.fire .state i{background:currentColor}

.jf-pipeline .node .ic{overflow:visible}
@property --jf-a{syntax:"<angle>";inherits:false;initial-value:0deg}
.jf-pipeline .ic-ring{position:absolute;left:-3px;top:-3px;width:calc(100% + 6px);height:calc(100% + 6px);
  border-radius:11px;padding:2.2px;pointer-events:none;opacity:0;transition:opacity .3s;
  background:conic-gradient(from var(--jf-a, 0deg), transparent 0deg, var(--ai) 68deg, transparent 150deg);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;
  filter:drop-shadow(0 0 4px rgba(56,89,168,.5))}
.jf-pipeline .node.think .ic-ring{opacity:1;animation:jf-rot 1.1s linear infinite}
@keyframes jf-rot{to{--jf-a:360deg}}

@media (prefers-reduced-motion:reduce){.jf-pipeline *{animation-duration:.001s!important}}
`;
