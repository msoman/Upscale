import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { authorize, readBody, apiError } from "@/lib/server";
import { validatePrompt } from "@/lib/business";
export const maxDuration = 120;
export async function POST(req: NextRequest) {
  try {
    const auth = await authorize(req, "image");
    if (auth.error) return auth.error;
    let body;
    try {
      body = await readBody(req);
    } catch {
      return NextResponse.json(
        { error: "Invalid or oversized request." },
        { status: 400 },
      );
    }
    if (!validatePrompt(body.prompt))
      return NextResponse.json(
        { error: "Describe your image in 1–4,000 characters." },
        { status: 400 },
      );
    const size = ["1024x1024", "1536x1024", "1024x1536"].includes(body.size)
      ? body.size
      : "1024x1024";
    const result = await new OpenAI().images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt: body.prompt,
      size,
      n: 1,
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64)
      return NextResponse.json(
        { error: "The provider returned no image." },
        { status: 502 },
      );
    const filename = `${auth.user.id}/${crypto.randomUUID()}.png`;
    const { error } = await auth.db.storage
      .from("creative-assets")
      .upload(filename, Buffer.from(b64, "base64"), {
        contentType: "image/png",
        upsert: false,
      });
    if (error)
      return NextResponse.json({
        image: `data:image/png;base64,${b64}`,
        warning:
          "Image generated, but cloud storage failed. Download it now; check the storage migration.",
      });
    const { data: signed } = await auth.db.storage
      .from("creative-assets")
      .createSignedUrl(filename, 3600);
    return NextResponse.json({
      image: `data:image/png;base64,${b64}`,
      path: filename,
      url: signed?.signedUrl,
    });
  } catch (error) {
    return apiError(error);
  }
}
