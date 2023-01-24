import { component$, Resource, useResource$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { images } from "~/constants/images";
import { prompts } from "~/constants/prompts";
import Card from "~/components/card/card";
import { fetchImages } from "~/services/fetchImages";
import type { ImagesResponse } from "openai";
import { fetchTweets } from "~/services/fetchTweets";
import type { TwitterData } from "~/services/fetchTweets";

export default component$(() => {
  const query = useStore({
    term: "",
  });

  const imageResource = useResource$<ImagesResponse>(({ track, cleanup }) => {
    track(() => query.term);

    const controller = new AbortController();
    cleanup(() => controller.abort());

    if (query.term === "") {
      return Promise.resolve(images);
    }

    return fetchImages(query.term, controller);
  });

  const tweetResource = useResource$<TwitterData>(() => {
    return fetchTweets();
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
              class="textarea textarea-bordered w-full"
              value={query.term}
              onKeyDown$={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  query.term = (e.target as HTMLInputElement).value;
                }
              }}
            />
            <label class="label">
              <span class="label-text-alt" />
              <span class="label-text-alt">
                {"Press "}
                <kbd class="kbd">⌘</kbd> <kbd class="kbd">⏎</kbd>
                {" to create images."}
              </span>
            </label>
          </div>
          <div class="lg:hidden mb-8 carousel space-x-4 rounded-box">
            <Resource
              value={imageResource}
              onPending={() => (
                <>
                  {Array.from("123456789").map((v) => (
                    <div key={v} class="animate-pulse carousel-item">
                      <div class="rounded-box bg-slate-700 h-48 w-48"></div>
                    </div>
                  ))}
                </>
              )}
              onResolved={(images) => (
                <>
                  {images.data?.map(({ url }) => (
                    <div key={url} class="carousel-item">
                      <img
                        src={url}
                        alt="AI image created by DALL·E"
                        loading="lazy"
                        width="256"
                        height="256"
                        class="rounded-box"
                      />
                    </div>
                  ))}
                </>
              )}
            />
          </div>
          <div class="mb-8">
            <div class="hidden lg:grid grid-cols-3 grid-rows-3 gap-4 justify-start overflow-x-auto pb-4 items-center">
              <Resource
                value={imageResource}
                onPending={() => (
                  <>
                    {Array.from("123456789").map((v) => (
                      <div key={v} class="animate-pulse flex gap-4">
                        <div class="rounded bg-slate-700 h-48 w-full"></div>
                      </div>
                    ))}
                  </>
                )}
                onResolved={(images) => (
                  <>
                    {images.data?.map(({ url }) => (
                      <img
                        src={url}
                        alt="AI image created by DALL·E"
                        loading="lazy"
                        class="rounded"
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
            <div class="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
              <Resource
                value={tweetResource}
                onPending={() => (
                  <>
                    {Array.from("1234").map((v) => (
                      <div key={v} class="animate-pulse carousel-item">
                        <div class="rounded-box bg-slate-700 h-48 w-80"></div>
                      </div>
                    ))}
                  </>
                )}
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
                        <div key={t.id} class="carousel-item">
                          <Card
                            key={t.id}
                            media={media}
                            user={user}
                            text={t.text}
                          />
                        </div>
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
      content: "A Demo built with Qwik and DALL·E.",
    },
  ],
};
