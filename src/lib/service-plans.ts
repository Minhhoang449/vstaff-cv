import "server-only";

import { EMPLOYER_PLANS, type EmployerPlan } from "@/data/employer-plans";
import { getPrisma, isDatabaseReady } from "@/lib/db";

function toPlan(row: {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  durationLabel: string;
  cvLimit: number | null;
  cvLimitLabel: string;
  cvPerDay: number | null;
  highlight: boolean;
  features: string[];
}): EmployerPlan {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    durationDays: row.durationDays,
    durationLabel: row.durationLabel,
    cvLimit: row.cvLimit,
    cvLimitLabel: row.cvLimitLabel,
    ...(row.cvPerDay != null ? { cvPerDay: row.cvPerDay } : {}),
    ...(row.highlight ? { highlight: true } : {}),
    features: row.features,
  };
}

async function ensureDefaultPlans() {
  if (!(await isDatabaseReady())) return;
  const prisma = getPrisma();
  if (!prisma) return;
  const count = await prisma.servicePlan.count();
  if (count > 0) return;
  await prisma.servicePlan.createMany({
    data: EMPLOYER_PLANS.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      durationDays: plan.durationDays,
      durationLabel: plan.durationLabel,
      cvLimit: plan.cvLimit,
      cvLimitLabel: plan.cvLimitLabel,
      cvPerDay: plan.cvPerDay ?? null,
      highlight: Boolean(plan.highlight),
      features: plan.features,
    })),
  });
}

export async function listServicePlans(): Promise<EmployerPlan[]> {
  try {
    if (!(await isDatabaseReady())) return EMPLOYER_PLANS;
    const prisma = getPrisma();
    if (!prisma) return EMPLOYER_PLANS;

    await ensureDefaultPlans();
    const rows = await prisma.servicePlan.findMany();
    const byId = new Map(rows.map((r) => [r.id, toPlan(r)] as const));
    const ordered: EmployerPlan[] = [];
    for (const p of EMPLOYER_PLANS) {
      ordered.push(byId.get(p.id) ?? p);
      byId.delete(p.id);
    }
    for (const p of byId.values()) ordered.push(p);
    return ordered;
  } catch (err) {
    console.warn("[service-plans] Postgres unavailable — using static plans", err);
    return EMPLOYER_PLANS;
  }
}

export async function getServicePlanById(id: string): Promise<EmployerPlan | null> {
  try {
    const plans = await listServicePlans();
    return plans.find((p) => p.id === id) ?? null;
  } catch {
    return EMPLOYER_PLANS.find((p) => p.id === id) ?? null;
  }
}

export async function saveServicePlans(plans: EmployerPlan[]): Promise<EmployerPlan[]> {
  if (!plans.length) throw new Error("Danh sách gói trống");
  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  const cleaned = plans.map((p) => ({
    id: p.id,
    name: p.name.trim(),
    price: Math.max(0, Number(p.price) || 0),
    durationDays: Math.max(0, Number(p.durationDays) || 0),
    durationLabel: p.durationLabel.trim(),
    cvLimit: p.cvLimit == null ? null : Math.max(0, Number(p.cvLimit) || 0),
    cvLimitLabel: p.cvLimitLabel.trim(),
    cvPerDay: p.cvPerDay == null ? null : Math.max(0, Number(p.cvPerDay) || 0),
    highlight: Boolean(p.highlight),
    features: (p.features || []).map((f) => f.trim()).filter(Boolean),
  }));

  let sawHighlight = false;
  for (const p of cleaned) {
    if (p.highlight && !sawHighlight) {
      sawHighlight = true;
    } else if (p.highlight) {
      p.highlight = false;
    }
  }

  await prisma.$transaction(
    cleaned.map((p) =>
      prisma.servicePlan.upsert({
        where: { id: p.id },
        create: p,
        update: {
          name: p.name,
          price: p.price,
          durationDays: p.durationDays,
          durationLabel: p.durationLabel,
          cvLimit: p.cvLimit,
          cvLimitLabel: p.cvLimitLabel,
          cvPerDay: p.cvPerDay,
          highlight: p.highlight,
          features: p.features,
        },
      })
    )
  );

  return cleaned.map((p) => ({
    ...p,
    ...(p.cvPerDay != null ? { cvPerDay: p.cvPerDay } : {}),
    ...(p.highlight ? { highlight: true } : {}),
  }));
}
