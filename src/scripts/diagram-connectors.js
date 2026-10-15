const svgNamespace = 'http://www.w3.org/2000/svg';

// Measure the rendered cards so routes stay attached as the diagram reflows.
export function drawDiagramConnectors({ stage, svg, hub, sources, targets, shape = 'circle' }) {
  if (!stage || !svg || !hub) return;

  const stageBox = stage.getBoundingClientRect();
  const sourceCards = [...stage.querySelectorAll(sources)];
  const targetCards = [...stage.querySelectorAll(targets)];
  if (stageBox.width < 1 || stageBox.height < 1 || !sourceCards.length || !targetCards.length) {
    svg.replaceChildren();
    return;
  }

  const hubBox = hub.getBoundingClientRect();
  const cx = hubBox.left - stageBox.left + hubBox.width / 2;
  const cy = hubBox.top - stageBox.top + hubBox.height / 2;
  const radius = Math.min(hubBox.width, hubBox.height) / 2;
  const vertical = sourceCards.every((card) => card.getBoundingClientRect().bottom <= hubBox.top + 1)
    && targetCards.every((card) => card.getBoundingClientRect().top >= hubBox.bottom - 1);
  const routes = [];
  svg.setAttribute('viewBox', `0 0 ${stageBox.width} ${stageBox.height}`);

  const hubPoint = (side, index, count, cardCenterX) => {
    const span = vertical ? hubBox.width : hubBox.height;
    const spread = shape === 'circle' ? Math.min(0.8, (count - 1) * 0.24) * radius : Math.min(56, span / (count + 1)) * (count - 1) / 2;
    const offset = count === 1 ? 0 : (index - (count - 1) / 2) * 2 * spread / (count - 1);
    if (vertical) {
      const x = shape === 'circle'
        ? cx + offset
        : Math.max(hubBox.left - stageBox.left + 18, Math.min(hubBox.right - stageBox.left - 18, cardCenterX));
      const y = shape === 'circle'
        ? cy + (side === 'top' ? -1 : 1) * Math.sqrt(Math.max(0, radius ** 2 - offset ** 2))
        : hubBox[side] - stageBox.top;
      return [x, y];
    }
    const y = cy + offset;
    const x = shape === 'circle'
      ? cx + (side === 'left' ? -1 : 1) * Math.sqrt(Math.max(0, radius ** 2 - offset ** 2))
      : hubBox[side] - stageBox.left;
    return [x, y];
  };

  sourceCards.forEach((card, index) => {
    const box = card.getBoundingClientRect();
    const start = vertical
      ? [box.left - stageBox.left + box.width / 2, box.bottom - stageBox.top]
      : [box.right - stageBox.left, box.top - stageBox.top + box.height / 2];
    routes.push([start, hubPoint(vertical ? 'top' : 'left', index, sourceCards.length, start[0])]);
  });

  targetCards.forEach((card, index) => {
    const box = card.getBoundingClientRect();
    const end = vertical
      ? [box.left - stageBox.left + box.width / 2, box.top - stageBox.top]
      : [box.left - stageBox.left, box.top - stageBox.top + box.height / 2];
    routes.push([hubPoint(vertical ? 'bottom' : 'right', index, targetCards.length, end[0]), end]);
  });

  const fragment = document.createDocumentFragment();
  routes.forEach(([[x1, y1], [x2, y2]], index) => {
    const path = document.createElementNS(svgNamespace, 'path');
    const bend = Math.max(14, Math.abs(vertical ? y2 - y1 : x2 - x1) * 0.52);
    path.setAttribute('d', vertical
      ? `M ${x1} ${y1} C ${x1} ${y1 + bend}, ${x2} ${y2 - bend}, ${x2} ${y2}`
      : `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
    path.classList.add('diagram-connector');
    path.style.animationDelay = `${-index * 0.34}s`;
    fragment.append(path);

    [[x1, y1], [x2, y2]].forEach(([x, y]) => {
      const dot = document.createElementNS(svgNamespace, 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '4.5');
      dot.classList.add('diagram-connector-dot');
      fragment.append(dot);
    });
  });
  svg.replaceChildren(fragment);
}

export function watchDiagramConnectors(options) {
  const draw = () => drawDiagramConnectors(options);
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  };

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(options.stage);
    observer.observe(options.hub);
  }
  window.addEventListener('resize', schedule, { passive: true });
  options.stage.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', schedule, { once: true });
  });
  document.fonts?.ready.then(schedule);
  schedule();
}
