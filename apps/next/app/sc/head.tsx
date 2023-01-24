export default function Head({ params }: { params: { slug: string } }) {
  return (
    <>
      <title>Next DALL·E Demo</title>
      <meta
        name="description"
        content="A Demo built with Next.js and DALL·E."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.svg" />
    </>
  );
}
