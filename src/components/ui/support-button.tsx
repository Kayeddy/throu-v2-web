import { BsFillPatchQuestionFill } from "react-icons/bs";

export const SupportButton = () => {
  return (
    <div className="w-10 h-10 hover:w-36  bg-primary hover:bg-secondary text-light text-lg group flex flex-row items-center justify-center hover:p-1 fixed bottom-[300px] z-10 right-12 gap-4 cursor-pointer">
      <BsFillPatchQuestionFill />
      <p className="text-sm hidden group-hover:block">Ayuda y sporte</p>
    </div>
  );
};
