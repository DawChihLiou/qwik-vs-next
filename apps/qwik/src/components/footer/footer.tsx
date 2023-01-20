import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="container mx-auto px-4 py-16">
      <p class="text-center">
        Made with ♡ by{" "}
        <a
          href="https://dawchihliou.github.io"
          target="_blank"
          rel="noreferrer"
          class="underline decoration-dashed decoration-cyan-400"
        >
          Daw-Chih Liou
        </a>
      </p>
    </footer>
  );
});
