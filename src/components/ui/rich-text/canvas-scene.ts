export type CanvasElementType = "text" | "image";

interface CanvasElementBase {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  rotation?: number;
  opacity?: number;
}

export interface CanvasTextElement extends CanvasElementBase {
  type: "text";
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
}

export interface CanvasImageElement extends CanvasElementBase {
  type: "image";
  src: string;
  radius?: number;
}

export type CanvasElement = CanvasTextElement | CanvasImageElement;

export interface CanvasScene {
  width: number;
  height: number;
  background: string;
  elements: CanvasElement[];
}

function encodeBase64Url(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(input)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  throw new Error("No base64 encoder available");
}

function decodeBase64Url(input: string): string {
  if (typeof Buffer !== "undefined") {
    const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(base64, "base64").toString("utf8");
  }

  if (typeof atob !== "undefined") {
    const padded = input + "===".slice((input.length + 3) % 4);
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(escape(atob(base64)));
  }

  throw new Error("No base64 decoder available");
}

export function createDefaultCanvasScene(): CanvasScene {
  return {
    width: 960,
    height: 300,
    background: "#ffffff",
    elements: [],
  };
}

export function encodeCanvasScene(scene: CanvasScene): string {
  return encodeBase64Url(JSON.stringify(scene));
}

function isValidCssColor(color: string): boolean {
  if (!color || typeof color !== "string") return false;
  const trimmed = color.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return true;
  if (/^(rgb|hsl)a?\([^)]+\)$/.test(trimmed)) return true;
  const namedColors = [
    "white",
    "black",
    "red",
    "green",
    "blue",
    "yellow",
    "transparent",
    "inherit",
  ];
  if (namedColors.includes(trimmed)) return true;
  return false;
}

function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return true;
  if (trimmed.startsWith("./") || trimmed.startsWith("../")) return true;
  if (trimmed.startsWith("blob:")) return true;
  if (trimmed.startsWith("http://")) return true;
  if (trimmed.startsWith("https://")) return true;
  if (trimmed.startsWith("data:image/")) return true;
  return false;
}

function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function sanitizeElement(el: unknown): CanvasElement | null {
  if (!el || typeof el !== "object") return null;
  const obj = el as Record<string, unknown>;

  if (obj.type !== "image") return null;

  const src = obj.src;
  if (typeof src !== "string" || !isValidImageUrl(src)) return null;

  return {
    id:
      typeof obj.id === "string"
        ? obj.id.slice(0, 50)
        : `el-${Math.random().toString(36).slice(2)}`,
    type: "image",
    x: clampNumber(obj.x, -10000, 10000, 0),
    y: clampNumber(obj.y, -10000, 10000, 0),
    w: clampNumber(obj.w, 1, 10000, 100),
    h: clampNumber(obj.h, 1, 10000, 100),
    zIndex: clampNumber(obj.zIndex, -1000, 1000, 0),
    rotation: clampNumber(obj.rotation, -360, 360, 0),
    opacity: clampNumber(obj.opacity, 0, 1, 1),
    src: src,
    radius: clampNumber(obj.radius, 0, 1000, 0),
  } as CanvasImageElement;
}

export function decodeCanvasScene(payload: string): CanvasScene | null {
  try {
    const decoded = decodeBase64Url(payload);
    const parsed = JSON.parse(decoded) as Record<string, unknown>;

    if (
      typeof parsed?.width !== "number" ||
      typeof parsed?.height !== "number" ||
      typeof parsed?.background !== "string" ||
      !Array.isArray(parsed?.elements)
    ) {
      return null;
    }

    const width = clampNumber(parsed.width, 100, 5000, 960);
    const height = clampNumber(parsed.height, 50, 5000, 300);
    const background = isValidCssColor(parsed.background)
      ? parsed.background
      : "#ffffff";

    const elements = (parsed.elements as unknown[])
      .slice(0, 100)
      .map(sanitizeElement)
      .filter((el): el is CanvasElement => el !== null);

    return { width, height, background, elements };
  } catch {
    return null;
  }
}

export function serializeCanvasScene(scene: CanvasScene): string {
  const payload = encodeCanvasScene(scene);
  return `<div data-canvas-scene="${payload}"></div>`;
}
