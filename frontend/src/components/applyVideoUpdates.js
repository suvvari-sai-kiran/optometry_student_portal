const fs = require('fs');
const path = require('path');
const dir = 'd:/Student learning portal/frontend/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Video.jsx'));

let updated = 0;

const handleSeekCode = `
  const handleSeek = (e) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newScene = Math.floor(percentage * SCRIPT.length);
    setCurrentScene(Math.max(0, Math.min(newScene, SCRIPT.length - 1)));
  };
`;

const newProgressBar = `
          {isPlaying && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-4 bg-black/80 flex z-[60] group cursor-pointer border-t border-white/10"
              onClick={handleSeek}
              title="Click to skip"
            >
              {SCRIPT.map((scene, idx) => (
                <div key={idx} className="flex-1 h-full border-r border-black/40 relative group/seek">
                  {idx < currentScene && <div className={\`absolute inset-0 \${A.bar}\`} />}
                  {idx === currentScene && (
                    <motion.div 
                      className={\`absolute left-0 top-0 bottom-0 \${A.bar} \${A.glow}\`}
                      initial={{ width: 0 }} 
                      animate={{ width: '100%' }} 
                      transition={{ duration: (scene.duration ?? 5000) / 1000, ease: 'linear' }} 
                    />
                  )}
                  {/* Hover indicator */}
                  <div className="absolute inset-0 hover:bg-white/30 transition-colors" />
                </div>
              ))}
            </div>
          )}`;

files.forEach(f => {
  const file = path.join(dir, f);
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!content.includes('const handleSeek')) {
    content = content.replace(
      /const handleStop = \(\) => \{[^\}]*\};?\s*/,
      match => match + handleSeekCode
    );
    changed = true;
  }

  // Remove old top progress bar
  const oldProgressBarRegex = /\{\s*isPlaying\s*&&\s*\(\s*<div\s+className="shrink-0\s+h-\[3px\][^>]*>.*?<\/div>\s*\)\s*\}/gs;
  if (oldProgressBarRegex.test(content)) {
    content = content.replace(oldProgressBarRegex, '');
    changed = true;
  }

  // Remove the `3/10` index text and replace with new interactive progress bar
  const indexTextRegex = /\{\s*isPlaying\s*&&\s*<div\s+className="absolute\s+top-2\.5\s+left-3[^>]*>.*?<\/div>\s*\}/g;
  if (indexTextRegex.test(content)) {
    content = content.replace(indexTextRegex, newProgressBar);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    updated++;
  }
});
console.log('Updated ' + updated + ' files');
