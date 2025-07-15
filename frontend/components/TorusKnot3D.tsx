import { useEffect, useRef } from 'react';

export default function TorusKnot3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: any, scene: any, camera: any, knot: any, animationId: number, geometry: any, material: any, wireframe: any;
    let width = 300;
    let height = 300;
    let resizeObserver: ResizeObserver | null = null;

    import('three').then(THREE => {
      scene = new THREE.Scene();
      // Do not set scene.background for transparency

      if (mountRef.current) {
        width = mountRef.current.clientWidth || 300;
        height = mountRef.current.clientHeight || 300;
      }
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0); // Fully transparent
      renderer.setSize(width, height);
      if (mountRef.current) {
        while (mountRef.current.firstChild) {
          mountRef.current.removeChild(mountRef.current.firstChild);
        }
        mountRef.current.appendChild(renderer.domElement);
      }

      geometry = new THREE.TorusKnotGeometry(1.2, 0.2, 80, 8, 2, 1);
      material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        metalness: 1,
        roughness: 0.1,
        flatShading: true,
      });
      knot = new THREE.Mesh(geometry, material);
      scene.add(knot);

      wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1 })
      );
      knot.add(wireframe);

      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const directional = new THREE.DirectionalLight(0xffffff, 0.5);
      directional.position.set(2, 3, 5);
      scene.add(directional);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        knot.rotation.x += 0.01;
        knot.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      // Responsive resize with ResizeObserver
      if (mountRef.current) {
        resizeObserver = new ResizeObserver(entries => {
          for (let entry of entries) {
            const { width: newWidth, height: newHeight } = entry.contentRect;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
          }
        });
        resizeObserver.observe(mountRef.current);
      }

      return () => {
        if (resizeObserver && mountRef.current) {
          resizeObserver.unobserve(mountRef.current);
        }
        window.removeEventListener('resize', () => {});
        cancelAnimationFrame(animationId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    });
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', maxWidth: '100%', aspectRatio: '1 / 1', minHeight: 180, padding: 0 }} />
  );
} 