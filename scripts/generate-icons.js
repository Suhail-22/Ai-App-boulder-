// scripts/generate-icons.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const sourceIcon = 'icon-source.png'; // ضع أيقونة 1024x1024 هنا
  
  try {
    // إنشاء مجلد الأيقونات
    await fs.mkdir('icons', { recursive: true });
    
    for (const size of sizes) {
      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(`icons/icon-${size}x${size}.png`);
      
      console.log(`✅ Generated icon-${size}x${size}.png`);
    }
    
    // إنشاء favicon
    await sharp(sourceIcon)
      .resize(32, 32)
      .toFile('favicon.ico');
    
    console.log('✅ Generated favicon.ico');
    
    // إنشاء apple-touch-icon
    await sharp(sourceIcon)
      .resize(180, 180)
      .toFile('icons/apple-touch-icon.png');
    
    console.log('✅ Generated apple-touch-icon.png');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();