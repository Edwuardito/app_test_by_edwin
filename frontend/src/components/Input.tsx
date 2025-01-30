const Input = ({
  label,
  icon,
  placeholder,
}: {
  label: string;
  icon: string;
  placeholder: string;
}) => {
  return (
    <div className="flex flex-col text-left gap-4">
      <label className="text-md text-[#313131]">{label}</label>
      <div className="flex items-center bg-white h-[55px] w-[390px] gap-[20px] px-4 rounded-2xl">
        <img
          src={icon}
          alt={label}
          className="w-[24px] h-[20px] text-[#808080]"
        />
        <input
          className="text-md text-[#808080] w-full focus:outline-none"
          placeholder={placeholder}
        ></input>
      </div>
    </div>
  );
};

export default Input;
