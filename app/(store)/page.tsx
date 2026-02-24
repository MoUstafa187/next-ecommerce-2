import { getProducts } from "@/lib/api/products";
import { SpatialVault } from "@/components/ui/SpatialVault";
import { GlitchHero } from "@/components/ui/GlitchHero";

export default async function HomePage() {
    const { products } = await getProducts(30, 0);

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">

            {/* ══════════════════════════════════════
                SECTOR 01 — GLITCH HERO
            ══════════════════════════════════════ */}
            <GlitchHero />

            {/* ══════════════════════════════════════
                SECTOR 02 — SPATIAL VAULT
            ══════════════════════════════════════ */}
            <section className="relative py-24 overflow-hidden" id="vault">
                {/* Ambient background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
                        style={{ background: "radial-gradient(ellipse, rgba(0,255,255,0.04) 0%, transparent 70%)" }} />
                </div>

                {/* Section header */}
                <div className="relative z-10 text-center mb-8 px-4">
                    <p className="text-[10px] tracking-[0.6em] text-[#00ffff]/60 uppercase mb-3 font-mono">
                        ◈ QUANTUM ARTIFACT DATABASE ◈
                    </p>
                    <h2 className="font-playfair text-5xl md:text-7xl font-black tracking-tighter holo-text">
                        THE VAULT
                    </h2>
                    <p className="text-white/20 text-xs tracking-[0.4em] mt-4 uppercase">
                        {products.length} artifacts secured — drag to navigate
                    </p>
                </div>

                {/* Floating scanlines over section */}
                <div className="scanlines absolute inset-0 pointer-events-none z-0" />

                {/* THE SPATIAL PRODUCT EXPERIENCE */}
                <SpatialVault products={products} />
            </section>

            {/* ══════════════════════════════════════
                SECTOR 03 — SYSTEM MANIFEST FOOTER CTA
            ══════════════════════════════════════ */}
            <section className="relative py-32 overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00ffff]/20 to-transparent" />
                </div>
                <div className="text-center relative z-10 px-4">
                    <p className="text-white/10 text-[10px] tracking-[0.8em] uppercase font-mono mb-6">
                        END OF TRANSMISSION
                    </p>
                    <p className="font-playfair text-2xl md:text-4xl text-white/60 font-bold tracking-widest">
                        The future is already obsolete.
                    </p>
                    <div className="mt-8 flex justify-center gap-8 text-[10px] tracking-[0.5em] text-white/20 uppercase font-mono">
                        <span>SYSTEM: ONLINE</span>
                        <span>◈</span>
                        <span>NEURAL LINK: ACTIVE</span>
                        <span>◈</span>
                        <span>YEAR: 2040</span>
                    </div>
                </div>
            </section>

        </div>
    );
}
