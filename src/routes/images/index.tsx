import type { RequestHandler } from "@builder.io/qwik-city";
import { Configuration, OpenAIApi } from "openai";
import type { ImagesResponse } from "openai";

interface ImageRequestBody {
  term: string;
}

export const onPost: RequestHandler<ImagesResponse> = async ({ request }) => {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_STABILITYAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const parsed: ImageRequestBody = await request.json();
  const response = await openai.createImage({
    prompt: parsed.term,
    n: 9,
    size: "256x256",
  });

  return response.data;
};
