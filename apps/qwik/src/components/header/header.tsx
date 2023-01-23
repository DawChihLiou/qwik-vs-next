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
            <a
              href="https://github.com/DawChihLiou/qwik-vs-next"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
