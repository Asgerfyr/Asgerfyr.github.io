/**
 * Component Renderer for Static Build
 * Executes TypeScript components at build time using render() methods
 * Generates all pages, sitemap, and robots.txt
 * Single source of truth: all component rendering through component.render()
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data', 'pages');
const pagesDir = path.join(rootDir, 'pages');

// Ensure output directories exist
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

/**
 * Load JSON configuration file
 */
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Error parsing JSON ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Dynamically import and render a component using render()
 * @param {string} componentName - Name of component (e.g., 'ProjectHeader')
 * @param {object} props - Props to pass to component
 * @returns {Promise<string>} HTML string from render()
 */
async function renderComponentStatic(componentName, props = {}) {
  try {
    const componentPath = path.join(
      rootDir,
      'src',
      'components',
      `${componentName}.ts`
    );

    if (!fs.existsSync(componentPath)) {
      console.warn(`⚠️  Component not found: ${componentPath}`);
      return '';
    }

    // Dynamically import the component
    const module = await import(`file://${componentPath}`);
    const component = module[componentName];

    if (!component || !component.render) {
      console.warn(`⚠️  Component ${componentName} doesn't export render method`);
      return '';
    }

    // Call render() - components are fully responsible for their own logic
    const result = component.render(props);

    if (typeof result === 'string') {
      return result;
    }

    console.warn(`⚠️  Component ${componentName}.render() returned unexpected type`);
    return '';
  } catch (error) {
    console.error(`❌ Error rendering component ${componentName}:`, error.message);
    return '';
  }
}

/**
 * Render all components from a page layout
 * @param {array} layout - Array of { component, props } objects
 * @param {string} pageName - For debugging
 * @returns {Promise<string>} Combined HTML
 */
async function renderLayout(layout = [], pageName = '') {
  if (!Array.isArray(layout)) return '';

  let html = '';
  for (const item of layout) {
    let props = item.props || {};
    
    // Special handling for ProjectList: load data from dataSource
    if (item.component === 'ProjectList' && props.dataSource && !props.projectData) {
      const dataSourcePath = props.dataSource;
      const filePath = path.join(rootDir, dataSourcePath);
      const projectData = loadJSON(filePath);
      if (projectData) {
        props = { ...props, projectData };
      }
    }
    
    const componentHtml = await renderComponentStatic(item.component, props);
    if (componentHtml) {
      html += componentHtml + '\n';
    } else if (pageName.startsWith('project_')) {
      console.warn(`⚠️  Component ${item.component} returned empty HTML for ${pageName}`);
    }
  }
  return html;
}

/**
 * Build a complete page with HTML structure
 * @param {string} pageName - Page name (e.g., 'home', 'project_LR_Light_Regulation')
 * @param {object} config - Page configuration from JSON
 * @returns {Promise<string>} Complete HTML page
 */
async function buildPage(pageName, config) {
  const layout = config.layout || [];
  const bodyContent = await renderLayout(layout, pageName);

  const title = config.pageTitle || config.title || 'Portfolio';
  const description = config.description || 'My Portfolio';
  
  // Build script tags from config
  const scripts = config.scripts || [];
  const scriptTags = scripts
    .map(src => `  <script src="${src}"><\/script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <title>${title}</title>
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"><\/script>
  
  <!-- Font Awesome for icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Page-specific styles -->
  <link rel="stylesheet" href="/css/common/standerd.css">
  <link rel="stylesheet" href="/css/common/config.css">
  ${pageName === 'home' ? '<link rel="stylesheet" href="/css/index/style.css">' : ''}
  ${pageName.startsWith('project_') ? '<link rel="stylesheet" href="/css/project/style.css">' : ''}
  ${pageName === 'project_viewer' ? '<link rel="stylesheet" href="/css/project_viewer/style.css">' : ''}
</head>
<body>
  ${bodyContent}
  
  <!-- Client-side JavaScript bundle -->
  <script src="/dist/app.js"><\/script>
  
  <!-- Page-specific scripts -->
${scriptTags}
</body>
</html>`;
}

/**
 * Main build function
 */
async function main() {
  console.log('🔨 Pre-rendering pages for SEO...\n');

  const pageFiles = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'));

  const pagesToBuild = [
    'home',
    ...pageFiles
      .filter(f => f.startsWith('project_') && f !== 'project_viewer.json')
      .map(f => f.replace('.json', ''))
  ];

  let successCount = 0;

  // Build all pages
  for (const pageName of pagesToBuild) {
    try {
      const configPath = path.join(dataDir, `${pageName}.json`);
      const config = loadJSON(configPath);
      
      if (!config) {
        console.error(`❌ Failed to load config for ${pageName}`);
        continue;
      }

      const html = await buildPage(pageName, config);

      // Determine output path
      let outputPath;
      if (pageName === 'home') {
        outputPath = path.join(rootDir, 'index.html');
      } else {
        outputPath = path.join(pagesDir, `${pageName}.html`);
      }

      // Write file
      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log(`✅ Built: ${pageName === 'home' ? 'index.html' : `pages/${pageName}.html`}`);
      successCount++;

    } catch (error) {
      console.error(`❌ Failed to build ${pageName}:`, error.message);
    }
  }

  // Generate sitemap.xml
  const today = new Date().toISOString().split('T')[0];
  const sitemapUrls = [
    `  <url>
    <loc>https://asgergs.dk/index.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
  ];

  pagesToBuild.forEach(page => {
    if (page !== 'home') {
      sitemapUrls.push(`  <url>
    <loc>https://asgergs.dk/pages/${page}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`✅ Generated: sitemap.xml`);

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /dist/
Disallow: /tasks/
Disallow: /data/

Sitemap: https://asgergs.dk/sitemap.xml
`;
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log(`✅ Generated: robots.txt`);

  console.log(`\n📦 Successfully rendered ${successCount}/${pagesToBuild.length} pages`);
  console.log(`\n✨ Pages ready for SEO with full component rendering\n`);
}

// Run the build
main().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
