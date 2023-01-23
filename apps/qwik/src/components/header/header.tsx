import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";

export default component$(() => {
  return (
    <header class="navbar bg-base-100 py-8 px-0">
      <div class="flex-1">
        <a href="/" class="btn btn-ghost normal-case text-xl">
          <QwikLogo />
        </a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <img src="/github.svg" alt="Link to repository" class="w-16" />
          </li>
        </ul>
      </div>
    </header>
  );
});
