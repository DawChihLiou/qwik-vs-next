import { GetServerSideProps } from "next";
import Head from "next/head";
import { startTransition, useState } from "react";
import { Client } from "twitter-api-sdk";
import {
  tweetsRecentSearch,
  TwitterResponse,
} from "twitter-api-sdk/dist/types";
import Card from "~/components/Card";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import TextArea from "~/components/TextArea";
import { prompts } from "~/constants/prompts";

export const getServerSideProps: GetServerSideProps = async () => {
  const client = new Client(process.env.TWITTER_API_TOKEN as string);
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

export default function Home({ twitter }: HomeProps) {
  const [prompt, setPrompt] = useState<string>("");

  const handleChange = (prompt: string) => {
    startTransition(() => {
      setPrompt(prompt);
    });
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
      <main>
        <Header />
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">Qwik & DALL·E Demo</h1>
            <h2>
              Using Qwik to create this fully interactive website with Server
              Side and Client Side hybrid rendering methods.
            </h2>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <TextArea
                  defaultValue={prompt}
                  onChange={handleChange}
                  onCommit={() => {}}
                />
              </div>
              <div className="mb-8">
                <div className="flex flex-nowrap lg:flex-none lg:grid lg:grid-cols-3 lg:grid-rows-3 gap-4 justify-start overflow-x-auto pb-4 min-h-full items-center">
                  {/* <Resource
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
                            className="rounded w-48"
                            width="256"
                            height="256"
                          />
                        ))}
                      </>
                    )}
                  /> */}
                </div>
              </div>
              <div className="w-full overflow-x-hidden">
                <h3 className="text-2xl font-black mb-4">
                  Latest Tweets about Dall·E
                </h3>
                <div className="flex flex-nowrap items-start gap-2 overflow-x-auto">
                  {twitter.data?.map((t) => {
                    const user = twitter.includes?.users?.find(
                      (u) => u.id === t.author_id
                    );
                    const media = twitter.includes?.media?.find((m) =>
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
                  onClick={() => handleChange(prompt.text)}
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
