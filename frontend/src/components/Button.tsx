const Button = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center justify-center bg-[#006FFD] h-[55px] w-[390px] px-4 rounded-2xl cursor-pointer">
      <p className="text-[#ffffff] text-[16px]">{text}</p>
    </div>
  );
};

export default Button;
