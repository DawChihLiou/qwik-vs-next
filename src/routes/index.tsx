import { component$, Resource, useResource$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { images } from "~/constants/images";
import { prompts } from "~/constants/prompts";

interface ImageData {
  created: number;
  data: Record<"url", string>[];
}

export async function fetchImages(
  term: string,
  controller: AbortController
): Promise<ImageData> {
  const response = await fetch(`http://localhost:5173/images`, {
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

export default component$(() => {
  const query = useStore({
    term: "",
  });
  const imageResource = useResource$<ImageData>(({ track, cleanup }) => {
    track(() => query.term);

    const controller = new AbortController();
    cleanup(() => controller.abort());

    if (query.term === "") {
      // controller.abort("empty query");
      return Promise.resolve(images);
    }

    return fetchImages(query.term, controller);
  });

  return (
    <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div class="mb-8">
          <textarea
            rows={5}
            placeholder="Type anything and press ⌘ ⏎ to create images✍️"
            class="mx-auto mt-1 block w-full px-3 py-2 rounded-md shadow-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            value={query.term}
            onKeyDown$={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                query.term = (e.target as HTMLInputElement).value;
              }
            }}
          />
        </div>
        <div class="">
          <div class="flex flex-nowrap lg:flex-none lg:grid lg:grid-cols-3 lg:grid-rows-3 gap-4 justify-center overflow-x-auto pb-4 min-h-full items-center">
            <Resource
              value={imageResource}
              onPending={() => <div>Loading...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(images) => (
                <>
                  {images.data?.map(({ url }) => (
                    <img
                      src={url}
                      alt="AI image created by DALL-E"
                      loading="lazy"
                      class="rounded w-48"
                      width="256"
                      height="256"
                    />
                  ))}
                </>
              )}
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex gap-2 items-center mb-4">
          <h3 class="text-xl font-bold">Best DALL-E Prompts</h3>
          <a
            href="https://prompthero.com"
            target="_blank"
            rel="noreferrer"
            class="underline decoration-dashed decoration-cyan-400"
          >
            by PromptHero
          </a>
        </div>
        {prompts.map((prompt) => (
          <button
            class="flex gap-2 w-full block text-left rounded pl-2 pr-4 py-2 hover:text-slate-700 hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:drop-shadow-xl"
            onClick$={() => (query.term = prompt.text)}
          >
            <span role="img" aria-label="Fire">
              {prompt.views > 599 && "🔥"}
              {prompt.views < 600 && "✨"}
            </span>
            <span>{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Dall·e Demo",
  meta: [
    {
      name: "description",
      content: "A Demo built with Qwik and Dall·e.",
    },
  ],
};
