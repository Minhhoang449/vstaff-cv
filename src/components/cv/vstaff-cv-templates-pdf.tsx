/**
 * Bộ mẫu CV Vstaff — 1 mẫu / ngành (layout + palette từ cv-template-themes).
 */
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { VstaffCvDocumentData } from "@/lib/cv/cv-document-data";
import { getCvBrandLogoSrc } from "@/lib/cv/cv-brand-logo";
import { CvPdfContactBlock } from "@/lib/cv/cv-pdf-contact";
import { getCvTemplateTheme, type CvTemplateTheme } from "@/lib/cv/cv-template-themes";
import { CV_PDF_FONT_FAMILY, registerCvPdfFonts } from "@/lib/cv/register-cv-fonts";

registerCvPdfFonts();

const FONT = [...CV_PDF_FONT_FAMILY];
const INK = "#18181b";
const MUTED = "#52525b";
const LINE = "#e4e4e7";
const PAGE_PAD_TOP = 42;
const PAGE_PAD_BOTTOM = 52;

/** Logo góc dưới phải — phải là con trực tiếp của Page + fixed. */
function BrandMark() {
  return (
    <Image
      src={getCvBrandLogoSrc()}
      fixed
      style={{
        position: "absolute",
        bottom: 16,
        right: 28,
        width: 36,
        height: 36,
      }}
    />
  );
}

function SectionTitle({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontFamily: FONT,
        fontWeight: 700,
        color,
        marginTop: 4,
        marginBottom: 6,
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: LINE,
      }}
    >
      {children}
    </Text>
  );
}

function ExperienceList({
  data,
  accent,
}: {
  data: VstaffCvDocumentData;
  accent: string;
}) {
  return (
    <View>
      {data.experiences.map((exp) => (
        <View key={`${exp.company}-${exp.period}`} style={{ marginBottom: 10 }} wrap={false}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: FONT, fontWeight: 700, fontSize: 10, color: INK }}>
              {exp.position}
            </Text>
            <Text style={{ fontFamily: FONT, fontSize: 9, color: MUTED }}>{exp.period}</Text>
          </View>
          <Text style={{ fontFamily: FONT, fontSize: 9.5, color: accent, marginBottom: 3 }}>
            {exp.company}
          </Text>
          {exp.bullets.map((b) => (
            <Text
              key={b.slice(0, 24)}
              style={{
                fontFamily: FONT,
                fontSize: 9.5,
                color: INK,
                lineHeight: 1.4,
                marginBottom: 2,
                paddingLeft: 8,
              }}
            >
              • {b}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function EducationList({ data }: { data: VstaffCvDocumentData }) {
  return (
    <View>
      {data.educationDetails.map((ed) => (
        <View key={`${ed.school}-${ed.period}`} style={{ marginBottom: 8 }} wrap={false}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: FONT, fontWeight: 700, fontSize: 10 }}>{ed.school}</Text>
            <Text style={{ fontFamily: FONT, fontSize: 9, color: MUTED }}>{ed.period}</Text>
          </View>
          <Text style={{ fontFamily: FONT, fontSize: 9.5, color: INK }}>{ed.degree}</Text>
          {ed.detail ? (
            <Text style={{ fontFamily: FONT, fontSize: 9, color: MUTED, marginTop: 2 }}>
              {ed.detail}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function SkillsChips({ skills, bg }: { skills: string[]; bg: string }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
      {skills.map((s) => (
        <Text
          key={s}
          style={{
            fontFamily: FONT,
            fontSize: 8.5,
            backgroundColor: bg,
            paddingVertical: 3,
            paddingHorizontal: 6,
            borderRadius: 3,
            marginBottom: 2,
          }}
        >
          {s}
        </Text>
      ))}
    </View>
  );
}

function MetaLine({ data, centered }: { data: VstaffCvDocumentData; centered?: boolean }) {
  return (
    <Text
      style={{
        fontSize: 8.5,
        color: MUTED,
        marginBottom: 6,
        textAlign: centered ? "center" : "left",
      }}
    >
      {data.industryName} · {data.workType} · {data.experienceLabel}
    </Text>
  );
}

function ClassicBody({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  return (
    <>
      <View style={{ borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 10, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT }}>{data.fullName}</Text>
        <Text style={{ fontSize: 12, color: accent, marginTop: 3 }}>{data.title}</Text>
        <CvPdfContactBlock data={data} style={{ marginTop: 6 }} />
        <MetaLine data={data} />
      </View>
      <SectionTitle color={accent}>Giới thiệu</SectionTitle>
      <Text style={{ fontFamily: FONT, lineHeight: 1.45 }}>{data.summary}</Text>
      <SectionTitle color={accent}>Mục tiêu nghề nghiệp</SectionTitle>
      <Text style={{ fontFamily: FONT, lineHeight: 1.45 }}>{data.careerObjective}</Text>
      <SectionTitle color={accent}>Kinh nghiệm làm việc</SectionTitle>
      <ExperienceList data={data} accent={accent} />
      <SectionTitle color={accent}>Học vấn</SectionTitle>
      <EducationList data={data} />
      <SectionTitle color={accent}>Kỹ năng</SectionTitle>
      <SkillsChips skills={data.skills} bg={theme.chipBg} />
      <SectionTitle color={accent}>Ngoại ngữ</SectionTitle>
      <Text style={{ fontFamily: FONT }}>{data.languages.join(" · ")}</Text>
    </>
  );
}

function ClassicLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
          paddingHorizontal: 40,
          fontFamily: FONT,
          fontSize: 10,
          color: INK,
        }}
      >
        <ClassicBody data={data} theme={theme} />
        <BrandMark />
      </Page>
    </Document>
  );
}

function SidebarLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  const sidebarBg = theme.sidebarBg || "#0f172a";
  const muted = theme.sidebarMuted || "#cbd5e1";
  const accentMuted = theme.accentMuted;
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          flexDirection: "row",
          fontFamily: FONT,
          fontSize: 10,
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
        }}
      >
        <View
          style={{
            width: "32%",
            backgroundColor: sidebarBg,
            color: "#e2e8f0",
            paddingTop: 8,
            paddingBottom: 16,
            paddingHorizontal: 16,
            marginTop: -PAGE_PAD_TOP,
            marginBottom: -PAGE_PAD_BOTTOM,
            minHeight: "100%",
          }}
        >
          <View style={{ paddingTop: PAGE_PAD_TOP - 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              {data.fullName}
            </Text>
            <Text style={{ fontSize: 10, color: accentMuted, marginBottom: 10 }}>{data.title}</Text>
            <CvPdfContactBlock
              data={data}
              tone="sidebar"
              fontSize={8}
              style={{ marginBottom: 12 }}
            />
            <Text style={{ fontSize: 10, fontWeight: 700, color: accentMuted, marginBottom: 6 }}>
              KỸ NĂNG
            </Text>
            {data.skills.map((s) => (
              <Text key={s} style={{ fontSize: 9, color: "#e2e8f0", marginBottom: 3 }}>
                • {s}
              </Text>
            ))}
            <Text
              style={{ fontSize: 10, fontWeight: 700, color: accentMuted, marginTop: 12, marginBottom: 6 }}
            >
              NGOẠI NGỮ
            </Text>
            {data.languages.map((l) => (
              <Text key={l} style={{ fontSize: 9, marginBottom: 3 }}>
                • {l}
              </Text>
            ))}
            <Text
              style={{ fontSize: 10, fontWeight: 700, color: accentMuted, marginTop: 12, marginBottom: 6 }}
            >
              THÔNG TIN
            </Text>
            <Text style={{ fontSize: 8.5, color: muted, marginBottom: 2 }}>{data.industryName}</Text>
            <Text style={{ fontSize: 8.5, color: muted, marginBottom: 2 }}>{data.workType}</Text>
            <Text style={{ fontSize: 8.5, color: muted }}>{data.experienceLabel}</Text>
          </View>
        </View>
        <View style={{ width: "68%", paddingHorizontal: 22 }}>
          <Text style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4 }}>GIỚI THIỆU</Text>
          <Text style={{ lineHeight: 1.45, marginBottom: 8 }}>{data.summary}</Text>
          <Text style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4 }}>MỤC TIÊU</Text>
          <Text style={{ lineHeight: 1.45, marginBottom: 8 }}>{data.careerObjective}</Text>
          <Text style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 6 }}>
            KINH NGHIỆM
          </Text>
          <ExperienceList data={data} accent={accent} />
          <Text style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 6, marginTop: 4 }}>
            HỌC VẤN
          </Text>
          <EducationList data={data} />
        </View>
        <BrandMark />
      </Page>
    </Document>
  );
}

function BannerLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          fontFamily: FONT,
          fontSize: 10,
          color: INK,
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
          paddingHorizontal: 40,
        }}
      >
        <View
          style={{
            backgroundColor: accent,
            paddingVertical: 22,
            paddingHorizontal: 40,
            marginTop: -PAGE_PAD_TOP,
            marginHorizontal: -40,
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{data.fullName}</Text>
          <Text style={{ fontSize: 12, color: theme.accentMuted, marginTop: 4 }}>{data.title}</Text>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.15)",
              marginTop: 10,
              paddingTop: 10,
            }}
          >
            <CvPdfContactBlock data={data} tone="onAccent" fontSize={9} />
          </View>
        </View>
        <MetaLine data={data} />
        <SectionTitle color={accent}>Tóm tắt chuyên môn</SectionTitle>
        <Text style={{ lineHeight: 1.45 }}>{data.summary}</Text>
        <SectionTitle color={accent}>Định hướng nghề nghiệp</SectionTitle>
        <Text style={{ lineHeight: 1.45 }}>{data.careerObjective}</Text>
        <SectionTitle color={accent}>Thành tích & kinh nghiệm</SectionTitle>
        <ExperienceList data={data} accent={accent} />
        <SectionTitle color={accent}>Học vấn & chứng chỉ</SectionTitle>
        <EducationList data={data} />
        <SectionTitle color={accent}>Năng lực cốt lõi</SectionTitle>
        <SkillsChips skills={data.skills} bg={theme.chipBg} />
        <SectionTitle color={accent}>Ngoại ngữ</SectionTitle>
        <Text>{data.languages.join(" · ")}</Text>
        <BrandMark />
      </Page>
    </Document>
  );
}

function RailLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          flexDirection: "row",
          fontFamily: FONT,
          fontSize: 10,
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
        }}
      >
        <View
          style={{
            width: 10,
            backgroundColor: accent,
            marginTop: -PAGE_PAD_TOP,
            marginBottom: -PAGE_PAD_BOTTOM,
          }}
        />
        <View style={{ flex: 1, paddingHorizontal: 28 }}>
          <Text style={{ fontSize: 22, fontWeight: 700 }}>{data.fullName}</Text>
          <Text style={{ fontSize: 12, color: accent, marginTop: 3 }}>{data.title}</Text>
          <CvPdfContactBlock data={data} style={{ marginTop: 6 }} />
          <SectionTitle color={accent}>Giới thiệu</SectionTitle>
          <Text style={{ lineHeight: 1.45 }}>{data.summary}</Text>
          <SectionTitle color={accent}>Hướng đi</SectionTitle>
          <Text style={{ lineHeight: 1.45 }}>{data.careerObjective}</Text>
          <SectionTitle color={accent}>Dự án / Kinh nghiệm</SectionTitle>
          <ExperienceList data={data} accent={accent} />
          <SectionTitle color={accent}>Đào tạo</SectionTitle>
          <EducationList data={data} />
          <SectionTitle color={accent}>Công cụ & kỹ năng</SectionTitle>
          <SkillsChips skills={data.skills} bg={theme.chipBg} />
          <SectionTitle color={accent}>Ngoại ngữ & sở thích</SectionTitle>
          <Text>{data.languages.join(" · ")}</Text>
        </View>
        <BrandMark />
      </Page>
    </Document>
  );
}

function TopbarLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          fontFamily: FONT,
          fontSize: 10,
          color: INK,
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
          paddingHorizontal: 40,
        }}
      >
        <View
          style={{
            height: 8,
            backgroundColor: accent,
            marginTop: -PAGE_PAD_TOP,
            marginHorizontal: -40,
            marginBottom: 16,
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 700 }}>{data.fullName}</Text>
            <Text style={{ fontSize: 11, color: accent, marginTop: 3 }}>{data.title}</Text>
          </View>
          <CvPdfContactBlock data={data} align="end" maxWidth={150} fontSize={8} />
        </View>
        <MetaLine data={data} />
        <SectionTitle color={accent}>Giới thiệu</SectionTitle>
        <Text style={{ lineHeight: 1.45 }}>{data.summary}</Text>
        <SectionTitle color={accent}>Kinh nghiệm</SectionTitle>
        <ExperienceList data={data} accent={accent} />
        <SectionTitle color={accent}>Học vấn</SectionTitle>
        <EducationList data={data} />
        <SectionTitle color={accent}>Kỹ năng</SectionTitle>
        <SkillsChips skills={data.skills} bg={theme.chipBg} />
        <BrandMark />
      </Page>
    </Document>
  );
}

function SplitLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          fontFamily: FONT,
          fontSize: 10,
          color: INK,
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
          paddingHorizontal: 36,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 700 }}>{data.fullName}</Text>
        <Text style={{ fontSize: 12, color: accent, marginTop: 3 }}>{data.title}</Text>
        <CvPdfContactBlock data={data} style={{ marginTop: 6, marginBottom: 10 }} />
        <View style={{ flexDirection: "row", gap: 16 }}>
          <View style={{ width: "62%" }}>
            <SectionTitle color={accent}>Giới thiệu</SectionTitle>
            <Text style={{ lineHeight: 1.45 }}>{data.summary}</Text>
            <SectionTitle color={accent}>Kinh nghiệm</SectionTitle>
            <ExperienceList data={data} accent={accent} />
            <SectionTitle color={accent}>Học vấn</SectionTitle>
            <EducationList data={data} />
          </View>
          <View style={{ width: "38%", paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: LINE }}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: accent, marginBottom: 6 }}>
              THÔNG TIN
            </Text>
            <Text style={{ fontSize: 8.5, color: MUTED, marginBottom: 2 }}>{data.industryName}</Text>
            <Text style={{ fontSize: 8.5, color: MUTED, marginBottom: 2 }}>{data.workType}</Text>
            <Text style={{ fontSize: 8.5, color: MUTED, marginBottom: 10 }}>{data.experienceLabel}</Text>
            <Text style={{ fontSize: 10, fontWeight: 700, color: accent, marginBottom: 6 }}>
              KỸ NĂNG
            </Text>
            <SkillsChips skills={data.skills} bg={theme.chipBg} />
            <Text style={{ fontSize: 10, fontWeight: 700, color: accent, marginTop: 10, marginBottom: 6 }}>
              NGOẠI NGỮ
            </Text>
            <Text style={{ fontSize: 9, lineHeight: 1.4 }}>{data.languages.join(" · ")}</Text>
          </View>
        </View>
        <BrandMark />
      </Page>
    </Document>
  );
}

function ExecutiveLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          fontFamily: FONT,
          fontSize: 10,
          color: INK,
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
          paddingHorizontal: 44,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: accent }}>
          <Text style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{data.fullName}</Text>
          <Text style={{ fontSize: 11, color: accent, marginTop: 4, textTransform: "uppercase" }}>
            {data.title}
          </Text>
          <CvPdfContactBlock data={data} align="center" style={{ marginTop: 8 }} />
        </View>
        <View style={{ alignItems: "center", marginBottom: 6 }}>
          <MetaLine data={data} centered />
        </View>
        <SectionTitle color={accent}>Tóm tắt</SectionTitle>
        <Text style={{ lineHeight: 1.45 }}>{data.summary}</Text>
        <SectionTitle color={accent}>Kinh nghiệm chuyên môn</SectionTitle>
        <ExperienceList data={data} accent={accent} />
        <SectionTitle color={accent}>Học vấn</SectionTitle>
        <EducationList data={data} />
        <SectionTitle color={accent}>Năng lực</SectionTitle>
        <SkillsChips skills={data.skills} bg={theme.chipBg} />
        <BrandMark />
      </Page>
    </Document>
  );
}

function MagazineLayout({ data, theme }: { data: VstaffCvDocumentData; theme: CvTemplateTheme }) {
  const accent = theme.accent;
  return (
    <Document title={`CV ${data.fullName}`} author="Vstaff.CV">
      <Page
        size="A4"
        style={{
          fontFamily: FONT,
          fontSize: 10,
          color: INK,
          paddingTop: PAGE_PAD_TOP,
          paddingBottom: PAGE_PAD_BOTTOM,
          paddingHorizontal: 40,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: accent, letterSpacing: 2, marginBottom: 4 }}>
              HỒ SƠ ỨNG VIÊN
            </Text>
            <Text style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>{data.fullName}</Text>
          </View>
          <View
            style={{
              width: 4,
              height: 48,
              backgroundColor: accent,
              marginRight: 10,
            }}
          />
          <View style={{ width: 140 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: accent }}>{data.title}</Text>
            <CvPdfContactBlock data={data} fontSize={8} style={{ marginTop: 4 }} />
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: accent, marginBottom: 12 }} />
        <SectionTitle color={accent}>Giới thiệu</SectionTitle>
        <Text style={{ lineHeight: 1.45 }}>{data.summary}</Text>
        <SectionTitle color={accent}>Kinh nghiệm & dự án</SectionTitle>
        <ExperienceList data={data} accent={accent} />
        <SectionTitle color={accent}>Đào tạo</SectionTitle>
        <EducationList data={data} />
        <SectionTitle color={accent}>Kỹ năng</SectionTitle>
        <SkillsChips skills={data.skills} bg={theme.chipBg} />
        <BrandMark />
      </Page>
    </Document>
  );
}

/** @deprecated giữ alias cho import cũ */
export function AtsCvPdf({ data }: { data: VstaffCvDocumentData }) {
  return <ClassicLayout data={data} theme={getCvTemplateTheme(data.templateId)} />;
}
export function TechCvPdf({ data }: { data: VstaffCvDocumentData }) {
  return <SidebarLayout data={data} theme={getCvTemplateTheme(data.templateId)} />;
}
export function BusinessCvPdf({ data }: { data: VstaffCvDocumentData }) {
  return <BannerLayout data={data} theme={getCvTemplateTheme(data.templateId)} />;
}
export function CreativeCvPdf({ data }: { data: VstaffCvDocumentData }) {
  return <RailLayout data={data} theme={getCvTemplateTheme(data.templateId)} />;
}

export function VstaffCvPdf({ data }: { data: VstaffCvDocumentData }) {
  const theme = getCvTemplateTheme(data.templateId || data.industryId);
  switch (theme.layout) {
    case "sidebar":
      return <SidebarLayout data={data} theme={theme} />;
    case "banner":
      return <BannerLayout data={data} theme={theme} />;
    case "rail":
      return <RailLayout data={data} theme={theme} />;
    case "topbar":
      return <TopbarLayout data={data} theme={theme} />;
    case "split":
      return <SplitLayout data={data} theme={theme} />;
    case "executive":
      return <ExecutiveLayout data={data} theme={theme} />;
    case "magazine":
      return <MagazineLayout data={data} theme={theme} />;
    default:
      return <ClassicLayout data={data} theme={theme} />;
  }
}
