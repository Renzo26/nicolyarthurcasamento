const Versiculo = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[hsl(30,15%,15%)] px-6 py-20">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      <div className="relative z-10 mx-auto max-w-2xl text-center text-white animate-fade-in opacity-0">
        <p className="font-script text-4xl text-[hsl(36,55%,80%)] sm:text-5xl">
          Em nome do amor
        </p>
        <div className="mx-auto my-8 h-px w-24 bg-[hsl(36,55%,80%)]/60" />
        <p className="font-serif-display text-2xl italic leading-relaxed sm:text-3xl">
          “Assim, eles já não são dois, mas sim uma só carne.
          <br className="hidden sm:block" />
          Portanto, o que Deus uniu, ninguém separe.”
        </p>
        <p className="mt-6 text-sm uppercase tracking-[0.4em] text-white/80">
          Mateus 19:6
        </p>
      </div>
    </section>
  );
};

export default Versiculo;