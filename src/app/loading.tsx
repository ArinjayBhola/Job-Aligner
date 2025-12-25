export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-bold text-xs">AI</div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
