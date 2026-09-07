'use client';
import { useEffect, useRef, useState } from 'react';
import type * as Three from 'three';

/** A functional data-flow view. Text and navigation do not depend on WebGL. */
export function SystemScene({
  flow,
  step,
  enabled,
}: {
  flow: string[];
  step: number;
  enabled: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(false);
  const flowKey = flow.join('|');
  useEffect(() => {
    if (!enabled || !host.current) return;
    let disposed = false;
    let cleanup = () => {};
    import('three')
      .then((THREE) => {
        if (disposed || !host.current) return;
        const mount = host.current;
        let renderer: Three.WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
          setAvailable(false);
          return;
        }
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
        const angle = [-0.3, 0.12, 0.4][step % 3];
        camera.position.set(angle * 8, 4.2, 10.5);
        camera.lookAt(0, 0, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
        renderer.setClearColor(0x131810, 0);
        mount.appendChild(renderer.domElement);
        scene.add(new THREE.AmbientLight(0xdfe8cf, 2.5));
        const light = new THREE.DirectionalLight(0xd2f76a, 4);
        light.position.set(2, 5, 3);
        scene.add(light);
        const group = new THREE.Group();
        scene.add(group);
        const resources: { dispose: () => void }[] = [];
        const labels = flowKey.split('|');
        const gap = 2.15;
        labels.forEach((_, i) => {
          const geometry = new THREE.BoxGeometry(1.55, 0.42 + i * 0.08, 1.6);
          const material = new THREE.MeshStandardMaterial({
            color: i === step % labels.length ? 0xd2f76a : 0x35482a,
            metalness: 0.25,
            roughness: 0.55,
          });
          const block = new THREE.Mesh(geometry, material);
          block.position.set((i - (labels.length - 1) / 2) * gap, 0, 0);
          group.add(block);
          resources.push(geometry, material);
          const edgeGeometry = new THREE.EdgesGeometry(geometry);
          const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0x8aa35e,
            transparent: true,
            opacity: 0.65,
          });
          const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial);
          block.add(edge);
          resources.push(edgeGeometry, edgeMaterial);
          if (i > 0) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(block.position.x - gap + 0.78, 0, 0),
              new THREE.Vector3(block.position.x - 0.78, 0, 0),
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xd2f76a,
            });
            group.add(new THREE.Line(lineGeometry, lineMaterial));
            resources.push(lineGeometry, lineMaterial);
          }
        });
        const grid = new THREE.GridHelper(14, 18, 0x35452c, 0x25321f);
        grid.position.y = -0.65;
        scene.add(grid);
        const render = () => {
          if (!disposed) renderer.render(scene, camera);
        };
        const resize = () => {
          const { width, height } = mount.getBoundingClientRect();
          renderer.setSize(width, height);
          camera.aspect = width / Math.max(1, height);
          camera.updateProjectionMatrix();
          render();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(mount);
        resize();
        // Short camera transition, no perpetual render loop at rest.
        let frame = 0;
        const started = performance.now();
        const animate = (now: number) => {
          const t = Math.min(1, (now - started) / 650);
          group.rotation.y = (1 - t) ** 3 * -0.22;
          render();
          if (t < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        const lost = (event: Event) => {
          event.preventDefault();
          setAvailable(false);
        };
        renderer.domElement.addEventListener('webglcontextlost', lost);
        setAvailable(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          renderer.domElement.removeEventListener('webglcontextlost', lost);
          resources.forEach((r) => r.dispose());
          grid.geometry.dispose();
          (grid.material as Three.Material).dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => setAvailable(false));
    return () => {
      disposed = true;
      cleanup();
    };
  }, [enabled, flowKey, step]);
  return (
    <div className={`system-scene ${enabled && available ? 'has-webgl' : ''}`}>
      <div className="scene-label">
        <span>DATA FLOW</span>
        <span>{enabled && available ? '空间视图' : '静态视图'}</span>
      </div>
      {enabled && <div ref={host} className="webgl-host" aria-hidden="true" />}
      <ol className="flow-nodes" aria-label="处理流程">
        {flow.map((label, i) => (
          <li key={`${i}-${label}`}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <strong>{label}</strong>
            {i < flow.length - 1 && <b aria-hidden="true">→</b>}
          </li>
        ))}
      </ol>
      <p className="scene-caption">
        {flow[0]} → {flow[flow.length - 1]}
      </p>
    </div>
  );
}
