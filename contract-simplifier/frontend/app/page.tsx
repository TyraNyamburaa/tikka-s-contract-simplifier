"use client";

import { useState } from "react";

type RedFlag = {
  category: string;
  risk_level: string;
  original_quote: string;
  plain_english_explanation: string;
};

type Analysis = {
  overall_risk_level: string;
  summary: string;
  red_flags: RedFlag[];
};

export default function Home() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setAnalysis(data);
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = (risk: string) => {
    switch (risk) {
      case "extreme":
        return "bg-red-700";

      case "high":
        return "bg-red-500";

      case "medium":
        return "bg-orange-500";

      case "low":
        return "bg-yellow-500 text-black";

      default:
        return "bg-green-600";
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <div className="max-w-5xl mx-auto p-10">

        <h1 className="text-5xl font-black mb-3">
          📄 Jargon-Free
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Understand contracts before you sign them.
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="mb-8 block"
        />

        {loading && (
          <div className="bg-zinc-900 rounded-xl p-8 animate-pulse">
            <h2 className="text-xl font-bold">
              Analyzing your contract...
            </h2>

            <p className="text-zinc-400 mt-2">
              Looking for hidden fees, unfair clauses,
              liability waivers and other red flags.
            </p>
          </div>
        )}

        {analysis && (
          <>
            {/* Summary Card */}

            <div className="bg-zinc-900 rounded-2xl p-8 mb-8 shadow-lg">

              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-5 ${badgeColor(
                  analysis.overall_risk_level
                )}`}
              >
                {analysis.overall_risk_level.toUpperCase()} RISK
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Summary
              </h2>

              <p className="text-zinc-300 leading-8">
                {analysis.summary}
              </p>
            </div>

            <h2 className="text-3xl font-bold mb-6">
              🚩 Red Flags Found
            </h2>

            <div className="space-y-6">

              {analysis.red_flags.map((flag, index) => (

                <div
                  key={index}
                  className="bg-zinc-900 rounded-2xl p-6 shadow-md"
                >

                  <div className="flex justify-between items-center">

                    <h3 className="text-2xl font-bold">
                      {flag.category}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(
                        flag.risk_level
                      )}`}
                    >
                      {flag.risk_level.toUpperCase()}
                    </span>

                  </div>

                  <div className="mt-6">

                    <h4 className="font-semibold text-zinc-400">
                      Plain English
                    </h4>

                    <p className="mt-2 text-lg">
                      {flag.plain_english_explanation}
                    </p>

                  </div>

                  <details className="mt-6">

                    <summary className="cursor-pointer font-semibold text-blue-400">
                      Show Original Clause
                    </summary>

                    <blockquote className="mt-3 border-l-4 border-zinc-600 pl-4 italic text-zinc-400">
                      {flag.original_quote}
                    </blockquote>

                  </details>

                </div>

              ))}

            </div>
          </>
        )}
      </div>
    </main>
  );
}