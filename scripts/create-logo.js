// قم بإنشاء شعار بسيط في ملف جديد
const fs = require('fs');
const { createCanvas } = require('canvas');

// إنشاء قماش بحجم 80x80 بكسل
const canvas = createCanvas(80, 80);
const ctx = canvas.getContext('2d');

// رسم خلفية سوداء للشعار الداكن
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 80, 80);

// رسم النص باللون الأبيض
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 30px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('AD', 40, 40);

// حفظ الصورة كملف PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/Users/faisal/abu_dhabi_open_sea/public/images/logo-dark.png', buffer);
fs.writeFileSync('/Users/faisal/abu_dhabi_open_sea/public/logos/logo-dark.png', buffer);

// إنشاء شعار فاتح
const lightCanvas = createCanvas(80, 80);
const lightCtx = lightCanvas.getContext('2d');

// رسم خلفية بيضاء
lightCtx.fillStyle = '#ffffff';
lightCtx.fillRect(0, 0, 80, 80);

// رسم النص باللون الأسود
lightCtx.fillStyle = '#000000';
lightCtx.font = 'bold 30px Arial';
lightCtx.textAlign = 'center';
lightCtx.textBaseline = 'middle';
lightCtx.fillText('AD', 40, 40);

// حفظ الصورة كملف PNG
const lightBuffer = lightCanvas.toBuffer('image/png');
fs.writeFileSync('/Users/faisal/abu_dhabi_open_sea/public/images/logo-light.png', lightBuffer);
fs.writeFileSync('/Users/faisal/abu_dhabi_open_sea/public/logos/logo-light.png', lightBuffer);

console.log('تم إنشاء ملفات الشعار بنجاح!');
