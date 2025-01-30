import Input from "./Input";
import Button from "./Button";
import correo from "../assets/correo.svg";
import lock from "../assets/lock.svg";
const Register = () => {
  return (
    <div className="w-[567px] h-[692px] bg-[#F5F5F5] rounded-[20px] font-poppins text-5xl font-medium flex flex-col items-center box-shadow">
      <h1 className="py-12">Registrar</h1>
      <form action="" className="flex flex-col gap-12">
        <Input
          label="Correo Electrónico"
          icon={correo}
          placeholder="Ingresar su correo electrónico"
        />
        <Input
          label="Contraseña"
          icon={lock}
          placeholder="Ingresar su contraseña"
        />
        <Input
          label="Confirmar Contraseña"
          icon={lock}
          placeholder="Ingrese de nuevo su contraseña"
        />
        <Button text="Guardar" />
      </form>
      <div className="flex text-sm gap-4 justify-center mt-8">
        <p>Ya tienes cuenta </p>
        <span className="text-[#006FFD] font-bold cursor-pointer">
          Inicia Sesión
        </span>
      </div>
    </div>
  );
};

export default Register;
