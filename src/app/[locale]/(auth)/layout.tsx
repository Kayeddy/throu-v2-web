export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex items-center justify-center font-sans bg-[#F7FAFF]">
      {children}
    </main>
  );
}
