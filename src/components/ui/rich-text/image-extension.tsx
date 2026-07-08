import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageComponent } from "./resizable-image-component";

export const ResizableImage = Image.extend({
  name: "resizableImage",

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const raw =
            element.getAttribute("data-width") ?? element.getAttribute("width");
          if (!raw) return null;
          const numeric = Number(raw);
          return Number.isNaN(numeric) ? raw : numeric;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return typeof attributes.width === "number"
            ? {
                width: attributes.width,
                "data-width": String(attributes.width),
              }
            : { "data-width": String(attributes.width) };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const raw =
            element.getAttribute("data-height") ??
            element.getAttribute("height");
          if (!raw) return null;
          const numeric = Number(raw);
          return Number.isNaN(numeric) ? raw : numeric;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return typeof attributes.height === "number"
            ? {
                height: attributes.height,
                "data-height": String(attributes.height),
              }
            : { "data-height": String(attributes.height) };
        },
      },
      textAlign: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-align") || "left",
        renderHTML: (attributes) => ({
          "data-align": attributes.textAlign || "left",
        }),
      },
      layout: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-layout") || "block",
        renderHTML: (attributes) => ({
          "data-layout": attributes.layout || "block",
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
