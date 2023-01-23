// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import type { ImagesResponse } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImagesResponse>
) {
  if (req.method !== "POST") {
    res.status(404);
  }
  const configuration = new Configuration({
    apiKey: process.env.STABILITYAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createImage({
    prompt: req.body.term,
    n: 9,
    size: "256x256",
  });

  res.status(200).json(response.data);
}
