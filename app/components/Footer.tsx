import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-vh-green text-white py-5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Image
          src="/logo.png"
          alt="VeganHearts"
          width={28}
          height={28}
          className="mx-auto mb-2 brightness-0 invert opacity-80"
        />
        <p className="text-xs font-display font-medium text-white/70">
          Vegan Hearts · A non-profit awakening compassion worldwide
        </p>
      </div>
    </footer>
  );
}
