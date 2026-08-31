/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

interface PhotoUploaderProps {
  /** Path segment under public/ to save into, e.g. "property-photos" or "buildings". */
  category: string;
  /** Subfolder within the category, e.g. a property or building id. */
  folder: string;
  /** Allow selecting/dropping more than one file at once. */
  multiple?: boolean;
  /** Called with the server-relative URL(s) of the newly uploaded image(s). */
  onUploaded: (urls: string[]) => void;
  className?: string;
}

export default function PhotoUploader({ category, folder, multiple = false, onUploaded, className }: PhotoUploaderProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doUpload = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      (multiple ? files : [files[0]]).forEach((f) => formData.append("file", f));
      formData.append("folder", folder || "misc");

      const token = localStorage.getItem("itpms_access_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/uploads/${encodeURIComponent(category)}`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      onUploaded(data.urls || (data.url ? [data.url] : []));
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) doUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center cursor-pointer text-center relative ${
          isDragging ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-emerald-500/50 bg-white"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) doUpload(e.target.files);
            e.target.value = "";
          }}
        />
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 text-emerald-500 mb-1 animate-spin" />
            <span className="text-[10px] font-black text-slate-700">{t("Uploading...")}</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-slate-400 mb-1" />
            <span className="text-[10px] font-black text-slate-700">{t("Drag & Drop or Click to Upload")}</span>
            <span className="text-[9px] text-slate-400 mt-0.5">{t("PNG, JPG, WEBP, GIF up to 10MB")}</span>
          </>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-[10px] text-rose-600 mt-1.5 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
