import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { parseHtToTtcSlug } from "@/site/ht-to-ttc/ht-to-ttc-amounts";
import {
  getHtToTtcOgVisualData,
  HT_TO_TTC_SERIES_COVER,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from "@/site/ht-to-ttc/ht-to-ttc-og";

export const runtime = "nodejs";

/** On-demand : pas de pré-génération des 1000 images au build. */
export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

function coverFilePath(src: string): string {
  const relative = src
    .split("/")
    .filter(Boolean)
    .map((part) => decodeURIComponent(part))
    .join("/");
  return join(process.cwd(), "public", relative);
}

async function loadCoverDataUrl(): Promise<string> {
  const webp = await readFile(coverFilePath(HT_TO_TTC_SERIES_COVER.src));
  // ImageResponse / Satori attend PNG ou JPEG ; conversion unique depuis la source WebP.
  const png = await sharp(webp).resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, { fit: "cover" }).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const amountHt = parseHtToTtcSlug(slug);
  if (amountHt === null) {
    return new Response("Not Found", { status: 404 });
  }

  const visual = getHtToTtcOgVisualData(amountHt);
  const background = await loadCoverDataUrl();

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* ImageResponse / Satori : next/image n'est pas supporté ici */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={background}
          alt=""
          width={OG_IMAGE_WIDTH}
          height={OG_IMAGE_HEIGHT}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(8, 12, 18, 0.58)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxWidth: 980,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              {`${visual.amountShort} HT`}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              {`= ${visual.ttcShort} TTC`}
            </div>
          </div>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              padding: "10px 18px",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.16)",
              border: "1px solid rgba(255, 255, 255, 0.28)",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {visual.vatBadge}
          </div>
          <div
            style={{
              position: "absolute",
              left: 72,
              bottom: 36,
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              opacity: 0.95,
            }}
          >
            {visual.siteLabel}
          </div>
          <div
            style={{
              position: "absolute",
              right: 72,
              bottom: 36,
              display: "flex",
              fontSize: 18,
              fontWeight: 400,
              opacity: 0.78,
            }}
          >
            {visual.credit}
          </div>
        </div>
      </div>
    ),
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    },
  );

  return image;
}
