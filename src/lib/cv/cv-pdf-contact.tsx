import { Circle, Path, Rect, Svg, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { ReactNode } from "react";
import type { VstaffCvDocumentData } from "@/lib/cv/cv-document-data";
import { CV_PDF_FONT_FAMILY } from "@/lib/cv/register-cv-fonts";

const FONT = [...CV_PDF_FONT_FAMILY];
const ICON_SIZE = 10;
const ICON_BOX = 12;

export type CvPdfContactAlign = "start" | "center" | "end";
export type CvPdfContactTone = "default" | "onAccent" | "sidebar";

type CvPdfContactBlockProps = {
  data: VstaffCvDocumentData;
  align?: CvPdfContactAlign;
  tone?: CvPdfContactTone;
  fontSize?: number;
  style?: Style;
  /** Cột hẹp — topbar / magazine (pt) */
  maxWidth?: number;
};

function stroke(color: string) {
  return { stroke: color, strokeWidth: 1.75, fill: "none" as const };
}

function PdfIcon({ children }: { children: ReactNode }) {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
      {children}
    </Svg>
  );
}

function MapPinIcon({ color }: { color: string }) {
  const s = stroke(color);
  return (
    <PdfIcon>
      <Path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        {...s}
      />
      <Circle cx={12} cy={10} r={3} {...s} />
    </PdfIcon>
  );
}

function CakeIcon({ color }: { color: string }) {
  const s = stroke(color);
  return (
    <PdfIcon>
      <Path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" {...s} />
      <Path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" {...s} />
      <Path d="M2 21h20" {...s} />
      <Path d="M7 8v3M12 8v3M17 8v3" {...s} />
    </PdfIcon>
  );
}

function PhoneIcon({ color }: { color: string }) {
  const s = stroke(color);
  return (
    <PdfIcon>
      <Path
        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
        {...s}
      />
    </PdfIcon>
  );
}

function MailIcon({ color }: { color: string }) {
  const s = stroke(color);
  return (
    <PdfIcon>
      <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" {...s} />
      <Rect x={2} y={4} width={20} height={16} rx={2} {...s} />
    </PdfIcon>
  );
}

function ContactIconRow({
  icon,
  text,
  textColor,
  fontSize,
}: {
  icon: ReactNode;
  text: string;
  textColor: string;
  fontSize: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 3,
      }}
    >
      <View style={{ width: ICON_BOX, marginRight: 4, paddingTop: 1 }}>{icon}</View>
      <Text
        style={{
          flex: 1,
          fontFamily: FONT,
          fontSize,
          color: textColor,
          lineHeight: 1.35,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function ContactChip({
  icon,
  label,
  textColor,
  fontSize,
}: {
  icon: ReactNode;
  label: string;
  textColor: string;
  fontSize: number;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 12, marginBottom: 3 }}>
      <View style={{ marginRight: 4 }}>{icon}</View>
      <Text style={{ fontFamily: FONT, fontSize, color: textColor }}>{label}</Text>
    </View>
  );
}

/** Khối liên hệ PDF — icon + dòng giống preview web. */
export function CvPdfContactBlock({
  data,
  align = "start",
  tone = "default",
  fontSize = 9,
  style,
  maxWidth,
}: CvPdfContactBlockProps) {
  const onAccent = tone === "onAccent";
  const onSidebar = tone === "sidebar";
  const textColor = onAccent ? "#f8fafc" : onSidebar ? "#cbd5e1" : "#52525b";
  const iconColor = onAccent ? "rgba(255,255,255,0.9)" : onSidebar ? "#94a3b8" : "#a1a1aa";

  const rows = (
    <View style={{ width: "100%" }}>
      {data.locationLine ? (
        <ContactIconRow
          icon={<MapPinIcon color={iconColor} />}
          text={data.locationLine}
          textColor={textColor}
          fontSize={fontSize}
        />
      ) : null}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          width: "100%",
          marginTop: data.locationLine ? 2 : 0,
        }}
      >
        {data.dateOfBirth ? (
          <ContactChip
            icon={<CakeIcon color={iconColor} />}
            label={data.dateOfBirth}
            textColor={textColor}
            fontSize={fontSize}
          />
        ) : null}
        {data.phone ? (
          <ContactChip
            icon={<PhoneIcon color={iconColor} />}
            label={data.phone}
            textColor={textColor}
            fontSize={fontSize}
          />
        ) : null}
      </View>

      {data.email ? (
        <View style={{ flexDirection: "row", alignItems: "flex-start", width: "100%", marginTop: 2 }}>
          <View style={{ width: ICON_BOX, marginRight: 4, paddingTop: 1 }}>
            <MailIcon color={iconColor} />
          </View>
          <Text
            style={{
              flex: 1,
              fontFamily: FONT,
              fontSize,
              color: textColor,
              lineHeight: 1.35,
            }}
          >
            {data.email}
          </Text>
        </View>
      ) : null}
    </View>
  );

  if (align === "center") {
    return (
      <View style={[{ width: "100%", alignItems: "center" }, style]}>
        <View style={{ maxWidth: "100%" }}>{rows}</View>
      </View>
    );
  }

  if (align === "end") {
    return (
      <View
        style={[
          {
            width: maxWidth ?? 150,
            marginLeft: "auto",
          },
          style,
        ]}
      >
        {rows}
      </View>
    );
  }

  return <View style={[{ width: "100%" }, style]}>{rows}</View>;
}
