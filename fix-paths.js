const fs = require('fs');
const path = require('path');

const repositoryName = 'tic-tac-toe-two';
const outDir = path.join(process.cwd(), 'out');

function processHtmlFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Corrige caminhos absolutos para CSS e JS no GitHub Pages
      content = content.replace(/"\/_next\//g, `"/${repositoryName}/_next/`);
      
      // Corrige problemas com href absolutos em links internos
      content = content.replace(/href="\//g, `href="/${repositoryName}/`);
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed paths in ${filePath}`);
    }
  });
}

processHtmlFiles(outDir);
console.log('Path fixing completed.');