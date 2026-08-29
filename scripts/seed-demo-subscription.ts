import { getPrisma, isDatabaseReady } from "../src/lib/db";

async function main() {
  if (!(await isDatabaseReady())) throw new Error("Database not ready");
  const prisma = getPrisma();
  if (!prisma) throw new Error("No prisma client");

  const user = await prisma.user.findUnique({ where: { email: "employer@demo.local" } });
  if (!user) throw new Error("employer@demo.local not found");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await prisma.employerSubscription.upsert({
    where: { employerId: user.id },
    create: {
      employerId: user.id,
      planId: "standard",
      planName: "Phổ biến",
      cvUsed: 0,
      cvLimit: null,
      activatedAt: new Date(),
      expiresAt,
      activationVerified: true,
    },
    update: {
      cvLimit: null,
      expiresAt,
      activationVerified: true,
    },
  });
  console.log("Demo employer subscription ready:", user.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
