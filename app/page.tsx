import FileUploader from "../components/FileUploader";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 py-10 font-sans">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <header className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Melytix – AI Marketing Helper
          </h1>
          <p className="text-sm text-zinc-600">
            Upload two Google Ads exports (current and previous period) and let
            Melytix highlight key changes, anomalies and opportunities.
          </p>
        </header>
        <FileUploader />
      </div>
    </main>
  );
}
