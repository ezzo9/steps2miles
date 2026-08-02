export default function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="h-1 w-10 rounded-full bg-rust" />
      <h2 className="font-display text-2xl uppercase tracking-wide text-forest">
        {children}
      </h2>
    </div>
  );
}
