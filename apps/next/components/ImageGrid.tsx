import { ImagesResponse } from "openai";

interface ImageGridProps {
  loading?: boolean;
  data?: ImagesResponse["data"] | null;
}
export default function ImageGrid({ loading, data }: ImageGridProps) {
  return (
    <>
      {/* mobile */}
      <div className="lg:hidden carousel space-x-4 rounded-box">
        {loading &&
          Array.from("123456789").map((v) => (
            <div key={v} className="animate-pulse carousel-item">
              <div className="rounded-box bg-slate-700 h-48 w-48"></div>
            </div>
          ))}
        {data?.map(({ url }) => (
          <div key={url} className="carousel-item">
            {/*  eslint-disable @next/next/no-img-element */}
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
      {/* desktop */}
      <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-4 justify-start overflow-x-auto pb-4 items-center">
        {loading &&
          Array.from("123456789").map((v) => (
            <div key={v} className="animate-pulse flex gap-4">
              <div className="rounded bg-slate-700 h-48 w-full"></div>
            </div>
          ))}
        {data?.map(({ url }) => (
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
    </>
  );
}
