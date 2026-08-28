import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { VstaffCvDocumentData } from "@/lib/cv/cv-document-data";
import { cvTemplateLabel } from "@/lib/cv/cv-document-data";
import { getCvTemplateTheme, type CvTemplateTheme } from "@/lib/cv/cv-template-themes";

type PreviewProps = {
  data: VstaffCvDocumentData;
  revealContact?: boolean;
};

function ContactLine({
  data,
  revealContact,
  className,
}: {
  data: VstaffCvDocumentData;
  revealContact?: boolean;
  className?: string;
}) {
  const parts = [
    data.locationLine,
    data.age ? `${data.age} tuổi` : "",
    revealContact ? data.phone : "",
    revealContact ? data.email : "",
  ].filter(Boolean);

  return (
    <div className={className}>
      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-90">
        {parts.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </p>
      {!revealContact ? (
        <p className="mt-1 text-[11px] opacity-80">
          SĐT & email đang ẩn — bấm “Mở hồ sơ” để xem (−1 CV).
        </p>
      ) : null}
    </div>
  );
}

function Experiences({ data, accent }: { data: VstaffCvDocumentData; accent: string }) {
  return (
    <div className="space-y-4">
      {data.experiences.map((exp) => (
        <div key={`${exp.company}-${exp.period}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-900">{exp.position}</p>
            <p className="text-xs text-zinc-500">{exp.period}</p>
          </div>
          <p className="text-sm" style={{ color: accent }}>
            {exp.company}
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-zinc-700">
            {exp.bullets.map((b) => (
              <li key={b.slice(0, 40)}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Education({ data }: { data: VstaffCvDocumentData }) {
  return (
    <div className="space-y-3">
      {data.educationDetails.map((ed) => (
        <div key={`${ed.school}-${ed.period}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-900">{ed.school}</p>
            <p className="text-xs text-zinc-500">{ed.period}</p>
          </div>
          <p className="text-sm text-zinc-700">{ed.degree}</p>
          {ed.detail ? <p className="mt-0.5 text-xs text-zinc-500">{ed.detail}</p> : null}
        </div>
      ))}
    </div>
  );
}

function Skills({ skills, chipBg }: { skills: string[]; chipBg: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((s) => (
        <span
          key={s}
          className="rounded px-2 py-0.5 text-xs font-medium text-zinc-800"
          style={{ backgroundColor: chipBg }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function SectionH({ children, color }: { children: ReactNode; color: string }) {
  return (
    <h3
      className="mt-5 border-b border-zinc-200 pb-1 text-xs font-bold tracking-wider uppercase"
      style={{ color }}
    >
      {children}
    </h3>
  );
}

function Meta({ data }: { data: VstaffCvDocumentData }) {
  return (
    <p className="text-xs text-zinc-500">
      {data.industryName} · {data.workType} · {data.experienceLabel}
    </p>
  );
}

function ClassicPreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  return (
    <div className="px-8 py-8 sm:px-10">
      <header className="border-b-2 pb-4" style={{ borderColor: a }}>
        <h2 className="text-2xl font-semibold text-zinc-900">{data.fullName}</h2>
        <p className="mt-1 text-base font-medium" style={{ color: a }}>
          {data.title}
        </p>
        <ContactLine data={data} revealContact={revealContact} className="mt-2 text-zinc-500" />
        <div className="mt-1">
          <Meta data={data} />
        </div>
      </header>
      <SectionH color={a}>Giới thiệu</SectionH>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
      <SectionH color={a}>Mục tiêu nghề nghiệp</SectionH>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.careerObjective}</p>
      <SectionH color={a}>Kinh nghiệm làm việc</SectionH>
      <div className="mt-2">
        <Experiences data={data} accent={a} />
      </div>
      <SectionH color={a}>Học vấn</SectionH>
      <div className="mt-2">
        <Education data={data} />
      </div>
      <SectionH color={a}>Kỹ năng</SectionH>
      <div className="mt-2">
        <Skills skills={data.skills} chipBg={theme.chipBg} />
      </div>
      <SectionH color={a}>Ngoại ngữ</SectionH>
      <p className="mt-2 text-sm text-zinc-700">{data.languages.join(" · ")}</p>
    </div>
  );
}

function SidebarPreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  const sideStyle = {
    backgroundColor: theme.sidebarBg || "#0f172a",
    ["--cv-muted" as string]: theme.sidebarMuted || "#cbd5e1",
    ["--cv-accent" as string]: theme.accentMuted,
  } as CSSProperties;

  return (
    <div className="flex min-h-[32rem] overflow-hidden">
      <aside className="w-[32%] shrink-0 px-4 py-8 text-zinc-200" style={sideStyle}>
        <h2 className="text-lg font-semibold text-white">{data.fullName}</h2>
        <p className="mt-1 text-sm" style={{ color: theme.accentMuted }}>
          {data.title}
        </p>
        <ContactLine
          data={data}
          revealContact={revealContact}
          className="mt-3 [&_p]:text-zinc-300"
        />
        <p
          className="mt-5 text-[11px] font-bold tracking-wide"
          style={{ color: theme.accentMuted }}
        >
          KỸ NĂNG
        </p>
        <ul className="mt-2 space-y-1 text-xs">
          {data.skills.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
        <p
          className="mt-5 text-[11px] font-bold tracking-wide"
          style={{ color: theme.accentMuted }}
        >
          NGOẠI NGỮ
        </p>
        <ul className="mt-2 space-y-1 text-xs">
          {data.languages.map((l) => (
            <li key={l}>• {l}</li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 px-6 py-8">
        <p className="text-xs font-bold tracking-wider" style={{ color: a }}>
          GIỚI THIỆU
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
        <p className="mt-5 text-xs font-bold tracking-wider" style={{ color: a }}>
          MỤC TIÊU
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.careerObjective}</p>
        <p className="mt-5 text-xs font-bold tracking-wider" style={{ color: a }}>
          KINH NGHIỆM
        </p>
        <div className="mt-2">
          <Experiences data={data} accent={a} />
        </div>
        <p className="mt-5 text-xs font-bold tracking-wider" style={{ color: a }}>
          HỌC VẤN
        </p>
        <div className="mt-2">
          <Education data={data} />
        </div>
      </div>
    </div>
  );
}

function BannerPreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  return (
    <div>
      <div className="px-8 py-6 text-white sm:px-10" style={{ backgroundColor: a }}>
        <h2 className="text-2xl font-semibold">{data.fullName}</h2>
        <p className="mt-1 text-sm" style={{ color: theme.accentMuted }}>
          {data.title}
        </p>
        <ContactLine data={data} revealContact={revealContact} className="mt-3" />
      </div>
      <div className="px-8 py-6 sm:px-10">
        <Meta data={data} />
        <SectionH color={a}>Tóm tắt chuyên môn</SectionH>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
        <SectionH color={a}>Định hướng nghề nghiệp</SectionH>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.careerObjective}</p>
        <SectionH color={a}>Thành tích & kinh nghiệm</SectionH>
        <div className="mt-2">
          <Experiences data={data} accent={a} />
        </div>
        <SectionH color={a}>Học vấn & chứng chỉ</SectionH>
        <div className="mt-2">
          <Education data={data} />
        </div>
        <SectionH color={a}>Năng lực cốt lõi</SectionH>
        <div className="mt-2">
          <Skills skills={data.skills} chipBg={theme.chipBg} />
        </div>
        <SectionH color={a}>Ngoại ngữ</SectionH>
        <p className="mt-2 text-sm text-zinc-700">{data.languages.join(" · ")}</p>
      </div>
    </div>
  );
}

function RailPreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  return (
    <div className="flex overflow-hidden">
      <div className="w-2.5 shrink-0" style={{ backgroundColor: a }} />
      <div className="flex-1 px-8 py-8 sm:px-10">
        <h2 className="text-2xl font-semibold text-zinc-900">{data.fullName}</h2>
        <p className="mt-1 text-base font-medium" style={{ color: a }}>
          {data.title}
        </p>
        <ContactLine data={data} revealContact={revealContact} className="mt-2 text-zinc-500" />
        <SectionH color={a}>Giới thiệu</SectionH>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
        <SectionH color={a}>Hướng đi</SectionH>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.careerObjective}</p>
        <SectionH color={a}>Dự án / Kinh nghiệm</SectionH>
        <div className="mt-2">
          <Experiences data={data} accent={a} />
        </div>
        <SectionH color={a}>Đào tạo</SectionH>
        <div className="mt-2">
          <Education data={data} />
        </div>
        <SectionH color={a}>Công cụ & kỹ năng</SectionH>
        <div className="mt-2">
          <Skills skills={data.skills} chipBg={theme.chipBg} />
        </div>
        <SectionH color={a}>Ngoại ngữ & sở thích</SectionH>
        <p className="mt-2 text-sm text-zinc-700">{data.languages.join(" · ")}</p>
      </div>
    </div>
  );
}

function TopbarPreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  return (
    <div>
      <div className="h-2" style={{ backgroundColor: a }} />
      <div className="px-8 py-8 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">{data.fullName}</h2>
            <p className="mt-1 text-base font-medium" style={{ color: a }}>
              {data.title}
            </p>
          </div>
          <ContactLine
            data={data}
            revealContact={revealContact}
            className="max-w-xs text-right text-zinc-500"
          />
        </div>
        <div className="mt-2">
          <Meta data={data} />
        </div>
        <SectionH color={a}>Giới thiệu</SectionH>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
        <SectionH color={a}>Kinh nghiệm</SectionH>
        <div className="mt-2">
          <Experiences data={data} accent={a} />
        </div>
        <SectionH color={a}>Học vấn</SectionH>
        <div className="mt-2">
          <Education data={data} />
        </div>
        <SectionH color={a}>Kỹ năng</SectionH>
        <div className="mt-2">
          <Skills skills={data.skills} chipBg={theme.chipBg} />
        </div>
      </div>
    </div>
  );
}

function SplitPreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  return (
    <div className="px-8 py-8 sm:px-10">
      <h2 className="text-2xl font-semibold text-zinc-900">{data.fullName}</h2>
      <p className="mt-1 text-base font-medium" style={{ color: a }}>
        {data.title}
      </p>
      <ContactLine data={data} revealContact={revealContact} className="mt-2 text-zinc-500" />
      <div className="mt-6 grid gap-8 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <SectionH color={a}>Giới thiệu</SectionH>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
          <SectionH color={a}>Kinh nghiệm</SectionH>
          <div className="mt-2">
            <Experiences data={data} accent={a} />
          </div>
          <SectionH color={a}>Học vấn</SectionH>
          <div className="mt-2">
            <Education data={data} />
          </div>
        </div>
        <div className="border-l border-zinc-200 pl-6">
          <p className="text-xs font-bold tracking-wider" style={{ color: a }}>
            THÔNG TIN
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {data.industryName}
            <br />
            {data.workType}
            <br />
            {data.experienceLabel}
          </p>
          <p className="mt-5 text-xs font-bold tracking-wider" style={{ color: a }}>
            KỸ NĂNG
          </p>
          <div className="mt-2">
            <Skills skills={data.skills} chipBg={theme.chipBg} />
          </div>
          <p className="mt-5 text-xs font-bold tracking-wider" style={{ color: a }}>
            NGOẠI NGỮ
          </p>
          <p className="mt-2 text-sm text-zinc-700">{data.languages.join(" · ")}</p>
        </div>
      </div>
    </div>
  );
}

function ExecutivePreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  return (
    <div className="px-8 py-8 sm:px-10">
      <header className="border-b-2 pb-5 text-center" style={{ borderColor: a }}>
        <h2 className="text-2xl font-semibold tracking-wide text-zinc-900">{data.fullName}</h2>
        <p className="mt-1 text-sm font-medium tracking-wide uppercase" style={{ color: a }}>
          {data.title}
        </p>
        <ContactLine
          data={data}
          revealContact={revealContact}
          className="mt-3 flex justify-center text-zinc-500"
        />
      </header>
      <div className="mt-3">
        <Meta data={data} />
      </div>
      <SectionH color={a}>Tóm tắt</SectionH>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
      <SectionH color={a}>Kinh nghiệm chuyên môn</SectionH>
      <div className="mt-2">
        <Experiences data={data} accent={a} />
      </div>
      <SectionH color={a}>Học vấn</SectionH>
      <div className="mt-2">
        <Education data={data} />
      </div>
      <SectionH color={a}>Năng lực</SectionH>
      <div className="mt-2">
        <Skills skills={data.skills} chipBg={theme.chipBg} />
      </div>
    </div>
  );
}

function MagazinePreview({
  data,
  theme,
  revealContact,
}: PreviewProps & { theme: CvTemplateTheme }) {
  const a = theme.accent;
  return (
    <div className="px-8 py-8 sm:px-10">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.2em]" style={{ color: a }}>
            HỒ SƠ ỨNG VIÊN
          </p>
          <h2 className="mt-1 text-3xl font-semibold leading-tight text-zinc-900">
            {data.fullName}
          </h2>
        </div>
        <div className="h-12 w-1 shrink-0" style={{ backgroundColor: a }} />
        <div className="max-w-[11rem]">
          <p className="text-sm font-semibold" style={{ color: a }}>
            {data.title}
          </p>
          <ContactLine data={data} revealContact={revealContact} className="mt-1 text-zinc-500" />
        </div>
      </div>
      <div className="mt-4 h-px" style={{ backgroundColor: a }} />
      <SectionH color={a}>Giới thiệu</SectionH>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
      <SectionH color={a}>Kinh nghiệm & dự án</SectionH>
      <div className="mt-2">
        <Experiences data={data} accent={a} />
      </div>
      <SectionH color={a}>Đào tạo</SectionH>
      <div className="mt-2">
        <Education data={data} />
      </div>
      <SectionH color={a}>Kỹ năng</SectionH>
      <div className="mt-2">
        <Skills skills={data.skills} chipBg={theme.chipBg} />
      </div>
    </div>
  );
}

function BrandFooter() {
  return (
    <div className="flex justify-end border-t border-zinc-100 px-4 py-2.5">
      <Image
        src="/brand/vstaff-mark.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 object-contain opacity-85"
        unoptimized
      />
    </div>
  );
}

export function VstaffCvPreview({ data, revealContact = false }: PreviewProps) {
  const theme = getCvTemplateTheme(data.templateId || data.industryId);
  const props = { data, theme, revealContact };

  let body: ReactNode;
  switch (theme.layout) {
    case "sidebar":
      body = <SidebarPreview {...props} />;
      break;
    case "banner":
      body = <BannerPreview {...props} />;
      break;
    case "rail":
      body = <RailPreview {...props} />;
      break;
    case "topbar":
      body = <TopbarPreview {...props} />;
      break;
    case "split":
      body = <SplitPreview {...props} />;
      break;
    case "executive":
      body = <ExecutivePreview {...props} />;
      break;
    case "magazine":
      body = <MagazinePreview {...props} />;
      break;
    default:
      body = <ClassicPreview {...props} />;
  }

  return (
    <article className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_30px_-12px_rgba(15,40,60,0.18)]">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-2 text-[11px] text-zinc-500">
        <span>
          Mẫu: <strong className="font-semibold text-zinc-700">{cvTemplateLabel(data.templateId)}</strong>
        </span>
        <span>{data.industryName}</span>
      </div>
      {body}
      <BrandFooter />
    </article>
  );
}
