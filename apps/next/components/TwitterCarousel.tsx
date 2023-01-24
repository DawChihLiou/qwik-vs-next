import { useMemo } from "react";
import {
  tweetsRecentSearch,
  TwitterResponse,
} from "twitter-api-sdk/dist/types";
import { keyBy } from "~/utils/keyBy";
import Card from "./Card";

interface TwitterCarouselProps {
  twitter: {
    data: TwitterResponse<tweetsRecentSearch>["data"];
    includes: TwitterResponse<tweetsRecentSearch>["includes"];
    errors: TwitterResponse<tweetsRecentSearch>["errors"];
  };
}

export default function TwitterCarousel({ twitter }: TwitterCarouselProps) {
  const users = useMemo(
    () => keyBy("id")(twitter.includes?.users ?? []),
    [twitter.includes?.users]
  );
  const media = useMemo(
    () => keyBy("media_key")(twitter.includes?.media ?? []),
    [twitter.includes?.media]
  );
  return (
    <div className="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
      {twitter.data?.map((t) => {
        const user = users[t.author_id ?? ""];
        const medium = media[t.attachments?.media_keys?.[0] ?? ""];
        return (
          <div key={t.id} className="carousel-item">
            <Card media={medium} user={user} text={t.text} />
          </div>
        );
      })}
    </div>
  );
}
