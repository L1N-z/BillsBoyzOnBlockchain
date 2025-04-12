import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Workspace, WorkspaceReview } from '@/types';

dotenv.config();

const systemPrompt = `
You are an intelligent recommendation system for coworking spaces. Your task is to carefully interpret structured User Input and select the workspace that best matches the user's requirements and preferences, using the Workspace Dataset provided. Follow the instructions below closely.

****Instructions****

**Dataset Information:**
Each workspace in the dataset is scored on the following metrics (1-10 scale):

charging_plug_availability: Availability of plug points (10 = many plugs, 1 = very few)
noise_level: Ambient noise at the venue (10 = very noisy, 1 = very silent)
internet_speed: Speed of the internet (10 = very fast, 1 = very slow)
crowdedness: How crowded the venue feels (10 = very crowded, 1 = very uncrowded)

**User Input:**
The user input is a JSON object composed of:

hard_requirements: a JSON dictionary indicating whether each feature is required (1) or not (0). For example, "charging_plugs": 1 means charging plugs are required.
user_text: a natural language sentence describing the purpose of their visit.

Example User Input:
{ "hard_requirements": { "charging_plugs": 1, "silent": 0, "high_internet_speed": 1, "low_crowdedness": 0 }, "user_text": "I'm making a Zoom call." }


**Recommendation Logic:**
Prioritize all hard requirements. Only consider workspaces that meet all required features. If this is not possible, make it clear in your output.
Refine using the user's purpose. Use the user's text description to infer ideal conditions.

Use common sense reasoning (e.g. Zoom calls need quiet, fast internet; reading requires silence and uncrowded spaces; group work benefits from moderate noise and uncrowded areas).

Select the single best matching workspace based on the above criteria.

**Output Format:**
ensure the output is the following format:
{
  "workspace": "Name of the selected workspace",
  "reasoning": "1-2 natural, human-friendly sentences explaining why this workspace suits the user's purpose."
}
`;

export async function POST(req: Request) {
  try {
    const { userIntention, hard_requirements } = await req.json();

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
hard requirements: ${JSON.stringify(hard_requirements)}
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

    console.log("Response from OpenRouter:", response);
    

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
