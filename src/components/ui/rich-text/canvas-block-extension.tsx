import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CanvasBlockNodeView from "./canvas-block-node-view";
import { createDefaultCanvasScene, encodeCanvasScene } from "./canvas-scene";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    canvasBlock: {
      insertCanvasBlock: () => ReturnType;
    };
  }
}

export interface CanvasBlockOptions {
  onImageDialogOpen?: () => void;
}

export const CanvasBlock = Node.create<CanvasBlockOptions>({
  name: "canvasBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  isolating: true,

  addOptions() {
    return {
      onImageDialogOpen: undefined,
    };
  },

  addAttributes() {
    return {
      scene: {
        default: encodeCanvasScene(createDefaultCanvasScene()),
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-canvas-scene") ||
          encodeCanvasScene(createDefaultCanvasScene()),
        renderHTML: (attributes: { scene?: string }) => ({
          "data-canvas-scene":
            attributes.scene || encodeCanvasScene(createDefaultCanvasScene()),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-canvas-scene]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      insertCanvasBlock:
        () =>
        ({ chain, state }) => {
          const { selection } = state;
          const pos = selection.$to.after();

          return chain()
            .insertContentAt(pos, { type: this.name })
            .focus()
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CanvasBlockNodeView);
  },

  addStorage() {
    return {
      markdown: {
        serialize: {
          canvasBlock: (
            state: {
              write: (value: string) => void;
              closeBlock: (node: unknown) => void;
            },
            node: { attrs?: { scene?: string } }
          ) => {
            const scene = node.attrs?.scene ?? "";
            state.write(`<div data-canvas-scene="${scene}"></div>`);
            state.closeBlock(node);
          },
        },
      },
    };
  },
});
