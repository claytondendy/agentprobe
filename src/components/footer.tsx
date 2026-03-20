export function Footer() {
  return (
    <footer className="px-8 py-12 border-t-[0.5px] border-hairline bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center space-x-12">
          <div className="text-xl font-extrabold tracking-tighter text-charcoal font-headline">AgentProbe</div>
          <div className="flex space-x-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Privacy</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Terms</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Security Policy</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold text-on-surface-variant">
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>
      </div>
    </footer>
  );
}
