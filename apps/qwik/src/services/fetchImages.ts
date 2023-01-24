import type { ImagesResponse } from "openai";

export async function fetchImages(
  term: string,
  controller?: AbortController
): Promise<ImagesResponse> {
  const response = await fetch(`http://localhost:4173/images`, {
    signal: controller?.signal,
    method: "POST",
    body: JSON.stringify({
      term,
    }),
  });
  if (!response.ok) {
    return { created: -1, data: [] };
  }
  const json = await response.json();
  return json;
}
