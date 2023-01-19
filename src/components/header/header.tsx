import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";

export default component$(() => {
  return (
    <header class="container mx-auto px-4 py-8">
      <div class="flex gap-2">
        <a href="/" title="demo">
          <QwikLogo />
        </a>
      </div>
      <ul></ul>
    </header>
  );
});
