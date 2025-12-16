"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { runAnalysis } from "../services/analyzeAPI";

type FileWithName = {
  file: File;
  label: string;
};

export default function FileUploader() {
  const router = useRouter();
  const [currentFile, setCurrentFile] = useState<FileWithName | null>(null);
  const [previousFile, setPreviousFile] = useState<FileWithName | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCurrentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentFile({ file, label: file.name });
    }
  };

  const handlePreviousChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviousFile({ file, label: file.name });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!currentFile || !previousFile) {
      setError("Please upload both current and previous period files.");
      return;
    }

    try {
      setIsSubmitting(true);
      const entry = await runAnalysis({
        current: currentFile.file,
        previous: previousFile.file,
        customInstructions: customInstructions.trim(),
      });
      router.push(`/results/${entry.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to run analysis. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileAccept =
    ".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-4 text-sm"
    >
      <div className="space-y-1">
        <label className="block text-xs font-medium uppercase tracking-wide text-zinc-700">
          Current period file
        </label>
        <input
          type="file"
          accept={fileAccept}
          onChange={handleCurrentChange}
          className="block w-full cursor-pointer text-xs text-zinc-600 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-zinc-800"
        />
        {currentFile && (
          <p className="text-[11px] text-zinc-500">
            Selected: {currentFile.label}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium uppercase tracking-wide text-zinc-700">
          Previous period file
        </label>
        <input
          type="file"
          accept={fileAccept}
          onChange={handlePreviousChange}
          className="block w-full cursor-pointer text-xs text-zinc-600 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-zinc-800"
        />
        {previousFile && (
          <p className="text-[11px] text-zinc-500">
            Selected: {previousFile.label}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium uppercase tracking-wide text-zinc-700">
          Custom instructions <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="e.g., Current period includes a 20% budget increase starting Monday.&#10;Previous period had tracking issues on iOS.&#10;These files are only US + CA campaigns."
          maxLength={2000}
          rows={4}
          className="block w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        <p className="text-[11px] text-zinc-500">
          {customInstructions.length}/2000 characters
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isSubmitting ? "Running analysis..." : "Run Analysis"}
      </button>
    </form>
  );
}

