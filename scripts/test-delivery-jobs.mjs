/**
 * Kiểm tra API lệnh lọc /danh-sach — chạy: npx tsx scripts/test-delivery-jobs.mjs
 */
const base = process.env.TEST_BASE || "http://localhost:3000";

async function login(email) {
  const csrfRes = await fetch(`${base}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const cookies = csrfRes.headers.getSetCookie?.() || [];
  let jar = cookies.map((c) => c.split(";")[0]).join("; ");
  const loginRes = await fetch(`${base}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: jar },
    body: new URLSearchParams({
      csrfToken,
      email,
      password: "demo123",
      callbackUrl: `${base}/dashboard/employer/danh-sach`,
      json: "true",
    }),
    redirect: "manual",
  });
  const loginCookies = loginRes.headers.getSetCookie?.() || [];
  jar = [...cookies, ...loginCookies].map((c) => c.split(";")[0]).join("; ");
  return jar;
}

function vnTime() {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

async function main() {
  console.log("VN time:", vnTime());
  const jar = await login("employer@demo.local");

  const page = await fetch(`${base}/dashboard/employer/danh-sach`, { headers: { Cookie: jar } });
  console.log("Page status:", page.status);

  const postMorning = await fetch(`${base}/api/employer/delivery-jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: jar },
    body: JSON.stringify({
      position: "Nhan vien ban hang test",
      provinceCode: "79",
      delivery: "morning",
      industryId: "sales",
    }),
  });
  const morningJob = await postMorning.json();
  console.log("\nCreate morning slot:", postMorning.status, {
    matchedCount: morningJob.job?.matchedCount,
    lastRunAt: morningJob.job?.lastRunAt,
    delivery: morningJob.job?.delivery,
    error: morningJob.error,
  });

  const cron = await fetch(`${base}/api/cron/run-delivery-jobs`, { method: "POST" });
  const cronBody = await cron.json();
  console.log("\nCron (dev, no secret):", cron.status, cronBody);

  const list = await fetch(`${base}/api/employer/delivery-jobs`, { headers: { Cookie: jar } });
  const listBody = await list.json();
  console.log("\nJobs:", listBody.jobs?.length);
  for (const j of listBody.jobs || []) {
    console.log(" -", j.position, "| slot:", j.delivery, "| matched:", j.matchedCount, "| lastRun:", j.lastRunAt);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
