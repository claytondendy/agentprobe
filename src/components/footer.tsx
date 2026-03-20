import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-8 py-12 border-t-[0.5px] border-hairline bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center space-x-12">
          <Link href="/" className="text-xl font-extrabold tracking-tighter text-charcoal font-headline">AgentProbe</Link>
          <div className="flex space-x-8">
            <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-charcoal transition-colors">Privacy</Link>
            <Link href="/security" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-charcoal transition-colors">Security Policy</Link>
            <Link href="/benchmarks" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-charcoal transition-colors">Benchmarks</Link>
            <Link href="/about" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-charcoal transition-colors">About</Link>
          </div>
        </div>
        <div className="text-[10px] text-on-surface-variant">
          Open source AI agent security scanner
        </div>
      </div>
    </footer>
  );
}
