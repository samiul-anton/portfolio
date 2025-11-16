// enterprise-topology.js
// Minimal, self-contained injector for the Enterprise Architecture SVG
// Adds keyboard activation and wires node clicks to existing modal helpers
(function () {
  console.log('[enterprise-topology] init');

  // Wait for DOM ready if not already
  function ready(fn) {
    if (document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    console.log('[enterprise-topology] DOM ready');

    var topoEl = document.getElementById('enterpriseTopology');
    if (!topoEl) {
      console.error('[enterprise-topology] Missing element: #enterpriseTopology');
      return;
    }

    // Provide a visible fallback while the diagram loads
    topoEl.innerHTML = '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#777">Loading diagram…</div>';

    // Inline SVG string (clear fills, clickable groups with data-node)
    var svg = '\
<svg role="img" aria-label="Enterprise architecture diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" style="width:100%; height:100%; display:block;">\
  <defs><style>\
    .node{cursor:pointer;outline:none}\
    .node rect{stroke:#008cff;stroke-width:4;fill:#e8f6ff;rx:12}\
    .label{font-family:Segoe UI, Arial;fill:#003a55;font-size:18px;pointer-events:none}\
    .zone{fill:#008cff;opacity:0.06}\
    .link{stroke:#00bfff;stroke-width:4;stroke-linecap:round;opacity:0.9}\
  </style></defs>\
  <rect x="20" y="20" width="560" height="560" class="zone" />\
  <rect x="620" y="20" width="560" height="260" class="zone" />\
  <g class="node" data-node="Router" transform="translate(120,120)" tabindex="0" role="button" aria-label="Router">\
    <rect width="260" height="120"></rect>\
    <text class="label" x="130" y="72" text-anchor="middle">Edge Router</text>\
  </g>\
  <g class="node" data-node="Core Switch" transform="translate(420,120)" tabindex="0" role="button" aria-label="Core Switch">\
    <rect width="260" height="120"></rect>\
    <text class="label" x="130" y="72" text-anchor="middle">Core Switch</text>\
  </g>\
  <g class="node" data-node="Access Switch" transform="translate(720,120)" tabindex="0" role="button" aria-label="Access Switch">\
    <rect width="260" height="120"></rect>\
    <text class="label" x="130" y="72" text-anchor="middle">Access Switch</text>\
  </g>\
  <g class="node" data-node="Servers" transform="translate(320,320)" tabindex="0" role="button" aria-label="Servers">\
    <rect width="260" height="120"></rect>\
    <text class="label" x="130" y="72" text-anchor="middle">Servers Cluster</text>\
  </g>\
  <g class="node" data-node="NAS/Storage" transform="translate(720,320)" tabindex="0" role="button" aria-label="NAS Storage">\
    <rect width="260" height="120"></rect>\
    <text class="label" x="130" y="72" text-anchor="middle">NAS / Storage</text>\
  </g>\
  <path class="link" d="M280 180 L420 180" />\
  <path class="link" d="M580 180 L720 180" />\
  <path class="link" d="M550 380 L420 260" />\
  <path class="link" d="M580 380 L720 380" />\
</svg>';

    topoEl.innerHTML = svg;
    console.log('[enterprise-topology] SVG injected');

    // Attach interaction handlers for clickable nodes
    var nodes = topoEl.querySelectorAll('.node');
    nodes.forEach(function (n) {
      n.addEventListener('click', nodeActivate);
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nodeActivate.call(n, e);
        }
      });
    });

    // Activation: populate modal using global helpers if available
    function nodeActivate(e) {
      var nodeKey = this.getAttribute('data-node');
      console.log('[enterprise-topology] node activate:', nodeKey);

      var nodeInfo = (window.modalData && window.modalData[nodeKey]) || { text: 'Details coming soon', link: '#' };

      var titleEl = document.getElementById('modalTitle');
      var contentEl = document.getElementById('modalContent');
      var linkEl = document.getElementById('modalLink');
      var imgEl = document.getElementById('modalImage');

      if (titleEl) titleEl.textContent = nodeKey;
      if (contentEl) contentEl.textContent = nodeInfo.text || '';
      if (linkEl) linkEl.href = nodeInfo.link || '#';
      if (imgEl && typeof window.svgDataURI === 'function') {
        try {
          imgEl.src = window.svgDataURI(nodeKey);
          imgEl.style.display = 'block';
        } catch (err) {
          console.warn('[enterprise-topology] svgDataURI failed', err);
        }
      }
      if (typeof window.openPanel === 'function') {
        window.openPanel();
      } else {
        console.warn('[enterprise-topology] openPanel() not found - modal will not open automatically');
      }
    }
  });
})();