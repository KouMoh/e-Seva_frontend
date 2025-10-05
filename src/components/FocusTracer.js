"use client";
import { useEffect, useState } from "react";

export default function FocusTracer() {
  const [last, setLast] = useState(null);

  useEffect(() => {
    function describe(el) {
      if (!el) return 'null';
      const classes = el.className ? String(el.className).split(/\s+/).slice(0,2).join('.') : '';
      const id = el.id ? `#${el.id}` : '';
      const name = el.name ? ` name="${el.name}"` : '';
      const type = el.type ? ` type="${el.type}"` : '';
      const text = el.value ? ` value="${String(el.value).slice(0,20)}"` : '';
      return `${el.tagName}${id}${classes ? `.${classes}` : ''}${type}${name}${text}`;
    }

    function onFocus(e) {
      const t = e.target;
      const desc = describe(t);
      try {
        const outer = t && t.outerHTML ? String(t.outerHTML).slice(0,200) : '';
        console.log(`FocusTracer: focusin -> ${desc}`, { el: t, outer: outer });
      } catch (err) {
        console.log('FocusTracer: focusin ->', desc, t);
      }
      setLast(desc);
    }

    function onBlur(e) {
      // keep minimal
    }

    function onKey(e) {
      const active = document.activeElement;
      console.log(`FocusTracer: keydown key="${e.key}" active=${describe(active)}`);
    }

    // Mutation observer to detect nodes being removed/added which can indicate remounts
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          if (m.removedNodes && m.removedNodes.length) {
            console.log('FocusTracer: DOM removed nodes', m.removedNodes);
          }
          if (m.addedNodes && m.addedNodes.length) {
            console.log('FocusTracer: DOM added nodes', m.addedNodes);
          }
        }
      }
    });

    window.addEventListener("focusin", onFocus);
    window.addEventListener("focusout", onBlur);
    window.addEventListener('keydown', onKey, true);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("focusin", onFocus);
      window.removeEventListener("focusout", onBlur);
      window.removeEventListener('keydown', onKey, true);
      obs.disconnect();
    };
  }, []);

  return (
    <div style={{position:'fixed',right:10,top:10,background:'#111',color:'#fff',padding:'6px 8px',borderRadius:6,zIndex:9999,fontSize:12,opacity:0.9}}>
      <div style={{fontWeight:600}}>Focus</div>
      <div style={{fontFamily:'monospace',fontSize:11}}>{last}</div>
    </div>
  );
}
