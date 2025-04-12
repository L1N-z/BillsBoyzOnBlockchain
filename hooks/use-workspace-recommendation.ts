import { useState } from "react";

export function useWorkspaceRecommendation() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async (userIntention: string, hard_requirements: any) => {
    console.log("Fetching recommendation with intention:", userIntention, "and requirements:", hard_requirements);
    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const res = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIntention, hard_requirements }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch recommendation');

      setRecommendation(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { recommendation, loading, error, fetchRecommendation };
}
