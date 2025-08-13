import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const CONTRACT = "Soon"; 

const LINKS = {
  x: "https://x.com/GamerPicSOL",
  dexscreener: `https://dexscreener.com/solana/${CONTRACT}`,
  pumpfun: `https://pump.fun/coin/${CONTRACT}`,
  gamerpics: "https://xboxgamer.pics/",
};

// Random Xbox profile icons
const PROFILE_ICONS = [
  "https://assets.xboxgamer.pics/titles/fffe07d1/21006.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20002.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/21019.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20006.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20007.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20009.png",
  "https://assets.xboxgamer.pics/titles/444d07d1/2808e.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/2000c.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20004.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20003.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20000.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/21020.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20001.png",
  "https://assets.xboxgamer.pics/titles/544607d7/28017.png",
  "https://assets.xboxgamer.pics/titles/565507e2/28000.png",
  "https://assets.xboxgamer.pics/titles/4d4207d1/20375.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/21016.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/21029.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/20008.png",
  "https://assets.xboxgamer.pics/titles/494d8835/20005.png",
  "https://assets.xboxgamer.pics/titles/5857094b/20408.png",
  "https://assets.xboxgamer.pics/titles/465607d3/2802e.png",
  "https://assets.xboxgamer.pics/titles/fffe07d1/2000a.png",
  "https://assets.xboxgamer.pics/titles/494d8867/20003.png",
  "https://assets.xboxgamer.pics/titles/4d530822/20002.png",
  "https://assets.xboxgamer.pics/titles/41560855/20429.png"
];


function AnimatedBackground() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x333338, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Shader material for smooth gradient background
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // Base gradient
        float gradient = smoothstep(0.0, 1.0, uv.y);
        vec3 baseColor = mix(vec3(0.376, 0.376, 0.376), vec3(0.219, 0.219, 0.219), gradient);
        
        // Animated light orbs
        vec2 orb1 = vec2(0.3 + 0.2 * sin(time * 0.5), 0.4 + 0.1 * cos(time * 0.7));
        vec2 orb2 = vec2(0.7 + 0.15 * cos(time * 0.3), 0.6 + 0.2 * sin(time * 0.4));
        vec2 orb3 = vec2(0.5 + 0.25 * sin(time * 0.6), 0.2 + 0.15 * cos(time * 0.8));
        
        float light1 = 1.0 - smoothstep(0.0, 0.4, distance(uv, orb1));
        float light2 = 1.0 - smoothstep(0.0, 0.3, distance(uv, orb2));
        float light3 = 1.0 - smoothstep(0.0, 0.35, distance(uv, orb3));
        
        // Combine lights
        float totalLight = (light1 * 0.15 + light2 * 0.12 + light3 * 0.10);
        
        // Final color
        vec3 finalColor = baseColor + vec3(totalLight);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0.0 }
      }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 1;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.time.value += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []);

  return <div ref={mountRef} className="animated-bg" />;
}

function Tile({ onClick, href, className = "", children }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      className={`tile ${className}`}
      onClick={onClick}
      href={href || undefined}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
    >
      {children}
    </Tag>
  );
}

function Toast({ text, onDone }) {
  if (!text) return null;
  return <div className="toast" onAnimationEnd={onDone}>{text}</div>;
}

function XboxProfile() {
  const randomIcon = PROFILE_ICONS[Math.floor(Math.random() * PROFILE_ICONS.length)];
  
  return (
    <div className="xbox-profile">
      <img src={randomIcon} alt="Xbox Profile" />
    </div>
  );
}

function XboxHeader() {
  return (
    <div className="x-tabs" aria-hidden="true">
      <span>bing</span>
      <span className="active">home</span>
      <span>social</span>
      <span>games</span>
      <span>tv & movies</span>
      <span>music</span>
      <span>apps</span>
      <span>settings</span>
    </div>
  );
}

function XboxLogo() {
  return (
    <div className="xbox-logo">
      <img src="/xbox.svg" alt="Xbox Logo" />
    </div>
  );
}

export default function App() {
  const [showStartup, setShowStartup] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    // Start fade-out at 8.5s, switch page at 9s
    const fadeTimer = setTimeout(() => setFadeOut(true), 8500);
    const endTimer = setTimeout(() => setShowStartup(false), 9000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setToast("Contract copied!");
    } catch {
      setToast("Copy failed — select manually.");
    }
  };

  return (
    <>
      {showStartup && (
        <div className={`startup-overlay ${fadeOut ? "fade" : ""}`}>
          <video
            src="/startup.mp4"
            autoPlay
            muted
            playsInline
          />
        </div>
      )}

      {!showStartup && (
        <div className="screen">
          <XboxHeader />
          <AnimatedBackground />
          <XboxLogo />
          <XboxProfile />
          <div className="dash">
            <Tile className="leftTop" href={LINKS.x}>
              <span className="tileText">𝕏</span>
            </Tile>
            <Tile className="leftBottom" onClick={copyCA}>
              <span className="tileText small">CA<br/>(Click to copy)</span>
            </Tile>
            <Tile className="centerBig" href={LINKS.gamerpics} />
            <Tile className="rightTop" href={LINKS.pumpfun} />
            <Tile className="rightBottom" href={LINKS.dexscreener} />
          </div>
          <Toast text={toast} onDone={() => setToast("")} />
        </div>
      )}
    </>
  );
}