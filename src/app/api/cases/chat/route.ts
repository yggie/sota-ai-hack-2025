import type { NextRequest } from "next/server";

import { openai } from "../../services";
import { streamText, UIMessage } from "ai";

type CaseEvidence = { type: "website"; url: string; comment: string } | {
    type: "upload";
    blob: string;
};

interface CaseChatBody {
    messages?: UIMessage[];
    evidences: CaseEvidence[];
    instructions: string;
}

export async function POST(req: NextRequest) {
    const body = await req.json() as CaseChatBody;

    const streamResp = await streamText({
        model: openai("gpt-4.1"),
        system: `
        You are a helpful AI legal assistant, who specialises in advising
        ordinary people about whether to pursue legal action and how they can go
        about it. Given the complexity of the topic, where possible, you should
        always provide simple to understand instructions.

        You are provided the following pieces of evidence, decide whether there
        is a case to be had in pursuing this case. Also analyze each piece of
        evidence and provide feedback on how usable these are in court. Where
        possible, provide the evidence packaged up in a way that is suitable in
        court based solely on the provided information. Highlight areas that
        show weakness and suggest accompanying evidence that could make these
        areas of the claim stronger.

        -----------

        ${
            body.evidences.map((ev) => {
                switch (ev.type) {
                    case "upload":
                        break;

                    case "website":
                        return `Website URL: ${ev.url}${
                            ev.comment ? `\nUser comment: ${ev.comment}` : ""
                        }`;
                }
            }).join("\n\n")
        }
        `,
        messages: body.messages,
    });

    return streamResp.toDataStreamResponse();
}
