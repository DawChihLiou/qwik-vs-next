import { Client } from "twitter-api-sdk";
import type {
  TwitterResponse,
  tweetsRecentSearch,
} from "twitter-api-sdk/dist/types";

export interface TwitterData {
  data: TwitterResponse<tweetsRecentSearch>["data"];
  includes: TwitterResponse<tweetsRecentSearch>["includes"];
  errors: TwitterResponse<tweetsRecentSearch>["errors"];
}

export async function fetchTweets(): Promise<TwitterData> {
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
}
