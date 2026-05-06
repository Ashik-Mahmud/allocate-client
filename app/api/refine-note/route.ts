import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 5 requests per 10 minutes
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
});
export async function POST(req: Request) {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI assistant for a resource booking app. Your task is to take a messy or informal user note and rewrite it into a professional, concise booking note (max 20-25 words). Maintain the core intent (e.g., if they mention a guest, keep that). Return ONLY the refined text."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const refinedText = data.choices[0].message.content;
        return NextResponse.json({ result: refinedText });
    } catch (error) {
        return NextResponse.json({ error: "AI Refinement failed" }, { status: 500 });
    }
} 