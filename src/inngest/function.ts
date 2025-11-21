import JSONL from "jsonl-parse-stringify";

import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

import { StreamTranscriptItem } from "@/modules/meetings/type";
import { inngest } from "./client";

import { eq, inArray } from "drizzle-orm";
import { agents, meetings, user } from "@/db/schema";
import { db } from "@/db";

const summarize = createAgent({
  name: "summarizer",
  system:
    `You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

    Use the following markdown structure for every output:

    ### Overview
    Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique   or powerful aspects of the product, platform, or discussion.

    ### Notes
    Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

    Example:
    #### Section Name
    - Main point or demo shown here
    - Another key insight or interaction
    - Follow-up tool or explanation provided

    #### Next Section
    - Feature X automatically does Y
    - Mention of integration with Z
`.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY! }),
});

/**
 * Inngest function to process meeting transcripts after a call ends.
 *
 * This function is triggered by the "meeting/processing" event and performs:
 * 1. Fetches the transcript from Stream's provided URL
 * 2. Parses the JSONL transcript into structured data
 * 3. Enriches transcript items with speaker information (users and AI agents)
 *
 * @param event.data.transcriptUrl - URL to fetch the raw transcript from Stream
 * @param step - Inngest step runner for orchestrating async operations with retries
**/
export const meetingProcessing = inngest.createFunction(
  { id: "meeting/processing" },
  { event: "meeting/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch_transcript", async () => {
      return fetch(event.data.transcriptUrl)
        .then((res) => res.text())
        .catch(() => "error found while fetching transcript");
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeaker = await step.run(
      "add_speaker_info",
      async () => {
        // Extract unique speaker IDs from the transcript
        const speakerIds = [
          ...new Set(transcript.map((item) => item.speaker_id)),
        ];

        // Fetch user details for user participants
        const userSpeaker = await db
          .select()
          .from(user)
          .where(inArray(user.id, speakerIds))
          .then((users) => {
            return users.map((user) => ({
              ...user,
            }));
          });

        // Fetch agent details for AI participants
        const agentSpeaker = await db
          .select()
          .from(agents)
          .where(inArray(agents.id, speakerIds))
          .then((agents) => {
            return agents.map((agent) => ({
              ...agent,
            }));
          });

        const speakers = [...userSpeaker, ...agentSpeaker]; // array ma dono data ko merge kar diya (using spread operator)

        return transcript.map((item) => {
          const speaker = speakers.find((s) => {
            return s.id === item.speaker_id;
          });

          if (!speaker) {
            return {
              ...item,
              user: {
                name: "Unknown",
              },
            };
          }
          // AT that point we know actually who the speaker is
          return {
            ...item,
            user: {
              name: speaker.name,
            },
          };
        });
      }
    );

    const { output } = await step.run("generate_summary", async () => {
      return await summarize.run(
        "Summarize the following: " + JSON.stringify(transcriptWithSpeaker)
      );
    });

    // Save the summary to the database and mark meeting as completed
    await step.run("save_summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });
  }
);
