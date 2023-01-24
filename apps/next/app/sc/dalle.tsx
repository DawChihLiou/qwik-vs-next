"use client";

import { ImagesResponse } from "openai";
import { ReactNode, useEffect, useReducer, useRef } from "react";
import { Reducer } from "react";
import ImageGrid from "~/components/ImageGrid";
import PromptList from "~/components/PromptList";
import TextArea from "~/components/TextArea";
import { images as imageFixture } from "~/constants/images";
import { fetchImages } from "~/services/fetchImages";

interface DalleProps {
  children: ReactNode;
}

interface ImageState {
  prompt: string;
  loading: boolean;
  data: ImagesResponse["data"] | null;
}

interface CommitPromptAction {
  type: "commit_prompt";
  payload: string;
}

interface FetchingImageAction {
  type: "fetching";
}

interface FetchImageSuccessAction {
  type: "fetch_successful";
  payload: ImagesResponse;
}

type ImageAction =
  | CommitPromptAction
  | FetchingImageAction
  | FetchImageSuccessAction;

const reducer: Reducer<ImageState, ImageAction> = (state, action) => {
  if (action.type === "commit_prompt") {
    return {
      ...state,
      prompt: action.payload,
    };
  }
  if (action.type === "fetching") {
    return {
      ...state,
      loading: true,
      data: null,
    };
  }
  if (action.type === "fetch_successful") {
    return {
      ...state,
      loading: false,
      data: action.payload?.data ?? null,
    };
  }
  return state;
};

export default function Dalle({ children }: DalleProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [images, dispatch] = useReducer(reducer, {
    prompt: "",
    loading: false,
    data: imageFixture.data,
  });

  const commit = (payload: string) => {
    dispatch({ type: "commit_prompt", payload });
  };

  useEffect(() => {
    if (images.prompt === "") {
      return;
    }
    if (textarea.current) {
      textarea.current.value = images.prompt;
    }
    const controller = new AbortController();

    dispatch({ type: "fetching" });
    fetchImages(images.prompt, controller).then((data) => {
      dispatch({ type: "fetch_successful", payload: data });
    });

    return () => controller.abort();
  }, [images.prompt]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="mb-8">
          <TextArea ref={textarea} onCommit={commit} />
        </div>
        <div className="mb-8">
          <ImageGrid loading={images.loading} data={images.data} />
        </div>
        {children}
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl font-black">Best DALL·E Prompts</h3>
        <a
          href="https://prompthero.com"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-dashed decoration-cyan-400 mb-4"
        >
          by PromptHero
        </a>
        <PromptList onClick={commit} />
      </div>
    </div>
  );
}
