const fs = require('fs');
const path = require('path');

const jsxDir = path.join(__dirname, 'src', 'pages', 'farmer');
const cssDir = path.join(__dirname, 'src', 'styles');

const glassJSX = "background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'";
const glassCSS = "background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3);";

function replaceInDir(dir, ext, searchRegex, replaceStr) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, ext, searchRegex, replaceStr);
    } else if (file.endsWith(ext)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (searchRegex.test(content)) {
        content = content.replace(searchRegex, replaceStr);
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

// Replace in JSX files
replaceInDir(jsxDir, '.jsx', /background:\s*['"]#(fff|ffffff)['"]/g, glassJSX);
// Replace in CSS files
replaceInDir(cssDir, '.css', /background:\s*(white|#fff|#ffffff);/g, glassCSS);

console.log('Done');
