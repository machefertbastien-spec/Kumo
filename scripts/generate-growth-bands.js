/**
 * Generate Growth Percentile Bands
 * 
 * Reads LMS JSON files and pre-calculates P3, P15, P50, P85, P97 bands
 * for efficient chart rendering
 * 
 * Usage: npm run growth:bands
 */

const fs = require('fs');
const path = require('path');

const Z_SCORES = {
  p3: -1.8807936081512506,
  p15: -1.0364333894937896,
  p50: 0,
  p85: 1.0364333894937896,
  p97: 1.8807936081512506,
};

/**
 * Calculate measurement value from z-score using inverse LMS
 */
function xFromLMS(z, { L, M, S }) {
  if (M <= 0 || S <= 0) return NaN;
  
  if (Math.abs(L) < 0.001) {
    return M * Math.exp(S * z);
  }
  
  const inside = 1 + L * S * z;
  if (inside <= 0) return NaN;
  
  return M * Math.pow(inside, 1 / L);
}

/**
 * Generate bands from LMS data
 */
function generateBands(lmsByDay) {
  const bands = {
    p3: [],
    p15: [],
    p50: [],
    p85: [],
    p97: [],
  };

  Object.entries(lmsByDay).forEach(([dayStr, lms]) => {
    const day = parseInt(dayStr, 10);
    
    Object.entries(Z_SCORES).forEach(([percentile, zScore]) => {
      const value = xFromLMS(zScore, lms);
      if (!isNaN(value)) {
        bands[percentile].push({
          day,
          value: Number(value.toFixed(3)),
        });
      }
    });
  });

  return bands;
}

/**
 * Main execution
 */
function main() {
  const lmsDir = path.join(__dirname, '../src/features/growth/ref/lms');
  const outDir = path.join(__dirname, '../src/features/growth/ref/generated');

  // Create output directory
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Process all LMS files
  const files = fs.readdirSync(lmsDir).filter(f => f.endsWith('.lms.json'));

  console.log(`📊 Generating growth bands from ${files.length} LMS files...\n`);

  files.forEach(file => {
    const inPath = path.join(lmsDir, file);
    const lmsByDay = JSON.parse(fs.readFileSync(inPath, 'utf-8'));
    
    const bands = generateBands(lmsByDay);
    
    const outFile = file.replace('.lms.json', '.bands.json');
    const outPath = path.join(outDir, outFile);
    
    fs.writeFileSync(outPath, JSON.stringify(bands, null, 2), 'utf-8');
    
    console.log(`✓ ${file} → ${outFile}`);
    console.log(`  ${Object.values(bands.p50).length} data points generated`);
  });

  console.log('\n✅ All bands generated successfully!');
}

try {
  main();
} catch (error) {
  console.error('❌ Error generating bands:', error);
  process.exit(1);
}
