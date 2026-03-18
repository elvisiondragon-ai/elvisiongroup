const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js')) {
      callback(dirPath);
    }
  });
}

const srcDir = path.join(__dirname, 'src');

walk(srcDir, (filePath) => {
  if (filePath.endsWith('App.tsx') || filePath.endsWith('App.tsx.bak')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Process imports
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]react-router-dom['"];?/g;
  content = content.replace(importRegex, (match, importsStr) => {
    let imports = importsStr.split(',').map(s => s.trim()).filter(s => s);
    let nextNavImports = [];
    let hasLink = false;

    if (imports.includes('useNavigate')) nextNavImports.push('useRouter');
    if (imports.includes('useLocation')) nextNavImports.push('usePathname');
    if (imports.includes('useSearchParams')) nextNavImports.push('useSearchParams');
    if (imports.includes('Link')) hasLink = true;

    // Remove them from original imports to see if any are left
    imports = imports.filter(i => !['useNavigate', 'useLocation', 'useSearchParams', 'Link'].includes(i));

    let res = [];
    if (imports.length > 0) {
      res.push(`import { ${imports.join(', ')} } from 'react-router-dom';`);
    }
    if (hasLink) {
      res.push(`import Link from 'next/link';`);
    }
    if (nextNavImports.length > 0) {
      res.push(`import { ${nextNavImports.join(', ')} } from 'next/navigation';`);
    }

    return res.join('\n');
  });

  // Also process "import { Link } from 'react-router-dom';"
  // The above regex handles it. But what about default imports? (None in react-router-dom usually)

  // 2. useNavigate -> useRouter
  content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');

  // 3. navigate -> router.push / back / replace
  content = content.replace(/\bnavigate\(([^)]+)\)/g, (match, argsStr) => {
    let args = argsStr.trim();
    if (args === '-1') {
      return 'router.back()';
    } else if (args.includes('{') && args.includes('replace')) {
      let pathArg = args.split(',')[0].trim();
      return `router.replace(${pathArg})`;
    } else {
      return `router.push(${args})`;
    }
  });

  // 4. useLocation -> usePathname
  content = content.replace(/const\s+location\s*=\s*useLocation\(\);?/g, 'const pathname = usePathname();');
  content = content.replace(/\blocation\.pathname\b/g, 'pathname');

  // 5. useSearchParams
  content = content.replace(/const\s*\[\s*searchParams\s*\]\s*=\s*useSearchParams\(\);?/g, 'const searchParams = useSearchParams();');
  
  // What if there is const [searchParams, setSearchParams]? 
  // NextJS searchParams is readonly, we remove setSearchParams.
  content = content.replace(/const\s*\[\s*searchParams\s*,\s*setSearchParams\s*\]\s*=\s*useSearchParams\(\);?/g, 'const searchParams = useSearchParams();');

  // 6. <Link to="..."> -> <Link href="...">
  // Need to be careful to only replace `to=` inside `<Link` or `<Link `
  content = content.replace(/<Link([^>]+)to=/g, '<Link$1href=');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
});
