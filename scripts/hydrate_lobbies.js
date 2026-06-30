const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '..', 'views');

// Helper to find all ejs files recursively
function getEjsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getEjsFiles(filePath));
    } else if (file.endsWith('.ejs')) {
      results.push(filePath);
    }
  });
  return results;
}

const ejsFiles = getEjsFiles(viewsDir);
console.log(`Found ${ejsFiles.length} EJS files.`);

ejsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Regex to find game items that DO NOT have "default-col"
  // Example match:
  // <div data-id="SPORTS-PINNACLE" data-type="SPORTS" data-gp="pinnacle" class="game-item PINNACLE">
  // We match until the closing </div> of that game-item. Since we know the inner HTML structure is very standard:
  // <div class="favorite-game-icon-wrapper"><div class="fav-btn"></div></div><div class="loading-block"></div><div class="loading-skeleton-wrapper"><span aria-live="polite" aria-busy="true"><span class="react-loading-skeleton loading-skeleton" style="--base-color: transparent;">‌</span><br></span></div></div>
  // Wait, let's write a regex that matches the opening tag, then any inner content (non-greedily), and then the closing </div>.
  // We can verify if it contains "loading-skeleton-wrapper" to make sure it's a skeleton.
  
  // We match the opening div tag, then the inner contents containing loading-skeleton-wrapper, up to the end of the loading-skeleton-wrapper's closing div, and then the final closing div of the game-item.
  const itemRegex = /<div\s+data-id="([^"]+)"\s+data-type="([^"]+)"\s+data-gp="([^"]+)"\s+class="game-item\s+([^" ]+)"\s*>([\s\S]*?class="loading-skeleton-wrapper"[\s\S]*?<\/div>\s*)<\/div>/g;
  
  let modified = false;
  content = content.replace(itemRegex, (match, id, type, gp, gpClass, innerHtml) => {
    // If it already has default-col, skip it
    if (match.includes('default-col')) {
      return match;
    }
    
    console.log(`Hydrating ${id} in ${path.relative(viewsDir, file)}`);
    
    // Generate the hydrated inner HTML
    const typeLower = type.toLowerCase();
    const gpLower = gp.toLowerCase();
    const gpUpper = gp.toUpperCase();
    const displayName = gpUpper.replace(/_/g, ' ');
    
    const hydratedInner = `<div class="game-content"><div class="game-logo" style="background-image: url(&quot;/img.alltocon.com/img/static/gplogo/h-primary/${gpLower}.png&quot;);"></div><div class="game-col-cover" style="visibility: visible; background-image: url(&quot;/img.alltocon.com/img/static/col_cover/${typeLower}_${gpLower}.png&quot;);"></div></div><div class="game-info"><h3 gp="${gpUpper}" style="background-image: url(&quot;/img.alltocon.com/img/static/gplogo/v-primary/${gpLower}.png&quot;); visibility: visible;">${displayName}</h3><div class="pd-name" data-type="${type}">${displayName}</div><button>Bắt đầu</button></div><div class="favorite-game-icon-wrapper"><div class="fav-btn"></div></div><div class="loading-block"></div>`;
    
    // Add default-col to class
    const hydratedDiv = `<div data-id="${id}" data-type="${type}" data-gp="${gp}" class="game-item ${gpClass} default-col">${hydratedInner}</div>`;
    
    modified = true;
    return hydratedDiv;
  });
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Saved changes to ${path.relative(viewsDir, file)}`);
  }
});
