import { Suspense } from "react";
import TwitterCarousel from "~/components/TwitterCarousel";
import TwitterSkeleton from "~/components/TwitterSkeleton";
import { fetchTweets } from "~/services/fetchTweets";
import Dalle from "./dalle";

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
      <Dalle>
        <div className="w-full">
          <h3 className="text-2xl font-black mb-4">
            Latest Tweets about Dall·E
          </h3>
          <Suspense fallback={<TwitterSkeleton />}>
            <TwitterCarousel twitter={tweets} />
          </Suspense>
        </div>
      </Dalle>
    </>
  );
}
