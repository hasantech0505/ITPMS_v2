// Quick sanity check of the override-merge logic without a full TS build.
const STRATEGIC_KPIS_2026 = [{ id: "new_residents", annualTarget: 35, quarterlyTargets: { q1: 8, q2: 17, q3: 26, q4: 35 } }];
const overrides = [{ id: "new_residents", annualTarget: 42, quarterlyTargets: { q1: 8, q2: 18, q3: 28, q4: 42 } }];
const overrideById = new Map(overrides.map((o) => [o.id, o]));
const result = STRATEGIC_KPIS_2026.map((baseline) => {
  const override = overrideById.get(baseline.id);
  return override ? { ...baseline, annualTarget: override.annualTarget, quarterlyTargets: override.quarterlyTargets } : baseline;
});
console.log(JSON.stringify(result));
