import { component$, Resource, useResource$, useStore } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import type { RequestHandler, DocumentHead } from "@builder.io/qwik-city";
import { Client } from "twitter-api-sdk";
import type {
  TwitterResponse,
  tweetsRecentSearch,
} from "twitter-api-sdk/dist/types";
import { images } from "~/constants/images";
import { prompts } from "~/constants/prompts";
import Card from "~/components/card/card";

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

interface TwitterData {
  data: TwitterResponse<tweetsRecentSearch>["data"];
  includes: TwitterResponse<tweetsRecentSearch>["includes"];
  errors: TwitterResponse<tweetsRecentSearch>["errors"];
}

export const onGet: RequestHandler<TwitterData> = async () => {
  const client = new Client(import.meta.env.VITE_TWITTER_API_TOKEN as string);
  const { data, includes, errors } = await client.tweets.tweetsRecentSearch({
    query: "(#dalle OR #dalle2) has:media",
    "tweet.fields": ["attachments"],
    expansions: ["attachments.media_keys", "author_id"],
    "media.fields": [
      "alt_text",
      "preview_image_url",
      "promoted_metrics",
      "public_metrics",
      "type",
      "url",
      "height",
      "width",
    ],
    "user.fields": ["name", "username", "profile_image_url", "url"],
  });

  return {
    data,
    includes,
    errors,
  };
};

export default component$(() => {
  const query = useStore({
    term: "",
  });

  // server side rendering data
  const twitterData = useEndpoint<TwitterData>();

  // client side rendering data
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
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-black mb-2">Qwik & DALL·E Demo</h1>
        <h2 class="">
          Using Qwik to create this fully interactive website with Server Side
          and Client Side hybrid rendering methods.
        </h2>
      </div>
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div class="mb-8">
            <textarea
              rows={5}
              placeholder="Enter your prompt and press ⌘ ⏎ to create images✍️"
              class="mx-auto mt-1 block w-full px-3 py-2 rounded-md shadow-lg bg-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              value={query.term}
              onKeyDown$={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  query.term = (e.target as HTMLInputElement).value;
                }
              }}
            />
          </div>
          <div class="mb-8">
            <div class="flex flex-nowrap lg:flex-none lg:grid lg:grid-cols-3 lg:grid-rows-3 gap-4 justify-start overflow-x-auto pb-4 min-h-full items-center">
              <Resource
                value={imageResource}
                onPending={() => <div>Loading...</div>}
                onRejected={(reason) => <div>Error: {reason}</div>}
                onResolved={(images) => (
                  <>
                    {images.data?.map(({ url }) => (
                      <img
                        src={url}
                        alt="AI image created by DALL·E"
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
          <div class="w-full overflow-x-hidden">
            <h3 class="text-2xl font-black mb-4">Latest Tweets about Dall·E</h3>
            <div class="flex flex-nowrap items-start gap-2 overflow-x-auto">
              <Resource
                value={twitterData}
                onPending={() => <div>Loading...</div>}
                onRejected={() => <div>Error</div>}
                onResolved={({ data, includes }) => (
                  <>
                    {data?.map((t) => {
                      const user = includes?.users?.find(
                        (u) => u.id === t.author_id
                      );
                      const media = includes?.media?.find((m) =>
                        t.attachments?.media_keys?.includes(m.media_key ?? "")
                      );
                      return (
                        <Card
                          key={t.id}
                          media={media}
                          user={user}
                          text={t.text}
                        />
                      );
                    })}
                  </>
                )}
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="mb-4">
            <h3 class="text-2xl font-black">Best DALL·E Prompts</h3>
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
                {prompt.views > 499 && "🔥"}
                {prompt.views < 500 && "✨"}
              </span>
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik DALL·E Demo",
  meta: [
    {
      name: "description",
      content: "A Demo built with Qwik and Dall·e.",
    },
  ],
};
