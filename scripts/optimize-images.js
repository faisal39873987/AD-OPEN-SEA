#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes images in the public directory for better performance
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

// Configuration
const config = {
  inputDir: path.join(__dirname, '../public'),
  outputDir: path.join(__dirname, '../public/optimized'),
  sizes: [480, 640, 768, 1024, 1280],
  quality: 80,
  extensions: ['.jpg', '.jpeg', '.png', '.webp']
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Get all images from input directory
const getImageFiles = () => {
  const patterns = config.extensions.map(ext => `${config.inputDir}/**/*${ext}`);
  return patterns.flatMap(pattern => glob.sync(pattern));
};

// Process an image
const processImage = async (imagePath) => {
  const filename = path.basename(imagePath);
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext);
  
  console.log(`Processing ${filename}...`);
  
  // Create WebP version for modern browsers
  await sharp(imagePath)
    .webp({ quality: config.quality })
    .toFile(path.join(config.outputDir, `${basename}.webp`));
  
  // Create optimized version in original format
  await sharp(imagePath)
    .toFormat(ext.substring(1))
    .toFile(path.join(config.outputDir, filename));
  
  // Create resized versions
  for (const size of config.sizes) {
    await sharp(imagePath)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: config.quality })
      .toFile(path.join(config.outputDir, `${basename}-${size}.webp`));
    
    await sharp(imagePath)
      .resize({ width: size, withoutEnlargement: true })
      .toFormat(ext.substring(1))
      .toFile(path.join(config.outputDir, `${basename}-${size}${ext}`));
  }
};

// Process all images
const main = async () => {
  try {
    const imageFiles = getImageFiles();
    console.log(`Found ${imageFiles.length} images to process.`);
    
    // Process images in batches to avoid memory issues
    const batchSize = 5;
    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(processImage));
      console.log(`Completed batch ${Math.ceil((i + batch.length) / batchSize)} of ${Math.ceil(imageFiles.length / batchSize)}`);
    }
    
    console.log('Image optimization completed successfully.');
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
};

main();
