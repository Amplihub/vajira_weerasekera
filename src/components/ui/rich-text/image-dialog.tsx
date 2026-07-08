"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import {
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Search,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, alt?: string) => void;
  /** Optional: Pass media library items for the library tab */
  mediaLibrary?: {
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
  };
}

export function ImageDialog({
  isOpen,
  onClose,
  onSave,
  mediaLibrary,
}: ImageDialogProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
    alt: string | null;
  } | null>(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  const [uploadAlt, setUploadAlt] = useState("");
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (!isOpen) return;
    setSelectedImage(null);
    setSelectedImageAlt("");
    setPendingUploadFile(null);
    setPreviewUrl(null);
    setUploadAlt("");
    setUrl("");
    setAlt("");
    setSearchQuery("");
  }, [isOpen]);

  // Create preview URL for upload
  useEffect(() => {
    if (pendingUploadFile) {
      const objectUrl = URL.createObjectURL(pendingUploadFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [pendingUploadFile]);

  // Debounced search
  useEffect(() => {
    if (!mediaLibrary?.onSearch) return;
    const timeout = setTimeout(() => {
      mediaLibrary.onSearch?.(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, mediaLibrary]);

  const handleSaveFromUrl = () => {
    if (!url) return;
    onSave(url, alt || undefined);
    onClose();
  };

  const handleSaveFromLibrary = () => {
    if (!selectedImage) return;
    onSave(selectedImage.url, selectedImageAlt || selectedImage.alt || undefined);
    onClose();
  };

  const handleUploadAndInsert = async () => {
    if (!pendingUploadFile || !mediaLibrary?.onUpload) return;

    const result = await mediaLibrary.onUpload(
      pendingUploadFile,
      uploadAlt || pendingUploadFile.name
    );
    if (result) {
      onSave(result.url, uploadAlt || pendingUploadFile.name);
      onClose();
    }
  };

  const hasMediaLibrary = !!mediaLibrary;

  // Simple URL-only dialog when no media library
  if (!hasMediaLibrary) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md rounded-3xl border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Insert Image</DialogTitle>
            <DialogDescription className="text-gray-500">
              Add an image using a URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label
                htmlFor="image-url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Image URL
              </Label>
              <Input
                id="image-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-xl border-0 bg-gray-100 focus:ring-2 focus:ring-gray-900"
                placeholder="https://example.com/image.png"
              />
            </div>
            <div>
              <Label
                htmlFor="image-alt"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Alt Text
              </Label>
              <Input
                id="image-alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="rounded-xl border-0 bg-gray-100 focus:ring-2 focus:ring-gray-900"
                placeholder="Description of image"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={onClose} className="rounded-full">
              Cancel
            </Button>
            <Button
              onClick={handleSaveFromUrl}
              disabled={!url}
              className="rounded-full bg-black text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Full dialog with Library/Upload/URL tabs
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl rounded-3xl border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Insert Image</DialogTitle>
          <DialogDescription className="text-gray-500">
            Choose from library, upload new, or use a URL.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-gray-100 p-1">
            <TabsTrigger
              value="library"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Library
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              URL
            </TabsTrigger>
          </TabsList>

          {/* Library Tab */}
          <TabsContent value="library" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-full border-0 bg-gray-100 pl-10 focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {mediaLibrary.isLoading ? (
              <div className="flex h-64 items-center justify-center text-gray-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading images...
              </div>
            ) : mediaLibrary.items.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-gray-50 text-center">
                <div className="rounded-full bg-gray-100 p-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-900">
                  No images found
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Upload images to your media library first.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                {/* Image Grid */}
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {mediaLibrary.items.map((image) => {
                    const isSelected = selectedImage?.id === image.id;
                    return (
                      <button
                        key={image.id}
                        type="button"
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-2xl bg-gray-50 transition-all",
                          isSelected
                            ? "ring-2 ring-gray-900 ring-offset-2"
                            : "hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                        )}
                        onClick={() => {
                          setSelectedImage({
                            id: image.id,
                            url: image.url,
                            alt: image.altText,
                          });
                          setSelectedImageAlt(image.altText || "");
                        }}
                      >
                        <img
                          src={image.thumbnailUrl || image.url}
                          alt={image.altText || image.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selection Panel */}
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Selection
                  </p>

                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="aspect-video overflow-hidden rounded-xl bg-white shadow-sm">
                        <img
                          src={selectedImage.url}
                          alt={selectedImage.alt || "Selected"}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="selected-alt"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Alt Text
                        </Label>
                        <Input
                          id="selected-alt"
                          value={selectedImageAlt}
                          onChange={(e) => setSelectedImageAlt(e.target.value)}
                          placeholder="Describe this image"
                          className="rounded-xl border-0 bg-white focus:ring-2 focus:ring-gray-900"
                        />
                      </div>

                      <Button
                        onClick={handleSaveFromLibrary}
                        className="w-full rounded-full bg-black text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98] transition-all"
                      >
                        Insert Selected
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center text-center text-sm text-gray-500">
                      Select an image to preview
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-4 space-y-4">
            <input
              ref={uploadInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setPendingUploadFile(e.target.files?.[0] || null)}
            />

            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="w-full cursor-pointer rounded-2xl bg-gray-50 p-10 text-center transition-all hover:bg-gray-100"
            >
              <div className="mx-auto w-fit rounded-full bg-white p-4 shadow-sm">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-900">
                Click to choose image
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, WEBP, GIF up to 10MB
              </p>
            </button>

            {pendingUploadFile && previewUrl && (
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="aspect-video overflow-hidden rounded-xl bg-white shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-3 truncate text-sm font-medium text-gray-900">
                  {pendingUploadFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(pendingUploadFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}

            <div>
              <Label
                htmlFor="upload-alt"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Alt Text
              </Label>
              <Input
                id="upload-alt"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                placeholder="Describe this image"
                className="rounded-xl border-0 bg-gray-100 focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <Button
              onClick={handleUploadAndInsert}
              disabled={
                !pendingUploadFile || mediaLibrary.isUploading
              }
              className="w-full rounded-full bg-black text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              {mediaLibrary.isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload & Insert
            </Button>
          </TabsContent>

          {/* URL Tab */}
          <TabsContent value="url" className="mt-4 space-y-4">
            <div>
              <Label
                htmlFor="url-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Image URL
              </Label>
              <Input
                id="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="rounded-xl border-0 bg-gray-100 focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <Label
                htmlFor="url-alt"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Alt Text
              </Label>
              <Input
                id="url-alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Description of image"
                className="rounded-xl border-0 bg-gray-100 focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <Button
              onClick={handleSaveFromUrl}
              disabled={!url}
              className="w-full rounded-full bg-black text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Insert from URL
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
