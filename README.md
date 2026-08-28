# Vstaff.CV — Bước 1

Website việc làm (danh sách ứng viên) trên **Next.js App Router** + **shadcn/ui** + **Metadata API**.

## Yêu cầu ổ đĩa

- Project và `node_modules` nằm tại `D:\Web_Code\Vstaff.CV`
- npm cache: `D:\Web_Code\.npm-cache` (xem `.npmrc`) — tránh làm đầy ổ C

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000

### Tài khoản demo

| Email | Password | Role |
|-------|----------|------|
| employer@demo.local | demo123 | NTD |
| admin@demo.local | demo123 | Admin |

## Cấu trúc chính

- `/` — landing
- `/dashboard/employer/tim-ung-vien` — tìm UV (NTD)
- `/dashboard/employer/ung-vien/[slug]` — chi tiết hồ sơ (NTD)
- `/dang-nhap` — Auth.js credentials stub
- `/dashboard/employer` · `/dashboard/admin` — dashboard NTD / admin
- `prisma/schema.prisma` — Postgres schema (indexes + EmployerCandidateView)
- List/search: Prisma khi DB sẵn sàng; fallback in-memory nếu chưa có
- **Không cần Docker (khuyến nghị trên Windows):**
  ```powershell
  npm run db:local:setup
  npm run db:local:seed
  npm run db:bench
  # 100k (chậm hơn):
  npm run db:local:seed:100k
  ```
  Thêm `USE_PGLITE=1` vào `.env` để Next.js dùng DB nhúng `.data/pglite`.
- **Có Docker Desktop:**
  ```powershell
  docker compose up -d
  npm run db:push
  npm run db:seed:100k
  npm run db:bench
  ```
  (PowerShell không dùng `SEED_COUNT=100000 npm …` — dùng `npm run db:seed:100k` hoặc `$env:SEED_COUNT=100000; npm run db:seed`)
- Bench không DB: `npm run db:bench:scale`

## SEO

- `generateMetadata` / root metadata
- `/sitemap.xml`, `/robots.txt`
- JSON-LD trên trang chi tiết ứng viên

## Codebase Memory MCP

Đã gắn MCP cho Cursor:

- Binary: `D:\Web_Code\bin\codebase-memory-mcp.exe` (không chiếm ổ C bằng `node_modules`-style install)
- Project config: `.cursor/mcp.json`
- Global Cursor: `%USERPROFILE%\.cursor\mcp.json`
- Project extras: `.codebase-memory.json`

Sau khi sửa MCP config: **Restart Cursor** (hoặc Reload Window), rồi trong chat bảo agent **"Index this project"**.
