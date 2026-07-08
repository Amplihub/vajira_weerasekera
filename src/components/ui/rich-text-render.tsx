"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import {
  decodeCanvasScene,
  type CanvasScene,
} from "./rich-text/canvas-scene";

function CanvasSceneRenderer({ scene }: { scene: CanvasScene }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollHorizontally, setCanScrollHorizontally] = useState(false);
  const [isScrolledFromStart, setIsScrolledFromStart] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(true);

  const updateScrollIndicators = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const hasOverflow = maxScrollLeft > 2;
    setCanScrollHorizontally(hasOverflow);
    setIsScrolledFromStart(el.scrollLeft > 2);
    setIsScrolledToEnd(!hasOverflow || el.scrollLeft >= maxScrollLeft - 2);
  };

  useEffect(() => {
    updateScrollIndicators();
    const el = scrollContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => updateScrollIndicators());
    observer.observe(el);
    window.addEventListener("resize", updateScrollIndicators);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [scene.width, scene.height, scene.elements.length]);

  return (
    <div className="not-prose my-4 relative w-full">
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-hidden"
        onScroll={updateScrollIndicators}
      >
      <div
        className="relative bg-white"
        style={{
          width: scene.width,
          height: scene.height,
          background: scene.background,
        }}
      >
        {[...scene.elements]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => {
            if (el.type !== "image") {
              return null;
            }

            return (
              <div
                key={el.id}
                className="absolute"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                  zIndex: el.zIndex,
                  opacity: el.opacity ?? 1,
                  transform: `rotate(${el.rotation ?? 0}deg)`,
                  transformOrigin: "center center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={el.src}
                  alt="Canvas element"
                  className="h-full w-full object-cover"
                  style={{ borderRadius: el.radius ?? 0 }}
                />
              </div>
            );
          })}
      </div>
      </div>

      {canScrollHorizontally && isScrolledFromStart && (
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-white/45 to-transparent">
          <div className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white/95">
            <ChevronLeft className="h-3 w-3" />
          </div>
        </div>
      )}

      {canScrollHorizontally && !isScrolledToEnd && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-white/45 to-transparent">
          <div className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white/95">
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeDimension(
  value: string | number | undefined
): string | number | undefined {
  if (value === undefined || value === null) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  if (/^\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw;
}

function parseStyleValue(
  style: string | undefined,
  key: string
): string | undefined {
  if (!style) return undefined;
  const entries = style
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  for (const entry of entries) {
    const [prop, ...rest] = entry.split(":");
    if (!prop || rest.length === 0) continue;
    if (prop.trim().toLowerCase() === key.toLowerCase()) {
      return rest.join(":").trim();
    }
  }
  return undefined;
}

// Configure rehype-sanitize to allow specific classes and attributes for our alerts and layout
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [
      ...(defaultSchema.attributes?.div || []),
      // Whitelist Tailwind classes used in our alerts and content
      [
        "className",
        "bg-blue-50",
        "bg-emerald-50",
        "bg-amber-50",
        "bg-red-50",
        "my-4",
        "p-4",
        "rounded-r-lg",
        "border-l-4",
        "border-blue-500",
        "border-emerald-500",
        "border-amber-500",
        "border-red-500",
        "text-blue-900",
        "text-emerald-900",
        "text-amber-900",
        "text-red-900",
        "dark:bg-blue-950/30",
        "dark:border-blue-500",
        "dark:text-blue-200",
        "dark:bg-emerald-950/30",
        "dark:border-emerald-500",
        "dark:text-emerald-200",
        "dark:bg-amber-950/30",
        "dark:border-amber-500",
        "dark:text-amber-200",
        "dark:bg-red-950/30",
        "dark:border-red-500",
        "dark:text-red-200",
      ],
      "data-alert-type",
      "data-canvas-scene",
      "dataCanvasScene",
      "class",
    ],
    "*": ["className", "class"],
    iframe: ["src", "width", "height", "allowfullscreen", "allow"],
    img: [
      "src",
      "alt",
      "title",
      "width",
      "height",
      "style",
      "data-width",
      "data-height",
      "data-align",
      "data-layout",
      "dataWidth",
      "dataHeight",
      "dataAlign",
      "dataLayout",
    ],
  },
  tagNames: [...(defaultSchema.tagNames || []), "iframe", "div", "mark"],
};

interface RichTextProps {
  content: string;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null;

  return (
    <article
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none",
        "prose-headings:font-black prose-headings:tracking-tight",
        "prose-h1:text-4xl prose-h1:lg:text-5xl prose-h1:mb-8",
        "prose-h2:text-3xl prose-h2:mb-6 prose-h2:border-b prose-h2:border-foreground/10 prose-h2:pb-2",
        "prose-h3:text-2xl prose-h3:mb-4",
        "prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-6",
        "prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
        "prose-strong:font-bold prose-strong:text-foreground",
        "prose-code:text-foreground prose-code:bg-foreground/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-sm",
        "prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4",
        "prose-blockquote:not-italic",
        "prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-primary",
        "prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:font-bold prose-li:marker:text-foreground",
        "prose-img:rounded-lg prose-img:border prose-img:border-border prose-img:shadow-sm",
        "prose-hr:border-foreground/10 prose-hr:my-12",
        "prose-span:text-foreground",
        "prose-mark:bg-yellow-200 prose-mark:dark:bg-yellow-800 prose-mark:rounded-sm prose-mark:px-1 prose-mark:text-foreground",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          div: ({ children, ...props }) => {
            const nodeProps = props as Record<string, unknown>;
            // rehype-react converts data-canvas-scene to dataCanvasScene
            const payload =
              (nodeProps["dataCanvasScene"] ??
                nodeProps["data-canvas-scene"]) as string | undefined;
            if (payload) {
              const canvasScene = decodeCanvasScene(payload);
              if (canvasScene) {
                return <CanvasSceneRenderer scene={canvasScene} />;
              }
            }

            return <div {...props}>{children}</div>;
          },
          img: ({ ...props }) => {
            const nodeProps = props as Record<string, unknown>;
            const inlineStyle = (nodeProps.style as string | undefined) || "";

            // Parse layout from data attributes or style
            const rawLayout =
              (nodeProps["data-layout"] as string | undefined) ||
              (nodeProps["dataLayout"] as string | undefined) ||
              parseStyleValue(inlineStyle, "display");
            const layout =
              rawLayout === "row" || rawLayout === "inline-block"
                ? "row"
                : "block";

            // Parse alignment
            const rawAlign =
              (nodeProps["data-align"] as string | undefined) ||
              (nodeProps["dataAlign"] as string | undefined);
            const marginLeft = parseStyleValue(inlineStyle, "margin-left");
            const marginRight = parseStyleValue(inlineStyle, "margin-right");
            const inferredAlign =
              marginLeft === "auto" && marginRight === "auto"
                ? "center"
                : marginLeft === "auto" &&
                    (marginRight === "0" || marginRight === "0px")
                  ? "right"
                  : "left";
            const align = rawAlign || inferredAlign;

            const width = normalizeDimension(
              (nodeProps["data-width"] as string | number | undefined) ??
                (nodeProps["dataWidth"] as string | number | undefined) ??
                parseStyleValue(inlineStyle, "width") ??
                (nodeProps.width as string | number | undefined)
            );
            const height = normalizeDimension(
              (nodeProps["data-height"] as string | number | undefined) ??
                (nodeProps["dataHeight"] as string | number | undefined) ??
                parseStyleValue(inlineStyle, "height") ??
                (nodeProps.height as string | number | undefined)
            );
            const widthStyle =
              typeof width === "number" ? `${width}px` : width ?? "auto";

            const image = (
              <span className="relative inline-block max-w-full">
                <span
                  className="relative inline-block leading-none"
                  style={{
                    width: widthStyle,
                    maxWidth: "100%",
                    verticalAlign: "bottom",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={nodeProps.src as string}
                    alt={(nodeProps.alt as string) || ""}
                    className="rounded-2xl max-w-full h-auto shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    style={{
                      width: "100%",
                      height: height ?? "auto",
                      display: "block",
                    }}
                  />
                </span>
              </span>
            );

            if (layout === "row") {
              return (
                <span
                  className="not-prose my-2 mr-2 inline-block align-top"
                  style={{ display: "inline-block", verticalAlign: "top" }}
                >
                  {image}
                </span>
              );
            }

            return (
              <span
                className="not-prose my-2 block w-full"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign:
                    align === "center" || align === "right" ? align : "left",
                }}
              >
                {image}
              </span>
            );
          },
          blockquote: ({ children, ...props }) => {
            // Logic to detect GitHub Alerts in Markdown text
            const childrenArray = React.Children.toArray(children);
            const firstChild = childrenArray[0] as any;

            if (firstChild && firstChild.props && firstChild.props.children) {
              const pChildren = React.Children.toArray(
                firstChild.props.children,
              );

              // Scan for the alert pattern in the first few text nodes
              let textToScan = "";
              let stopIndex = 0;

              // Harvest text from the start until we hit a non-string or get enough length
              for (let i = 0; i < pChildren.length; i++) {
                const child = pChildren[i];
                if (typeof child === "string") {
                  textToScan += child;
                  stopIndex = i;
                  // Optimization: if we have enough text to see [!NOTE], stop?
                  // Alerts are short, but let's just grab the first continuous text block.
                } else {
                  break;
                }
              }

              // Match with optional leading whitespace and optional backslashes for escaped brackets (both opening and closing)
              // Matches: > [!NOTE], > \[!NOTE\], >   [!NOTE], > \[!NOTE]
              const match = textToScan.match(
                /^[\s\\]*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\\?\]/i,
              );

              if (match) {
                const type = match[1]?.toUpperCase();
                const fullMatch = match[0];

                // We need to remove 'fullMatch' from the beginning of pChildren text flow.
                // We iterate again and slice off the characters.
                let charsToRemove = fullMatch.length;
                const newPChildren = [...pChildren];

                for (let i = 0; i <= stopIndex; i++) {
                  const childText = newPChildren[i] as string;
                  if (charsToRemove > 0) {
                    if (childText.length >= charsToRemove) {
                      newPChildren[i] = childText.slice(charsToRemove);
                      charsToRemove = 0;
                    } else {
                      newPChildren[i] = ""; // Removed entire node content
                      charsToRemove -= childText.length;
                    }
                  }
                }

                // Clean up empty strings at the start if any remained (optional but cleaner)
                // Then reconstruction logic...

                const newFirstChild = React.cloneElement(firstChild, {
                  ...firstChild.props,
                  children: newPChildren,
                });

                // Render the Alert
                let variant: "default" | "destructive" = "default";
                let Icon = Info;
                let title = "Note";
                let colorClass =
                  "text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900";

                switch (type) {
                  case "NOTE":
                    Icon = Info;
                    title = "Note";
                    colorClass =
                      "text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900";
                    break;
                  case "TIP":
                    Icon = CheckCircle2;
                    title = "Tip";
                    colorClass =
                      "text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900";
                    break;
                  case "IMPORTANT":
                    Icon = AlertCircle;
                    title = "Important";
                    colorClass =
                      "text-purple-500 border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900";
                    break;
                  case "WARNING":
                    Icon = AlertTriangle;
                    title = "Warning";
                    colorClass =
                      "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900";
                    break;
                  case "CAUTION":
                    Icon = AlertTriangle;
                    title = "Caution";
                    variant = "destructive";
                    colorClass =
                      "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900";
                    break;
                }

                return (
                  <Alert
                    className={cn("my-6 not-prose border-l-4", colorClass)}
                  >
                    <Icon className="h-4 w-4" />
                    <AlertTitle>{title}</AlertTitle>
                    <AlertDescription className="mt-2 text-foreground/90">
                      {newFirstChild}
                      {childrenArray.slice(1)}
                    </AlertDescription>
                  </Alert>
                );
              }
            }

            // Fallback to standard blockquote
            return (
              <blockquote
                className={cn(
                  "border-l-4 border-primary bg-foreground/5 py-2 px-6 rounded-r-lg italic",
                  className,
                )}
                {...props}
              >
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
