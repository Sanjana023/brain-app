import { Brain } from 'lucide-react';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

// Create and render the Brain icon
const brainContainer = document.getElementById('brain-icon-container');
const brainRoot = createRoot(brainContainer);

const BrainIcon = createElement(Brain, {
  size: 120,
  color: '#a855f7',
  style: {
    animation: 'brain-pulse 2s ease-in-out infinite, float 3s ease-in-out infinite',
    filter: 'drop-shadow(0 10px 30px rgba(168, 85, 247, 0.3))',
    transition: 'all 0.3s ease'
  }
});

brainRoot.render(BrainIcon);

// Progress bar logic
 
const splash = document.getElementById('splash-screen');
const root = document.getElementById('root');
const bar = document.getElementById('progress-bar');
const percent = document.getElementById('progress-percent');

let progress = 0;
const duration = 3000;  
const intervalTime = 100;  
const steps = duration / intervalTime;
const increment = 100 / steps;

const interval = setInterval(() => {
  progress += increment;
  if (progress > 100) progress = 100;

  bar.style.width = progress + '%';
  percent.textContent = Math.floor(progress) + '%';

  if (progress >= 100) {
    clearInterval(interval);
    // Immediately hide splash and show root after 3s total
    splash.classList.add('hidden');
    root.classList.remove('hidden');
  }
}, intervalTime);
