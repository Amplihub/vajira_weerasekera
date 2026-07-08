"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { ImageDialog } from "./image-dialog";
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  Circle,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Slider } from "../slider";
import {
  CanvasElement,
  CanvasImageElement,
  CanvasScene,
  createDefaultCanvasScene,
  decodeCanvasScene,
  encodeCanvasScene,
} from "./canvas-scene";

type InteractionMode =
  | "drag"
  | "resize-br"
  | "resize-bl"
  | "resize-tr"
  | "resize-tl"
  | "canvas-resize";

interface InteractionState {
  mode: InteractionMode;
  elementId: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  originW: number;
  originH: number;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getTopZ(elements: CanvasElement[]) {
  return elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
}

function updateElement<T extends CanvasElement>(
  scene: CanvasScene,
  id: string,
  updater: (el: T) => T
): CanvasScene {
  return {
    ...scene,
    elements: scene.elements.map((el) =>
      el.id === id ? updater(el as T) : el
    ),
  };
}

interface MediaLibraryConfig {
  items: Array<{
    id: string;
    url: string;
    thumbnailUrl: string | null;
    name: string;
    altText: string | null;
  }>;
  isLoading: boolean;
  onSearch?: (query: string) => void;
  onUpload?: (file: File, alt: string) => Promise<{ url: string } | null>;
  isUploading?: boolean;
}

export default function CanvasBlockNodeView(props: NodeViewProps) {
  const { node, updateAttributes, deleteNode, editor } = props;

  // Get mediaLibrary from editor storage (updated dynamically)
  const storage = editor.storage as unknown as Record<string, unknown>;
  const mediaLibraryStorage = storage.mediaLibraryStorage as
    | { mediaLibrary?: MediaLibraryConfig }
    | undefined;
  const mediaLibrary = mediaLibraryStorage?.mediaLibrary;

  const nodeScene = useMemo(
    () => decodeCanvasScene(node.attrs.scene) ?? createDefaultCanvasScene(),
    [node.attrs.scene]
  );

  const [draftScene, setDraftScene] = useState<CanvasScene | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    nodeScene.elements[0]?.id ?? null
  );
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const scene = draftScene ?? nodeScene;

  const interactionRef = useRef<InteractionState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", updateScrollIndicators);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [scene.width, scene.height, scene.elements.length]);

  const persistScene = (next: CanvasScene) => {
    setDraftScene(null);
    updateAttributes({ scene: encodeCanvasScene(next) });
  };

  const selectedElement = selectedId
    ? scene.elements.find((el) => el.id === selectedId)
    : null;

  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (trimmed.startsWith("/")) return true;
    if (trimmed.startsWith("./") || trimmed.startsWith("../")) return true;
    if (trimmed.startsWith("blob:")) return true;
    if (trimmed.startsWith("http://")) return true;
    if (trimmed.startsWith("https://")) return true;
    if (trimmed.startsWith("data:image/")) return true;
    return false;
  };

  const addImage = (url: string) => {
    if (!isValidImageUrl(url)) {
      console.warn("Invalid image URL rejected:", url);
      return;
    }

    const top = getTopZ(scene.elements);
    const next: CanvasImageElement = {
      id: uid("img"),
      type: "image",
      x: 72,
      y: 96,
      w: 320,
      h: 210,
      zIndex: top + 1,
      src: url,
      radius: 16,
    };

    const updated = { ...scene, elements: [...scene.elements, next] };
    persistScene(updated);
    setSelectedId(next.id);
  };

  const deleteSelectedImage = () => {
    if (!selectedId) return;
    const updated = {
      ...scene,
      elements: scene.elements.filter((el) => el.id !== selectedId),
    };
    persistScene(updated);
    setSelectedId(null);
  };

  const bringToFront = () => {
    if (!selectedId) return;
    const top = getTopZ(scene.elements);
    const updated = updateElement(scene, selectedId, (el) => ({
      ...el,
      zIndex: top + 1,
    }));
    persistScene(updated);
  };

  const sendToBack = () => {
    if (!selectedId) return;
    const minZ = Math.min(...scene.elements.map((el) => el.zIndex));
    const updated = updateElement(scene, selectedId, (el) => ({
      ...el,
      zIndex: minZ - 1,
    }));
    persistScene(updated);
  };

  const updateRadius = (radius: number) => {
    if (!selectedId) return;
    const updated = updateElement<CanvasImageElement>(
      scene,
      selectedId,
      (el) => ({
        ...el,
        radius,
      })
    );
    persistScene(updated);
  };

  const updateOpacity = (opacity: number) => {
    if (!selectedId) return;
    const updated = updateElement(scene, selectedId, (el) => ({
      ...el,
      opacity,
    }));
    persistScene(updated);
  };

  const onPointerStart = (
    event: React.PointerEvent,
    el: CanvasElement,
    mode: InteractionMode
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(el.id);

    setDraftScene(scene);

    interactionRef.current = {
      mode,
      elementId: el.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: el.x,
      originY: el.y,
      originW: el.w,
      originH: el.h,
    };

    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const onCanvasResizeStart = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(null);

    setDraftScene(scene);

    interactionRef.current = {
      mode: "canvas-resize",
      elementId: "__canvas__",
      startX: event.clientX,
      startY: event.clientY,
      originX: 0,
      originY: 0,
      originW: scene.width,
      originH: scene.height,
    };

    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const interaction = interactionRef.current;
    if (!interaction || !draftScene) return;

    const dx = event.clientX - interaction.startX;
    const dy = event.clientY - interaction.startY;

    if (interaction.mode === "canvas-resize") {
      const newHeight = clamp(interaction.originH + dy, 100, 2000);
      setDraftScene({
        ...draftScene,
        height: newHeight,
      });
      return;
    }

    if (interaction.mode === "drag") {
      const next = updateElement(draftScene, interaction.elementId, (el) => ({
        ...el,
        x: interaction.originX + dx,
        y: interaction.originY + dy,
      }));
      setDraftScene(next);
      return;
    }

    if (interaction.mode === "resize-br") {
      const next = updateElement(draftScene, interaction.elementId, (el) => ({
        ...el,
        w: Math.max(40, interaction.originW + dx),
        h: Math.max(40, interaction.originH + dy),
      }));
      setDraftScene(next);
      return;
    }

    if (interaction.mode === "resize-bl") {
      const newW = Math.max(40, interaction.originW - dx);
      const next = updateElement(draftScene, interaction.elementId, (el) => ({
        ...el,
        x: interaction.originX + (interaction.originW - newW),
        w: newW,
        h: Math.max(40, interaction.originH + dy),
      }));
      setDraftScene(next);
      return;
    }

    if (interaction.mode === "resize-tr") {
      const newH = Math.max(40, interaction.originH - dy);
      const next = updateElement(draftScene, interaction.elementId, (el) => ({
        ...el,
        y: interaction.originY + (interaction.originH - newH),
        w: Math.max(40, interaction.originW + dx),
        h: newH,
      }));
      setDraftScene(next);
      return;
    }

    if (interaction.mode === "resize-tl") {
      const newW = Math.max(40, interaction.originW - dx);
      const newH = Math.max(40, interaction.originH - dy);
      const next = updateElement(draftScene, interaction.elementId, (el) => ({
        ...el,
        x: interaction.originX + (interaction.originW - newW),
        y: interaction.originY + (interaction.originH - newH),
        w: newW,
        h: newH,
      }));
      setDraftScene(next);
    }
  };

  const onPointerEnd = () => {
    if (interactionRef.current && draftScene) {
      updateAttributes({ scene: encodeCanvasScene(draftScene) });
    }
    interactionRef.current = null;
    setDraftScene(null);
  };

  return (
    <NodeViewWrapper
      as="div"
      className={cn("not-prose my-4 relative w-full")}
      contentEditable={false}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerLeave={onPointerEnd}
    >
      <div
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto overflow-y-hidden"
        onScroll={updateScrollIndicators}
      >
      <div
        ref={containerRef}
        className="relative bg-white"
        style={{
          width: scene.width,
          height: scene.height,
          background: scene.background,
        }}
        onPointerDown={() => setSelectedId(null)}
      >
        {[...scene.elements]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => {
            const isActive = selectedId === el.id;

            if (el.type !== "image") {
              return null;
            }

            return (
              <div
                key={el.id}
                className={cn(
                  "absolute select-none",
                  isActive && "ring-2 ring-gray-900 ring-offset-2"
                )}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                  zIndex: el.zIndex,
                  opacity: el.opacity ?? 1,
                  transform: `rotate(${el.rotation ?? 0}deg)`,
                  transformOrigin: "center center",
                  borderRadius: el.radius ?? 0,
                }}
                onPointerDown={(event) => onPointerStart(event, el, "drag")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={el.src}
                  alt="Canvas image"
                  className="h-full w-full object-cover"
                  style={{ borderRadius: el.radius ?? 0 }}
                  draggable={false}
                />

                {isActive && (
                  <>
                    <button
                      type="button"
                      className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-900 cursor-nwse-resize shadow-sm"
                      onPointerDown={(event) =>
                        onPointerStart(event, el, "resize-tl")
                      }
                      aria-label="Resize from top-left"
                    />
                    <button
                      type="button"
                      className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-900 cursor-nesw-resize shadow-sm"
                      onPointerDown={(event) =>
                        onPointerStart(event, el, "resize-tr")
                      }
                      aria-label="Resize from top-right"
                    />
                    <button
                      type="button"
                      className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-900 cursor-nesw-resize shadow-sm"
                      onPointerDown={(event) =>
                        onPointerStart(event, el, "resize-bl")
                      }
                      aria-label="Resize from bottom-left"
                    />
                    <button
                      type="button"
                      className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-900 cursor-nwse-resize shadow-sm"
                      onPointerDown={(event) =>
                        onPointerStart(event, el, "resize-br")
                      }
                      aria-label="Resize from bottom-right"
                    />
                  </>
                )}
              </div>
            );
          })}

        <div
          className="absolute bottom-4 right-4 z-50 flex items-center gap-2"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedElement && selectedElement.type === "image" && (
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 px-2 py-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                onClick={bringToFront}
                title="Bring to front"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                onClick={sendToBack}
                title="Send to back"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <div
                className="flex items-center gap-1 px-1"
                title="Border radius"
              >
                <Square className="h-3 w-3 text-gray-400" />
                <Slider
                  className="w-20"
                  min={0}
                  max={999}
                  step={1}
                  value={[(selectedElement as CanvasImageElement).radius ?? 0]}
                  onValueChange={(v) => updateRadius(Array.isArray(v) ? v[0]! : v)}
                />
                <Circle className="h-3 w-3 text-gray-400" />
              </div>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <div className="flex items-center gap-1 px-1" title="Opacity">
                <span className="text-[10px] text-gray-400 font-medium">%</span>
                <Slider
                  className="w-16"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[selectedElement.opacity ?? 1]}
                  onValueChange={(v) => updateOpacity(Array.isArray(v) ? v[0]! : v)}
                />
              </div>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={deleteSelectedImage}
                title="Delete image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="h-8 w-8 p-0 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]"
            onClick={() => deleteNode()}
            title="Delete canvas"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-full px-4 text-[11px] font-bold uppercase tracking-wider shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => setIsImageDialogOpen(true)}
          >
            Add Image
          </Button>
        </div>
      </div>
      </div>

      {canScrollHorizontally && isScrolledFromStart && (
        <div className="pointer-events-none absolute left-0 top-0 z-[120] h-[calc(100%-8px)] w-10 bg-gradient-to-r from-white/45 to-transparent">
          <div className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white/95">
            <ChevronLeft className="h-3 w-3" />
          </div>
        </div>
      )}

      {canScrollHorizontally && !isScrolledToEnd && (
        <div className="pointer-events-none absolute right-0 top-0 z-[120] h-[calc(100%-8px)] w-10 bg-gradient-to-l from-white/45 to-transparent">
          <div className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white/95">
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      )}

      <div
        className="relative z-[100] h-2 bg-gray-100/50 cursor-ns-resize flex items-center justify-center hover:bg-gray-100 transition-colors"
        onPointerDown={onCanvasResizeStart}
      >
        <div className="w-10 h-0.5 rounded-full bg-gray-300" />
      </div>

      <ImageDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onSave={(url) => {
          addImage(url);
          setIsImageDialogOpen(false);
        }}
        mediaLibrary={mediaLibrary}
      />
    </NodeViewWrapper>
  );
}
