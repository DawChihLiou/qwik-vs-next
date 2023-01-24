import { Suspense } from "react";
import { fetchTweets } from "~/services/fetchTweets";
import Home from "./home";

export default async function Page() {
  const tweets = await fetchTweets();
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Qwik & DALL·E Demo</h1>
        <h2>
          Using Next.js and React Server Components to create this fully
          interactive website with Server Side and Client Side hybrid rendering
          methods.
        </h2>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <Home twitter={tweets} />
      </Suspense>
    </>
  );
}
