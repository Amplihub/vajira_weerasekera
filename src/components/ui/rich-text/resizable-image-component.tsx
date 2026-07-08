"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useRef, useState } from "react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ResizableImageComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, selected } = props;
  const { src, alt, width, textAlign, layout } = node.attrs;
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);
  const [draftWidth, setDraftWidth] = useState<number | string | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);

    const startX = e.clientX;
    const startWidth = containerRef.current?.offsetWidth || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const diffX = currentX - startX;
      const newWidth = Math.max(100, startWidth + diffX);

      setDraftWidth(newWidth);
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setResizing(false);

      const currentX = upEvent.clientX;
      const diffX = currentX - startX;
      const newWidth = Math.max(100, startWidth + diffX);
      updateAttributes({ width: newWidth, height: null });
      setDraftWidth(null);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const align = textAlign || "left";
  const isRowLayout = layout === "row";

  const applyPresetWidth = (percentage: 25 | 50 | 75 | 100) => {
    const presetWidth = `${percentage}%`;
    setDraftWidth(presetWidth);
    updateAttributes({ width: presetWidth, height: null });
    setDraftWidth(null);
  };

  const currentWidth = draftWidth ?? width ?? "auto";
  const widthStyle =
    typeof currentWidth === "number" ? `${currentWidth}px` : currentWidth;

  return (
    <NodeViewWrapper
      as="span"
      className={cn("my-2", isRowLayout ? "mr-2 align-top" : "w-full")}
      style={
        isRowLayout
          ? { display: "inline-block", verticalAlign: "top" }
          : { display: "block", width: "100%", textAlign: align }
      }
    >
      <div className="relative inline-block max-w-full">
        <div
          ref={containerRef}
          className={cn(
            "relative inline-block leading-none transition-all",
            selected
              ? "ring-2 ring-gray-900 ring-offset-2 rounded-2xl"
              : ""
          )}
          style={{
            width: widthStyle,
            maxWidth: "100%",
            verticalAlign: "bottom",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="rounded-2xl max-w-full h-auto shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            style={{ width: "100%", display: "block" }}
          />

          {/* Toolbar - Show when selected */}
          {selected && (
            <div className="absolute -top-12 left-0 z-20 flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              {/* Alignment */}
              <button
                type="button"
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                  align === "left"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  updateAttributes({ textAlign: "left" });
                }}
                aria-label="Align left"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                  align === "center"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  updateAttributes({ textAlign: "center" });
                }}
                aria-label="Align center"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                  align === "right"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  updateAttributes({ textAlign: "right" });
                }}
                aria-label="Align right"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </button>

              <div className="mx-1 h-5 w-px bg-gray-200" />

              {/* Layout */}
              <button
                type="button"
                className={cn(
                  "h-8 rounded-full px-3 text-xs font-medium transition-all",
                  isRowLayout
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  updateAttributes({
                    layout: "row",
                    textAlign: "left",
                    width: width || "48%",
                  });
                }}
              >
                Row
              </button>
              <button
                type="button"
                className={cn(
                  "h-8 rounded-full px-3 text-xs font-medium transition-all",
                  !isRowLayout
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  updateAttributes({ layout: "block" });
                }}
              >
                Block
              </button>

              <div className="mx-1 h-5 w-px bg-gray-200" />

              {/* Preset widths */}
              {[25, 50, 75, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="h-8 rounded-full px-2.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-all"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applyPresetWidth(preset as 25 | 50 | 75 | 100);
                  }}
                >
                  {preset}%
                </button>
              ))}
            </div>
          )}

          {/* Resize Handle */}
          <div
            className="absolute bottom-1 right-1 z-10 h-5 w-5 cursor-nwse-resize rounded-full bg-gray-900 opacity-0 transition-opacity flex items-center justify-center"
            style={{ opacity: selected || resizing ? 1 : 0 }}
            onMouseDown={onMouseDown}
          >
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
