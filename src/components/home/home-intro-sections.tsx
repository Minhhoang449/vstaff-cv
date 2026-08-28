const BENEFITS = [
  {
    index: "01",
    title: "Kho CV tập trung",
    body: "Duyệt hồ sơ đã sẵn sàng kết nối — không phụ thuộc đăng tin và chờ ứng tuyển.",
  },
  {
    index: "02",
    title: "Lọc đúng nhu cầu",
    body: "Thu hẹp theo ngành, kỹ năng và địa bàn hành chính mới để tìm đúng người.",
  },
  {
    index: "03",
    title: "Kết nối nhanh",
    body: "Xem hồ sơ chi tiết và tiếp cận ứng viên phù hợp để headhunt hiệu quả.",
  },
] as const;

const STEPS = [
  {
    index: "01",
    title: "Đăng nhập NTD",
    body: "Mở tài khoản nhà tuyển dụng để truy cập kho hồ sơ.",
  },
  {
    index: "02",
    title: "Tìm & lọc CV",
    body: "Duyệt danh sách, lọc theo tiêu chí của vị trí cần tuyển.",
  },
  {
    index: "03",
    title: "Kết nối ứng viên",
    body: "Xem chi tiết hồ sơ và liên hệ ứng viên phù hợp nhất.",
  },
] as const;

export function HomeIntroSections() {
  return (
    <>
      <section
        className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)] py-20 sm:py-24"
        aria-labelledby="why-heading"
      >
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(12,68,82,0.08), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Lợi thế
          </p>
          <h2
            id="why-heading"
            className="mt-3 max-w-xl font-display text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl"
          >
            Vì sao nhà tuyển dụng chọn Vstaff
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            Kho hồ sơ chuẩn hoá — chủ động tìm và kết nối ứng viên phù hợp.
          </p>

          <ul className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-10">
            {BENEFITS.map((item) => (
              <li key={item.title} className="relative">
                <span className="font-display text-4xl font-medium tabular-nums text-[var(--primary)]/15">
                  {item.index}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-b border-[var(--border)] bg-[#0a3a46] py-20 text-zinc-100 sm:py-24"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#9be8c0]">
            Quy trình
          </p>
          <h2
            id="how-heading"
            className="mt-3 max-w-xl font-display text-3xl font-medium tracking-tight text-white sm:text-4xl"
          >
            Ba bước bắt đầu
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">
            Từ đăng nhập đến kết nối ứng viên — gọn, rõ, dành cho NTD.
          </p>

          <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                {i < STEPS.length - 1 ? (
                  <span
                    className="pointer-events-none absolute left-[calc(100%-0.5rem)] top-5 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-white/25 to-transparent sm:block"
                    aria-hidden
                  />
                ) : null}
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 font-display text-sm text-[#9be8c0]">
                  {step.index}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
