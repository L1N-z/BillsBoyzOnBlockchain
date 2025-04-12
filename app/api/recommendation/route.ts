import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Workspace, WorkspaceReview } from '@/types';

dotenv.config();

const systemPrompt = `
You are an expert in analyzing reviews and, based on user needs, you suggest the best places for specific users.
You will be fed multiple workspace reviews.
Respond with the names of the 2 best matching workspaces for the user intention.
give json format output, give reason for your choices but do not mention any specific coment do aggregation on it
`;

export async function POST(req: Request) {
  try {
    const { userIntention } = await req.json();

    const filePath = path.resolve('./public/reviews.json');
    const reviewData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const reviewText = reviewData.workspaces.map((ws: Workspace, i: number) => {
      const reviews = ws.reviews.map(
        (r: WorkspaceReview, j: number) =>
          `  Review ${j + 1}: wifi=${r.wifi}, plugs=${r.plugs}, noise=${r.noise}, business=${r.business}`
      ).join('\n');
      return `Workspace ${i + 1}: ${ws.name}\n${reviews}`;
    }).join('\n\n');

    const userPrompt = `
User intention: ${userIntention}

Here are workspace reviews:
${reviewText}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}\n${errText}`);
    }

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
