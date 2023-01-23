import { ImagesResponse } from "openai";

export async function fetchImages(
  term: string,
  controller: AbortController
): Promise<ImagesResponse> {
  const response = await fetch(`/api/images`, {
    signal: controller?.signal,
    method: "POST",
    body: JSON.stringify({
      term,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return { created: -1, data: [] };
  }
  const json = await response.json();
  return json;
}
