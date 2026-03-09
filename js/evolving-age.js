/**
 * ============================================
 * EVOLVING AGE™ — Proprietary Algorithm v1.1
 * Evolving Longevity · evolvinglongevity.com
 * ============================================
 * 
 * VERSION: 1.1 (refined with diminishing returns)
 * LAST UPDATED: March 6, 2026
 * 
 * METHODOLOGY:
 * - Each factor scored against age-adjusted population benchmarks
 * - Negative offsets have diminishing returns (prevents unrealistic scores)
 * - Minimum data threshold enforced per tier
 * - Confidence level reported based on data completeness
 * 
 * TIER REQUIREMENTS:
 *   Snapshot ($49):   5+ factors minimum (HRV, RHR, sleep hours, training, alcohol)
 *   Deep Dive ($149): 8+ factors (adds deep sleep, recovery, body comp, protein)
 *   Protocol ($79/mo): 10+ factors (adds VO2, bloodwork, monthly refinement)
 */

function calculateEvolvingAge(data, tier = 'deepdive') {
  const age = data.chronologicalAge;
  let rawOffset = 0;
  const factors = [];

  // ============================================
  // TIER MINIMUM DATA REQUIREMENTS
  // ============================================
  const tierMinimums = {
    snapshot: ['avgHRV', 'restingHR', 'avgSleepHours', 'trainingDaysPerWeek', 'alcoholFrequency'],
    deepdive: ['avgHRV', 'restingHR', 'avgSleepHours', 'trainingDaysPerWeek', 'alcoholFrequency', 'deepSleepMinutes', 'recoveryGreenPct'],
    protocol: ['avgHRV', 'restingHR', 'avgSleepHours', 'trainingDaysPerWeek', 'alcoholFrequency', 'deepSleepMinutes', 'recoveryGreenPct', 'vo2Max']
  };

  const required = tierMinimums[tier] || tierMinimums.deepdive;
  const missing = required.filter(f => data[f] === undefined && data[f] !== 0);
  
  if (missing.length > 0) {
    return {
      error: true,
      message: `Missing required data for ${tier} tier: ${missing.join(', ')}`,
      missing: missing
    };
  }

  // ============================================
  // 1. HEART RATE VARIABILITY (HRV)
  //    Max offset: ±2.5 years
  // ============================================
  if (data.avgHRV !== undefined) {
    const expectedHRV = getExpectedHRV(age);
    const hrvRatio = data.avgHRV / expectedHRV;
    
    let hrvOffset;
    if (hrvRatio >= 1.4) hrvOffset = -2.5;
    else if (hrvRatio >= 1.25) hrvOffset = -2.0;
    else if (hrvRatio >= 1.1) hrvOffset = -1.2;
    else if (hrvRatio >= 0.95) hrvOffset = 0;
    else if (hrvRatio >= 0.8) hrvOffset = 1.0;
    else if (hrvRatio >= 0.65) hrvOffset = 2.0;
    else hrvOffset = 3.0;

    rawOffset += hrvOffset;
    factors.push({
      name: 'Heart Rate Variability',
      value: `${data.avgHRV}ms`,
      benchmark: `${Math.round(expectedHRV)}ms expected for age ${age}`,
      offset: hrvOffset,
      category: 'cardiovascular',
      icon: '❤️',
      tip: hrvOffset > 0 ? 'Focus on stress management, sleep consistency, and reducing alcohol to improve HRV.' : 'Your HRV is strong — maintain your current recovery practices.'
    });
  }

  // ============================================
  // 2. RESTING HEART RATE
  //    Max offset: ±1.5 years
  // ============================================
  if (data.restingHR !== undefined) {
    let rhrOffset;
    if (data.restingHR <= 48) rhrOffset = -1.5;
    else if (data.restingHR <= 52) rhrOffset = -1.0;
    else if (data.restingHR <= 56) rhrOffset = -0.5;
    else if (data.restingHR <= 62) rhrOffset = 0;
    else if (data.restingHR <= 68) rhrOffset = 0.5;
    else if (data.restingHR <= 75) rhrOffset = 1.0;
    else rhrOffset = 1.5;

    rawOffset += rhrOffset;
    factors.push({
      name: 'Resting Heart Rate',
      value: `${data.restingHR} bpm`,
      benchmark: '50-58 bpm is excellent',
      offset: rhrOffset,
      category: 'cardiovascular',
      icon: '💓',
      tip: rhrOffset > 0 ? 'Consistent zone 2 cardio (walking, cycling) and improved sleep will lower RHR over time.' : 'Your resting heart rate reflects excellent cardiovascular efficiency.'
    });
  }

  // ============================================
  // 3. DEEP SLEEP
  //    Max offset: ±2.0 years
  // ============================================
  if (data.deepSleepMinutes !== undefined) {
    const expectedDeep = getExpectedDeepSleep(age);
    const deepRatio = data.deepSleepMinutes / expectedDeep;

    let deepOffset;
    if (deepRatio >= 1.3) deepOffset = -2.0;
    else if (deepRatio >= 1.15) deepOffset = -1.2;
    else if (deepRatio >= 1.0) deepOffset = -0.5;
    else if (deepRatio >= 0.85) deepOffset = 0;
    else if (deepRatio >= 0.7) deepOffset = 1.0;
    else deepOffset = 2.0;

    rawOffset += deepOffset;
    factors.push({
      name: 'Deep Sleep',
      value: `${data.deepSleepMinutes} min/night`,
      benchmark: `${Math.round(expectedDeep)} min expected for age ${age}`,
      offset: deepOffset,
      category: 'sleep',
      icon: '🌙',
      tip: deepOffset > 0 ? 'Cut caffeine by 2pm, finish dinner 3.5+ hours before bed, and keep your room at 65-68°F.' : 'Your deep sleep is exceptional — your recovery protocols are working.'
    });
  }

  // ============================================
  // 4. SLEEP DURATION
  //    Max offset: ±1.0 years
  // ============================================
  if (data.avgSleepHours !== undefined) {
    let sleepOffset;
    if (data.avgSleepHours >= 7.5 && data.avgSleepHours <= 8.5) sleepOffset = -1.0;
    else if (data.avgSleepHours >= 7.0 && data.avgSleepHours <= 9.0) sleepOffset = -0.3;
    else if (data.avgSleepHours >= 6.5) sleepOffset = 0.5;
    else if (data.avgSleepHours >= 6.0) sleepOffset = 0.8;
    else sleepOffset = 1.0;

    rawOffset += sleepOffset;
    factors.push({
      name: 'Sleep Duration',
      value: `${data.avgSleepHours} hrs/night`,
      benchmark: '7.5-8.5 hrs optimal',
      offset: sleepOffset,
      category: 'sleep',
      icon: '⏰',
      tip: sleepOffset > 0 ? 'Prioritize a consistent bedtime. Even 30 extra minutes of sleep compounds into significant recovery gains.' : 'Your sleep duration is in the optimal zone.'
    });
  }

  // ============================================
  // 5. RECOVERY DISTRIBUTION
  //    Max offset: ±1.5 years
  // ============================================
  if (data.recoveryGreenPct !== undefined) {
    let recOffset;
    if (data.recoveryGreenPct >= 75) recOffset = -1.5;
    else if (data.recoveryGreenPct >= 65) recOffset = -1.0;
    else if (data.recoveryGreenPct >= 55) recOffset = -0.3;
    else if (data.recoveryGreenPct >= 45) recOffset = 0;
    else if (data.recoveryGreenPct >= 35) recOffset = 0.8;
    else recOffset = 1.5;

    rawOffset += recOffset;
    factors.push({
      name: 'Recovery Distribution',
      value: `${data.recoveryGreenPct}% green days`,
      benchmark: '60%+ green is excellent',
      offset: recOffset,
      category: 'recovery',
      icon: '🔋',
      tip: recOffset > 0 ? 'Your body is struggling to recover. Look at alcohol timing, training load, and sleep consistency.' : 'Strong recovery indicates your body is adapting well to your training load.'
    });
  }

  // ============================================
  // 6. TRAINING FREQUENCY
  //    Max offset: ±1.8 years
  // ============================================
  if (data.trainingDaysPerWeek !== undefined) {
    let trainOffset;
    if (data.trainingDaysPerWeek >= 4 && data.trainingDaysPerWeek <= 5) trainOffset = -1.8;
    else if (data.trainingDaysPerWeek >= 3) trainOffset = -1.2;
    else if (data.trainingDaysPerWeek >= 2) trainOffset = -0.3;
    else if (data.trainingDaysPerWeek >= 1) trainOffset = 0.5;
    else trainOffset = 2.0;

    rawOffset += trainOffset;
    factors.push({
      name: 'Training Frequency',
      value: `${data.trainingDaysPerWeek}x/week`,
      benchmark: '3-5x/week optimal',
      offset: trainOffset,
      category: 'training',
      icon: '🏋️',
      tip: trainOffset > 0 ? 'Consistent resistance training 3-4x/week is the single highest-impact longevity intervention.' : 'Your training consistency is a major strength.'
    });
  }

  // ============================================
  // 7. VO2 MAX
  //    Max offset: ±2.0 years
  // ============================================
  if (data.vo2Max !== undefined) {
    const expectedVO2 = getExpectedVO2Max(age, data.sex || 'male');
    const vo2Ratio = data.vo2Max / expectedVO2;

    let vo2Offset;
    if (vo2Ratio >= 1.3) vo2Offset = -2.0;
    else if (vo2Ratio >= 1.15) vo2Offset = -1.2;
    else if (vo2Ratio >= 1.0) vo2Offset = -0.3;
    else if (vo2Ratio >= 0.85) vo2Offset = 0.5;
    else vo2Offset = 1.5;

    rawOffset += vo2Offset;
    factors.push({
      name: 'VO2 Max',
      value: `${data.vo2Max} ml/kg/min`,
      benchmark: `${Math.round(expectedVO2)} expected for age ${age}`,
      offset: vo2Offset,
      category: 'cardiovascular',
      icon: '🫁',
      tip: vo2Offset > 0 ? 'Add 2-3 sessions of zone 2 cardio per week. VO2 Max is the strongest predictor of all-cause mortality.' : 'Your VO2 Max puts you well ahead of your age group.'
    });
  }

  // ============================================
  // 8. ALCOHOL FREQUENCY
  //    Max offset: ±1.5 years
  // ============================================
  if (data.alcoholFrequency !== undefined) {
    const freqMap = {
      'never': -1.5,
      'rarely': -0.8,
      'monthly': -0.3,
      'weekly': 0.5,
      'frequent': 1.5
    };
    const alcOffset = freqMap[data.alcoholFrequency] || 0;
    
    rawOffset += alcOffset;
    factors.push({
      name: 'Alcohol Frequency',
      value: data.alcoholFrequency,
      benchmark: 'Less = better for HRV and recovery',
      offset: alcOffset,
      category: 'behavioral',
      icon: '🍷',
      tip: alcOffset > 0 ? 'Even moderate alcohol drops HRV 20-35% and cuts deep sleep by 30+ minutes. Reducing frequency is one of the highest-ROI changes.' : 'Your alcohol discipline is paying dividends in your recovery data.'
    });
  }

  // ============================================
  // 9. BODY COMPOSITION
  //    Max offset: ±1.2 years
  // ============================================
  if (data.waistToHeight !== undefined) {
    let wthOffset;
    if (data.waistToHeight <= 0.43) wthOffset = -1.2;
    else if (data.waistToHeight <= 0.46) wthOffset = -0.8;
    else if (data.waistToHeight <= 0.50) wthOffset = -0.3;
    else if (data.waistToHeight <= 0.53) wthOffset = 0;
    else if (data.waistToHeight <= 0.57) wthOffset = 0.5;
    else if (data.waistToHeight <= 0.63) wthOffset = 1.0;
    else wthOffset = 1.2;

    rawOffset += wthOffset;
    factors.push({
      name: 'Body Composition',
      value: `${data.waistToHeight.toFixed(2)} waist-to-height`,
      benchmark: '< 0.50 optimal',
      offset: wthOffset,
      category: 'body',
      icon: '📏',
      tip: wthOffset > 0 ? 'Focus on reducing visceral fat through consistent training and dietary improvements. This is a key metabolic health indicator.' : 'Your body composition is in a healthy range.'
    });
  }

  // ============================================
  // 10. PROTEIN INTAKE
  //     Max offset: ±0.8 years
  // ============================================
  if (data.proteinGramsPerLb !== undefined) {
    let protOffset;
    if (data.proteinGramsPerLb >= 0.9) protOffset = -0.8;
    else if (data.proteinGramsPerLb >= 0.7) protOffset = -0.3;
    else if (data.proteinGramsPerLb >= 0.5) protOffset = 0;
    else protOffset = 0.5;

    rawOffset += protOffset;
    factors.push({
      name: 'Protein Intake',
      value: `~${data.proteinGramsPerLb}g per lb bodyweight`,
      benchmark: '0.8-1.0g/lb optimal for muscle preservation',
      offset: protOffset,
      category: 'nutrition',
      icon: '🥩',
      tip: protOffset > 0 ? 'Increasing protein to 0.8-1g per pound of bodyweight supports muscle preservation, recovery, and body composition.' : 'Your protein intake supports optimal muscle preservation.'
    });
  }

  // ============================================
  // 11. BLOODWORK
  //     Max offset: ±1.5 years
  // ============================================
  if (data.bloodwork) {
    let bloodOffset = 0;
    const bw = data.bloodwork;
    const bloodDetails = [];
    
    if (bw.fastingGlucose) {
      if (bw.fastingGlucose <= 85) { bloodOffset -= 0.4; bloodDetails.push('Fasting glucose: optimal'); }
      else if (bw.fastingGlucose <= 99) { bloodDetails.push('Fasting glucose: normal'); }
      else { bloodOffset += 0.5; bloodDetails.push('Fasting glucose: elevated'); }
    }
    if (bw.triglycerides) {
      if (bw.triglycerides <= 80) { bloodOffset -= 0.4; bloodDetails.push('Triglycerides: optimal'); }
      else if (bw.triglycerides <= 150) { bloodDetails.push('Triglycerides: normal'); }
      else { bloodOffset += 0.4; bloodDetails.push('Triglycerides: elevated'); }
    }
    if (bw.hsCRP) {
      if (bw.hsCRP <= 0.5) { bloodOffset -= 0.4; bloodDetails.push('Inflammation (hsCRP): low'); }
      else if (bw.hsCRP <= 1.0) { bloodDetails.push('Inflammation: normal'); }
      else { bloodOffset += 0.5; bloodDetails.push('Inflammation: elevated'); }
    }
    if (bw.vitaminD) {
      if (bw.vitaminD >= 50 && bw.vitaminD <= 80) { bloodOffset -= 0.3; bloodDetails.push('Vitamin D: optimal'); }
      else if (bw.vitaminD >= 30) { bloodDetails.push('Vitamin D: adequate'); }
      else { bloodOffset += 0.4; bloodDetails.push('Vitamin D: deficient'); }
    }

    bloodOffset = Math.max(-1.5, Math.min(1.5, bloodOffset));
    
    rawOffset += bloodOffset;
    factors.push({
      name: 'Bloodwork Panel',
      value: bloodDetails.join(' · '),
      benchmark: 'Optimal ranges per marker',
      offset: bloodOffset,
      category: 'bloodwork',
      icon: '🩸',
      tip: bloodOffset > 0 ? 'Some blood markers are outside optimal ranges. Targeted supplementation and dietary changes can address these.' : 'Your blood panel is clean — continue quarterly monitoring.'
    });
  }

  // ============================================
  // DIMINISHING RETURNS + FINAL CALCULATION
  // ============================================
  
  // Apply diminishing returns on negative offsets (prevents unrealistically low ages)
  // After -8 years of benefit, each additional year of benefit is halved
  let finalOffset;
  if (rawOffset <= -8) {
    finalOffset = -8 + (rawOffset + 8) * 0.5;
  } else {
    finalOffset = rawOffset;
  }

  // Cap the total offset
  finalOffset = Math.max(-13, Math.min(15, finalOffset));

  const evolvingAge = Math.round((age + finalOffset) * 10) / 10;
  const gap = Math.round(finalOffset * 10) / 10;

  // Confidence level based on data completeness
  const maxFactors = 11;
  const confidence = Math.min(100, Math.round((factors.length / maxFactors) * 100));
  let confidenceLabel;
  if (confidence >= 90) confidenceLabel = 'High';
  else if (confidence >= 70) confidenceLabel = 'Good';
  else if (confidence >= 50) confidenceLabel = 'Moderate';
  else confidenceLabel = 'Limited';

  // Grade
  let grade, gradeLabel, gradeColor;
  if (gap <= -8) { grade = 'S'; gradeLabel = 'Exceptional'; gradeColor = '#D4A853'; }
  else if (gap <= -5) { grade = 'A+'; gradeLabel = 'Elite'; gradeColor = '#4ADE80'; }
  else if (gap <= -3) { grade = 'A'; gradeLabel = 'Excellent'; gradeColor = '#4ADE80'; }
  else if (gap <= -1) { grade = 'B+'; gradeLabel = 'Above Average'; gradeColor = '#60A5FA'; }
  else if (gap <= 1) { grade = 'B'; gradeLabel = 'Average'; gradeColor = '#60A5FA'; }
  else if (gap <= 3) { grade = 'C'; gradeLabel = 'Below Average'; gradeColor = '#FBBF24'; }
  else if (gap <= 5) { grade = 'D'; gradeLabel = 'Needs Work'; gradeColor = '#F97316'; }
  else { grade = 'F'; gradeLabel = 'Urgent Attention'; gradeColor = '#EF4444'; }

  // Sort factors by impact
  factors.sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset));

  const improvements = factors.filter(f => f.offset > 0).sort((a, b) => b.offset - a.offset).slice(0, 3);
  const strengths = factors.filter(f => f.offset < 0).sort((a, b) => a.offset - b.offset).slice(0, 3);

  return {
    chronologicalAge: age,
    evolvingAge: evolvingAge,
    gap: gap,
    rawOffset: Math.round(rawOffset * 10) / 10,
    grade: grade,
    gradeLabel: gradeLabel,
    gradeColor: gradeColor,
    confidence: confidence,
    confidenceLabel: confidenceLabel,
    factorsAnalyzed: factors.length,
    factors: factors,
    strengths: strengths,
    improvements: improvements,
    tier: tier,
    summary: `Your Evolving Age is ${evolvingAge} (chronological: ${age}). That's a ${Math.abs(gap)}-year ${gap < 0 ? 'advantage' : 'deficit'}. Grade: ${grade} (${gradeLabel}). Confidence: ${confidenceLabel} (${confidence}%).`
  };
}

// ============================================
// BENCHMARK FUNCTIONS
// ============================================
function getExpectedHRV(age) {
  if (age <= 25) return 65;
  return Math.max(20, 65 - (age - 25) * 0.9);
}

function getExpectedDeepSleep(age) {
  if (age <= 20) return 100;
  return Math.max(30, 110 - age * 1.2);
}

function getExpectedVO2Max(age, sex) {
  const maleBaseline = 48 - (age - 25) * 0.4;
  const femaleBaseline = 40 - (age - 25) * 0.35;
  return sex === 'female' ? Math.max(20, femaleBaseline) : Math.max(22, maleBaseline);
}

if (typeof module !== 'undefined') module.exports = { calculateEvolvingAge };
