import Image from "next/image";
import { components } from "twitter-api-sdk/dist/types";

interface CardProps {
  media?: components["schemas"]["Media"];
  user?: components["schemas"]["User"];
  text: string;
}

export default function Card({ media, user, text }: CardProps) {
  return (
    <div className="card w-80 bg-base-100 shadow-xl flex-none">
      <figure>
        <Image
          // @ts-ignore typing error in `twitter-api-sdk`
          src={media?.url}
          alt="Twitter media"
          width={media?.width}
          height={media?.height}
          loading="lazy"
        />
      </figure>
      <div className="card-body">
        <div className="flex gap-2">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <Image
                src={user?.profile_image_url ?? ""}
                alt={user?.username ?? "Avatar"}
                width={24}
                height={24}
              />
            </div>
          </div>
          <div>
            <a
              className="text-sm font-bold underline decoration-dashed decoration-cyan-400"
              href={`https://twitter.com/${user?.username}`}
            >
              {user?.name}
            </a>
            <p className="text-sm text-slate-400">@{user?.username}</p>
          </div>
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
}
