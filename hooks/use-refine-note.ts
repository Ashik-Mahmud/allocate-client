import { useState } from "react";

export const useRefineNote = (isPaid?: boolean) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refineNote = async (text: string) => {
        if (!text || text.length < 5) return null;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/refine-note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, isPaid: isPaid ?? false }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            return data.result;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { refineNote, isLoading, error };
};