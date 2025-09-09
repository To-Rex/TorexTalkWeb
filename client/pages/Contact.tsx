export default function Contact() {
  return (
    <section className="container py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Aloqa</h1>
      <div className="space-y-2 text-sm">
        <div>
          Telefon:{" "}
          <a href="tel:+998995340313" className="underline">
            +99899 534 03 13
          </a>
        </div>
        <div>
          Email:{" "}
          <a href="mailto:dev.dilshodjon@gmail.com" className="underline">
            dev.dilshodjon@gmail.com
          </a>
        </div>
        <div>
          Instagram:{" "}
          <a
            href="https://www.instagram.com/torex.dev/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            @torex.dev
          </a>
        </div>
      </div>
    </section>
  );
}
