export default function BlurOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-20 h-full w-full bg-transparent backdrop-blur-sm lg:mt-14">
      {children}
    </div>
  );
}
