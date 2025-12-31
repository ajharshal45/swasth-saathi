// the final one 

import symptomGroups from "@/data/symptomGroups.json";

/*
  runTriage
  =========
  ✔ Supports unlimited symptoms
  ✔ Groups symptoms logically
  ✔ Risk score based (safe + explainable)
  ✔ Multi-group output for pathway page
*/

export function runTriage({
  symptoms = [],
  ageGroup,
  duration,
  severity,
  medicineTaken
}) {
  /* =========================
     STEP 1: MAP → GROUPS
     ========================= */
  const detectedGroups = new Set();

  Object.entries(symptomGroups).forEach(([group, data]) => {
    if (symptoms.some(s => data.symptoms.includes(s))) {
      detectedGroups.add(group);
    }
  });

  const groups = Array.from(detectedGroups);

  /* =========================
     STEP 2: FORCE HIGH RISK
     ========================= */
  if (groups.includes("breathing") || groups.includes("neuro")) {
    return {
      level: "HIGH",
      groups,
      reason: {
        en: "Breathing or neurological symptoms need urgent medical attention.",
        hi: "सांस या तंत्रिका संबंधी लक्षणों पर तुरंत डॉक्टर से संपर्क करें।"
      }
    };
  }

  /* =========================
     STEP 3: RISK SCORE
     ========================= */
  let score = 0;

  groups.forEach(g => {
    score += symptomGroups[g]?.priority || 0;
  });

  if (severity === "severe") score += 3;
  if (severity === "moderate") score += 1;

  if (ageGroup === "above60" || ageGroup === "below18") score += 1;

  if (duration === "3-5") score += 1;
  if (duration === "more5") score += 2;

  if (medicineTaken !== "none" && severity !== "mild") score += 1;

  if (symptoms.length >= 5) score += 1;

  /* =========================
     STEP 4: FINAL LEVEL
     ========================= */
  let level = "LOW";
  if (score >= 7) level = "HIGH";
  else if (score >= 4) level = "MEDIUM";

  /* =========================
     STEP 5: REASON
     ========================= */
  const reasonMap = {
    LOW: {
      en: "Symptoms appear mild and manageable with home care.",
      hi: "लक्षण हल्के हैं और घरेलू देखभाल से संभाले जा सकते हैं।"
    },
    MEDIUM: {
      en: "Multiple symptoms detected. Monitoring is advised.",
      hi: "कई लक्षण पाए गए हैं। निगरानी आवश्यक है।"
    },
    HIGH: {
      en: "Symptoms indicate higher risk. Medical consultation advised.",
      hi: "लक्षण उच्च जोखिम दर्शाते हैं। डॉक्टर से सलाह लें।"
    }
  };

  return {
    level,
    groups,
    reason: reasonMap[level]
  };
}
