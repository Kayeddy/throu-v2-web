import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen h-screen flex items-center justify-center lg:p-4 my-10 lg:py-0">
      <SignUp />
    </div>
  );
}
