/**
 * Full-screen loading spinner with IBM-brand styling.
 * Used as a Suspense fallback or route-transition indicator.
 */
export default function Loader({ message = 'Loading…', fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]'
    : 'flex flex-col items-center justify-center py-24';

  return (
    <div className={wrapper} role="status" aria-live="polite">
      {/* Animated concentric rings */}
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full border-2 border-[#4589ff]/20" />
        <span className="absolute inset-0 rounded-full border-2 border-t-[#4589ff] animate-spin" />
        <span className="absolute inset-2 rounded-full border-2 border-t-[#be95ff] animate-spin [animation-duration:0.75s]" />
        <span className="absolute inset-4 rounded-full border-2 border-t-[#33b1ff] animate-spin [animation-duration:0.5s]" />
      </div>
      <p className="mt-6 text-sm text-[#8d8d8d] tracking-wide">{message}</p>
    </div>
  );
}
