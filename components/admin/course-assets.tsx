"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileIcon,
  Trash2Icon,
  UploadIcon,
  FileTextIcon,
  FileImageIcon,
  FileVideoIcon,
} from "lucide-react";

type Asset = {
  name: string;
  url: string;
  publicId: string;
  type: string;
  size: number;
  uploadedAt: Date;
};

export function CourseAssets({
  courseId,
  initialAssets,
}: {
  courseId: string;
  initialAssets?: Asset[];
}) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets || []);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/courses/${courseId}/assets`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { asset } = await response.json();
      setAssets([...assets, asset]);
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const response = await fetch(
        `/api/courses/${courseId}/assets?publicId=${publicId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      setAssets(assets.filter((asset) => asset.publicId !== publicId));
    } catch (error) {
      alert("Error deleting file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImageIcon className="h-5 w-5" />;
    if (type.startsWith("video/")) return <FileVideoIcon className="h-5 w-5" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileTextIcon className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Course Assets</h3>
        <label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button type="button" disabled={isUploading} asChild>
            <span className="cursor-pointer">
              <UploadIcon className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload File"}
            </span>
          </Button>
        </label>
      </div>

      {assets.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No assets uploaded yet. Add files for students to download.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {assets.map((asset) => (
            <Card key={asset.publicId} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-primary">{getFileIcon(asset.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {asset.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(asset.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(asset.publicId)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
