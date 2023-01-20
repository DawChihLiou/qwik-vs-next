import { component$ } from "@builder.io/qwik";
import type { components } from "twitter-api-sdk/dist/types";

interface CardProps {
  media?: components["schemas"]["Media"];
  user?: components["schemas"]["User"];
  text: string;
}

export default component$(({ media, user, text }: CardProps) => {
  return (
    <div class="card w-80 bg-base-100 shadow-xl flex-none">
      <figure>
        <img
          // @ts-ignore typing error in `twitter-api-sdk`
          src={media?.url}
          alt="Twitter media"
          width={media?.width}
          height={media?.height}
          loading="lazy"
        />
      </figure>
      <div class="card-body">
        <div class="flex gap-2">
          <div class="avatar">
            <div class="w-16 rounded-full">
              <img src={user?.profile_image_url} alt={user?.username} />
            </div>
          </div>
          <div>
            <a
              class="text-sm font-bold underline decoration-dashed decoration-cyan-400"
              href={`https://twitter.com/${user?.username}`}
            >
              {user?.name}
            </a>
            <p class="text-sm text-slate-400">@{user?.username}</p>
          </div>
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
});
