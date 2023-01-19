import { component$, Slot } from "@builder.io/qwik";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";

export default component$(() => {
  return (
    <div class="min-h-screen">
      <Header />
      <main class="h-full">
        <section>
          <Slot />
        </section>
      </main>
      <Footer />
    </div>
  );
});
