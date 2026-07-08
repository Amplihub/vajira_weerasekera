"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Extension, type Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "tiptap-markdown";
import Link from "@tiptap/extension-link";
import { ResizableImage } from "./rich-text/image-extension";
import { CanvasBlock } from "./rich-text/canvas-block-extension";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";

import CharacterCount from "@tiptap/extension-character-count";

import { Button } from "./button";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Undo,
  Redo,
  Code,
  Braces,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Superscript as SuperIcon,
  Subscript as SubIcon,
  CheckSquare,
  Highlighter,
  Video as YoutubeIcon,
  Trash,
  Palette,
  RemoveFormatting,
  Type,
  Minus,
  Indent,
  Outdent,
  WrapText,
  Maximize,
  Minimize,
  Info,
  AlertTriangle,
  Lightbulb,
  BadgeAlert,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";

import { LinkDialog } from "./rich-text/link-dialog";
import { ImageDialog } from "./rich-text/image-dialog";
import { YoutubeDialog } from "./rich-text/youtube-dialog";

export interface MediaLibraryConfig {
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

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  /** Optional: Connect to media library for image selection and upload */
  mediaLibrary?: MediaLibraryConfig;
}

const MenuBar = ({
  editor,
  onLinkClick,
  onImageClick,
  onCanvasClick,
  onYoutubeClick,
  isFullscreen,
  onToggleFullscreen,
}: {
  editor: Editor | null;
  onLinkClick: () => void;
  onImageClick: () => void;
  onCanvasClick: () => void;
  onYoutubeClick: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-input bg-muted/20 rounded-t-lg items-center">
      {/* Base Formatting */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            onCanvasClick();
          }}
          className={cn(
            "h-8 px-2 text-[10px] font-bold uppercase tracking-wider",
            editor.isActive("canvasBlock") && "bg-muted text-foreground",
          )}
          title="Canvas Block"
        >
          Canvas
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bold") && "bg-muted text-foreground",
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic") && "bg-muted text-foreground",
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("underline") && "bg-muted text-foreground",
          )}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("strike") && "bg-muted text-foreground",
          )}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCode().run();
          }}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("code") && "bg-muted text-foreground",
          )}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("blockquote") && "bg-muted text-foreground",
          )}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setHorizontalRule().run();
          }}
          className="h-8 w-8 p-0"
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("codeBlock") && "bg-muted text-foreground",
          )}
          title="Code Block"
        >
          <Braces className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHighlight().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("highlight") && "bg-muted text-foreground",
          )}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        {/* Color Picker */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  editor.isActive("textStyle") && "bg-muted text-foreground",
                )}
                title="Text Color"
              />
            }
          >
            <Palette
              className="h-4 w-4"
              style={{ color: editor.getAttributes("textStyle").color }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Color</h4>
                <p className="text-sm text-muted-foreground">
                  Pick a text color.
                </p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  "#000000",
                  "#444444",
                  "#888888",
                  "#CCCCCC",
                  "#FFFFFF",
                  "#FF0000",
                  "#FF9900",
                  "#FFFF00",
                  "#00FF00",
                  "#00FFFF",
                  "#0000FF",
                  "#9900FF",
                  "#FF00FF",
                ].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.preventDefault();
                      editor.chain().focus().setColor(color).run();
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Hex:</span>
                <Input
                  className="h-8"
                  placeholder="#000000"
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  defaultValue={editor.getAttributes("textStyle").color}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetAllMarks().clearNodes().run();
          }}
          className="h-8 w-8 p-0"
          title="Clear Formatting"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Font Family (Simple Selector) */}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("textStyle") && "bg-muted text-foreground",
              )}
              title="Font Family"
            />
          }
        >
          <Type className="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent className="w-32 p-1">
          <div className="grid gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start font-sans"
              onClick={() =>
                editor.chain().focus().setFontFamily("Inter").run()
              }
            >
              Sans Serif
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start font-serif"
              onClick={() =>
                editor.chain().focus().setFontFamily("serif").run()
              }
            >
              Serif
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start font-mono"
              onClick={() =>
                editor.chain().focus().setFontFamily("monospace").run()
              }
            >
              Monospace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => editor.chain().focus().unsetFontFamily().run()}
            >
              Default
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Script */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleSuperscript().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("superscript") && "bg-muted text-foreground",
          )}
          title="Superscript"
        >
          <SuperIcon className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleSubscript().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("subscript") && "bg-muted text-foreground",
          )}
          title="Subscript"
        >
          <SubIcon className="h-3 w-3" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "left" }) &&
              "bg-muted text-foreground",
          )}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "center" }) &&
              "bg-muted text-foreground",
          )}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "right" }) &&
              "bg-muted text-foreground",
          )}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("justify").run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "justify" }) &&
              "bg-muted text-foreground",
          )}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 1 }) &&
              "bg-muted text-foreground",
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 2 }) &&
              "bg-muted text-foreground",
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 3 }) &&
              "bg-muted text-foreground",
          )}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 4 }).run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 4 }) &&
              "bg-muted text-foreground",
          )}
          title="Heading 4"
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 5 }).run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 5 }) &&
              "bg-muted text-foreground",
          )}
          title="Heading 5"
        >
          <Heading5 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 6 }).run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 6 }) &&
              "bg-muted text-foreground",
          )}
          title="Heading 6"
        >
          <Heading6 className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList") && "bg-muted text-foreground",
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("orderedList") && "bg-muted text-foreground",
          )}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleTaskList().run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("taskList") && "bg-muted text-foreground",
          )}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Insertions */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            onLinkClick();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("link") && "bg-muted text-foreground",
          )}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            onImageClick();
          }}
          className="h-8 w-8 p-0"
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("table") && "bg-muted text-foreground",
          )}
          title="Table"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            onYoutubeClick();
          }}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("youtube") && "bg-muted text-foreground",
          )}
          title="Youtube"
        >
          <YoutubeIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Indent/Outdent */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().sinkListItem("listItem").run();
          }}
          disabled={!editor.can().sinkListItem("listItem")}
          className="h-8 w-8 p-0"
          title="Indent (Tab)"
        >
          <Indent className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().liftListItem("listItem").run();
          }}
          disabled={!editor.can().liftListItem("listItem")}
          className="h-8 w-8 p-0"
          title="Outdent (Shift+Tab)"
        >
          <Outdent className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* History */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Callouts */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            editor
              .chain()
              .focus()
              .setParagraph()
              .toggleBlockquote()
              .insertContent("[!NOTE]\n")
              .run();
          }}
          className="h-8 w-8 p-0"
          title="Insert Note"
        >
          <Info className="h-4 w-4 text-blue-500" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            editor
              .chain()
              .focus()
              .setParagraph()
              .toggleBlockquote()
              .insertContent("[!WARNING]\n")
              .run();
          }}
          className="h-8 w-8 p-0"
          title="Insert Warning"
        >
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            editor
              .chain()
              .focus()
              .setParagraph()
              .toggleBlockquote()
              .insertContent("[!TIP]\n")
              .run();
          }}
          className="h-8 w-8 p-0"
          title="Insert Tip"
        >
          <Lightbulb className="h-4 w-4 text-green-500" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            editor
              .chain()
              .focus()
              .setParagraph()
              .toggleBlockquote()
              .insertContent("[!CAUTION]\n")
              .run();
          }}
          className="h-8 w-8 p-0"
          title="Insert Caution"
        >
          <BadgeAlert className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Hard Break & Fullscreen */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setHardBreak().run();
          }}
          className="h-8 w-8 p-0"
          title="Hard Break (Ctrl+Enter)"
        >
          <WrapText className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onToggleFullscreen()}
          className={cn(
            "h-8 w-8 p-0",
            isFullscreen && "bg-muted text-foreground",
          )}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder,
  mediaLibrary,
}: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Typography,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      ResizableImage.configure({
        inline: true,
        HTMLAttributes: {
          class: "rounded-lg border border-border",
        },
      }),
      CanvasBlock,
      // Extension to store mediaLibrary in editor storage for dynamic updates
      Extension.create({
        name: "mediaLibraryStorage",
        addStorage() {
          return {
            mediaLibrary: undefined as MediaLibraryConfig | undefined,
          };
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      Subscript,
      Placeholder.configure({
        placeholder: placeholder || "Write something amazing...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight,
      // Custom Youtube extension to ensure proper Markdown serialization (as HTML)
      Youtube.configure({
        width: 640,
        height: 480,
      }),
      // Dedicated extension just for Markdown serialization of Youtube nodes
      Extension.create({
        name: "youtube-markdown",
        addStorage() {
          return {
            markdown: {
              serialize: {
                youtube(state: any, node: any) {
                  const { src, width, height } = node.attrs;
                  state.write(
                    `<div data-youtube-video><iframe src="${src}" width="${width}" height="${height}" allowfullscreen></iframe></div>`,
                  );
                  state.closeBlock(node);
                },
              },
            },
          };
        },
      }),
      // Dedicated extension just for Markdown serialization of Image nodes to preserve size
      Extension.create({
        name: "image-html-serializer",
        addStorage() {
          interface MarkdownState {
            write: (value: string) => void;
          }
          interface NodeWithAttrs {
            attrs: {
              src: string;
              alt?: string | null;
              width?: number | string | null;
              height?: number | null;
              textAlign?: "left" | "center" | "right";
              layout?: "row" | "block";
            };
          }
          return {
            markdown: {
              serialize: {
                // Target our renamed node "resizableImage"
                resizableImage(state: MarkdownState, node: NodeWithAttrs) {
                  const { src, alt, width, height, textAlign, layout } =
                    node.attrs;

                  let style = "";
                  if (width) {
                    style += `width: ${
                      typeof width === "number" ? `${width}px` : width
                    };`;
                  }
                  if (height)
                    style += `height: ${
                      height === null ? "auto" : height + "px"
                    };`;
                  if (layout === "row") {
                    style +=
                      "display: inline-block; vertical-align: top; margin-right: 8px; margin-bottom: 8px;";
                  } else {
                    style += "display: block;";
                    if (textAlign === "center") {
                      style += "margin-left: auto; margin-right: auto;";
                    } else if (textAlign === "right") {
                      style += "margin-left: auto; margin-right: 0;";
                    } else {
                      style += "margin-left: 0; margin-right: auto;";
                    }
                  }

                  const widthAttr =
                    typeof width === "number" ? String(width) : "";
                  const widthDataAttr = width ? String(width) : "";
                  const heightDataAttr = height ? String(height) : "";
                  const layoutDataAttr = layout || "block";

                  state.write(
                    `<img src="${src}" alt="${alt || ""}" width="${
                      widthAttr
                    }" height="${height || ""}" data-width="${widthDataAttr}" data-height="${heightDataAttr}" data-align="${
                      textAlign || "left"
                    }" data-layout="${layoutDataAttr}" style="${style}" />`,
                  );
                },
              },
            },
          };
        },
      }),
      TextStyle,
      FontFamily,
      Color,
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 bg-background prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4",
      },
    },
    onUpdate: ({ editor }) => {
      // Check if document contains canvas blocks
      let hasCanvasBlock = false;
      editor.state.doc.descendants((node) => {
        if (node.type.name === "canvasBlock") {
          hasCanvasBlock = true;
          return false;
        }
        return true;
      });

      // If canvas blocks exist, output HTML to preserve them
      if (hasCanvasBlock) {
        onChange(editor.getHTML());
        return;
      }

      // Otherwise, use Markdown
      try {
        const storage = editor.storage as unknown as Record<string, unknown>;
        const markdownExt = storage.markdown as
          | { getMarkdown?: () => string }
          | undefined;
        const markdown = markdownExt?.getMarkdown?.();
        if (typeof markdown === "string") {
          onChange(markdown);
        } else {
          onChange(editor.getHTML());
        }
      } catch {
        onChange(editor.getHTML());
      }
    },
  });

  // Update mediaLibrary in editor storage when it changes
  useEffect(() => {
    if (editor && mediaLibrary) {
      const storage = editor.storage as unknown as Record<string, unknown>;
      storage.mediaLibraryStorage = {
        mediaLibrary,
      };
    }
  }, [editor, mediaLibrary]);

  const handleLinkSave = useCallback(
    (url: string) => {
      if (!editor) return;

      // If empty, unset
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // Apply link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    },
    [editor],
  );

  const handleImageSave = useCallback(
    (url: string, alt?: string) => {
      if (!editor) return;
      editor.chain().focus().setImage({ src: url, alt }).run();
    },
    [editor],
  );

  const handleYoutubeSave = useCallback(
    (url: string) => {
      if (!editor) return;
      editor.commands.setYoutubeVideo({ src: url });
    },
    [editor],
  );

  return (
    <div
      className={cn(
        "border border-input rounded-lg overflow-hidden flex flex-col hover:border-foreground/40 transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-foreground",
        className,
        isFullscreen &&
          "fixed inset-0 z-50 bg-background m-0 rounded-none border-0 ring-0 hover:border-0",
      )}
    >
      <MenuBar
        editor={editor}
        onLinkClick={() => setIsLinkDialogOpen(true)}
        onImageClick={() => setIsImageDialogOpen(true)}
        onCanvasClick={() => {
          editor?.chain().focus().insertCanvasBlock().run();
        }}
        onYoutubeClick={() => setIsYoutubeDialogOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />
      <div className="flex-1 bg-background">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-end px-2 py-1 border-t border-input bg-muted/20 text-xs text-muted-foreground">
        {editor && (
          <div className="flex gap-3">
            <span>{editor.storage.characterCount.words()} words</span>
            <span>{editor.storage.characterCount.characters()} characters</span>
          </div>
        )}
      </div>

      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSave={handleLinkSave}
        initialUrl={editor?.getAttributes("link").href}
      />
      <ImageDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onSave={handleImageSave}
        mediaLibrary={mediaLibrary}
      />
      <YoutubeDialog
        isOpen={isYoutubeDialogOpen}
        onClose={() => setIsYoutubeDialogOpen(false)}
        onSave={handleYoutubeSave}
      />
    </div>
  );
}
