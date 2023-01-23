/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import Head from "next/head";
import { ImagesResponse } from "openai";
import { KeyboardEventHandler, useReducer, useRef, useState } from "react";
import { Reducer } from "react";
import { Client } from "twitter-api-sdk";
import {
  tweetsRecentSearch,
  TwitterResponse,
} from "twitter-api-sdk/dist/types";
import Card from "~/components/Card";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { images as imageFixture } from "~/constants/images";
import { prompts } from "~/constants/prompts";
import { fetchImages } from "~/services/fetchImages";

export const getServerSideProps: GetServerSideProps = async () => {
  const client = new Client(process.env.TWITTER_API_TOKEN as string);
  const { data, includes, errors } = await client.tweets.tweetsRecentSearch({
    query: "(#dalle OR #dalle2) has:media",
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
    props: {
      twitter: {
        data: data ?? null,
        includes: includes ?? null,
        errors: errors ?? null,
      },
    },
  };
};

interface HomeProps {
  twitter: {
    data: TwitterResponse<tweetsRecentSearch>["data"];
    includes: TwitterResponse<tweetsRecentSearch>["includes"];
    errors: TwitterResponse<tweetsRecentSearch>["errors"];
  };
}

interface ImageState {
  loading: boolean;
  data: ImagesResponse["data"] | null;
}

interface ImageAction {
  type: "fetching" | "successful";
  payload?: ImagesResponse;
}

const reducer: Reducer<ImageState, ImageAction> = (state, action) => {
  if (action.type === "fetching") {
    return {
      loading: true,
      data: null,
    };
  }
  if (action.type === "successful") {
    return {
      loading: false,
      data: action.payload?.data ?? null,
    };
  }

  throw Error("Unknown action: " + action.type);
};

export default function Home({ twitter }: HomeProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [images, dispatch] = useReducer(reducer, {
    loading: false,
    data: imageFixture.data,
  });

  const onSelect = (value: string) => {
    if (!textarea.current) {
      return;
    }
    textarea.current.value = value;
  };

  const commit: KeyboardEventHandler = async (e) => {
    if (e.key === "Enter" && e.metaKey) {
      const prompt = textarea.current?.value ?? "";

      if (prompt === "") {
        return;
      }
      dispatch({ type: "fetching" });
      const data = await fetchImages(prompt, new AbortController());
      dispatch({ type: "successful", payload: data });
    }
  };

  return (
    <>
      <Head>
        <title>Next DALL·E Demo</title>
        <meta
          name="description"
          content="A Demo built with Next.js and DALL·E."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main onKeyDown={commit}>
        <Header />
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">Qwik & DALL·E Demo</h1>
            <h2>
              Using Next.js to create this fully interactive website with Server
              Side and Client Side hybrid rendering methods.
            </h2>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <textarea
                  ref={textarea}
                  rows={5}
                  placeholder="Enter your prompt and press ⌘ ⏎ to create images✍️"
                  className="textarea textarea-bordered w-full"
                />
                <label className="label">
                  <span className="label-text-alt" />
                  <span className="label-text-alt">
                    {"Press "}
                    <kbd className="kbd">⌘</kbd> <kbd className="kbd">⏎</kbd>
                    {" to create images."}
                  </span>
                </label>
              </div>
              <div className="lg:hidden mb-8 carousel space-x-4 rounded-box">
                {images?.loading &&
                  Array.from("123456789").map((v) => (
                    <div key={v} className="animate-pulse carousel-item">
                      <div className="rounded-box bg-slate-700 h-48 w-48"></div>
                    </div>
                  ))}
                {images?.data?.map(({ url }) => (
                  <div key={url} className="carousel-item">
                    <img
                      src={url}
                      alt="AI image created by DALL·E"
                      loading="lazy"
                      width="256"
                      height="256"
                      className="rounded-box"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-4 justify-start overflow-x-auto pb-4 items-center">
                  {images?.loading &&
                    Array.from("123456789").map((v) => (
                      <div key={v} className="animate-pulse flex gap-4">
                        <div className="rounded bg-slate-700 h-48 w-full"></div>
                      </div>
                    ))}
                  {images?.data?.map(({ url }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={url}
                      src={url}
                      alt="AI image created by DALL·E"
                      loading="lazy"
                      className="rounded"
                      width="256"
                      height="256"
                    />
                  ))}
                </div>
              </div>
              <div className="w-full overflow-x-hidden">
                <h3 className="text-2xl font-black mb-4">
                  Latest Tweets about Dall·E
                </h3>
                <div className="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
                  {twitter.data?.map((t) => {
                    const user = twitter.includes?.users?.find(
                      (u) => u.id === t.author_id
                    );
                    const media = twitter.includes?.media?.find((m) =>
                      t.attachments?.media_keys?.includes(m.media_key ?? "")
                    );
                    return (
                      <div key={t.id} className="carousel-item">
                        <Card media={media} user={user} text={t.text} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-black">Best DALL·E Prompts</h3>
                <a
                  href="https://prompthero.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dashed decoration-cyan-400"
                >
                  by PromptHero
                </a>
              </div>
              {prompts.map((prompt) => (
                <button
                  key={prompt.url + prompt.views}
                  className="flex gap-2 w-full block text-left rounded pl-2 pr-4 py-2 hover:text-slate-700 hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:drop-shadow-xl"
                  onClick={() => onSelect(prompt.text)}
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
        <Footer />
      </main>
    </>
  );
}
