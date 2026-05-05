import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(filePath));
        } else { 
            results.push(filePath);
        }
    }
    return results;
}

const files = walk('./src');

for (const file of files) {
    if (!file.match(/\.(astro|js|ts|css|md|mjs)$/)) continue;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace text content
    content = content.replace(/台灣荔枝/g, '青森蘋果');
    content = content.replace(/荔枝/g, '青森蘋果');
    content = content.replace(/玉荷包/g, '富士');
    content = content.replace(/妃子笑/g, '蜜蘋果');
    content = content.replace(/🫒/g, '🍎');

    // Convert Dark Mode into Harvest Orange Theme
    content = content.replace(/dark:bg-gray-900/g, 'dark:bg-harvestAccent.dark'); 
    content = content.replace(/dark:bg-gray-800/g, 'dark:bg-harvestAccent.dark'); 
    content = content.replace(/dark:bg-black/g, 'dark:bg-harvestAccent.dark'); 
    content = content.replace(/dark:text-white/g, 'dark:text-white');
    content = content.replace(/dark:text-gray-100/g, 'dark:text-white');
    content = content.replace(/dark:text-gray-200/g, 'dark:text-gray-100');
    content = content.replace(/dark:text-gray-300/g, 'dark:text-gray-200');
    content = content.replace(/dark:text-gray-400/g, 'dark:text-gray-300');
    content = content.replace(/dark:text-gray-500/g, 'dark:text-gray-400');
    content = content.replace(/dark:from-gray-800/g, 'dark:from-harvestAccent.dark'); 
    content = content.replace(/dark:via-gray-900/g, 'dark:via-harvestAccent.dark'); 
    content = content.replace(/dark:to-gray-800/g, 'dark:to-harvestAccent.dark'); 
    content = content.replace(/dark:to-gray-900/g, 'dark:to-harvestAccent.dark'); 
    content = content.replace(/dark:to-gray-700/g, 'dark:to-harvestAccent.dark'); 
    content = content.replace(/dark:from-gray-700/g, 'dark:from-harvestAccent.dark'); 
    content = content.replace(/dark:border-gray-[0-9]+/g, 'dark:border-harvestAccent.dark'); 
    
    // Replace SVG icons with Emojis in Header
    if (file.includes('Header.astro')) {
        content = content.replace(/<svg class="h-6 w-6 theme-toggle-dark-icon"[\s\S]*?<\/svg>/g, '<span class="text-2xl theme-toggle-dark-icon">☀️</span>');
        content = content.replace(/<svg class="h-6 w-6 hidden theme-toggle-light-icon"[\s\S]*?<\/svg>/g, '<span class="text-2xl hidden theme-toggle-light-icon">🍊</span>');
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
    }
}

// Rename files
const oldPath = './src/pages/products/台灣荔枝.astro';
const newPath = './src/pages/products/青森蘋果.astro';
if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
}

// Update content.ts for product list
const contentTsPath = './src/data/content.ts'; 
let contentTs = fs.readFileSync(contentTsPath, 'utf8');
contentTs = contentTs.replace(
    /{\s*name: '台灣荔枝',[\s\S]*?emoji: '🫒'\s*}/,
    `{
        name: '青森蘋果',
        description: '來自日本青森的頂級富士蘋果，清脆多汁，甜度與酸度的完美平衡。',
        emoji: '🍎',
        features: ['清脆多汁', '酸甜平衡', '產地直送']
    }`
);
fs.writeFileSync(contentTsPath, contentTs);
