import { useId } from "react";

interface FormInputProps {
  title: string;
  name: string;
  type?: string;
  error?: { msg: string, fields: string[] };
  className?: string;
  required?: boolean;
}

function FormInput({ title, name, type = "text", error = { msg: "", fields: [] }, className = "", required = true }: FormInputProps): JSX.Element {
  const htmlId = useId();

  return (
    <>
      <label htmlFor={htmlId} className="text-xl">
        {title}:
      </label>
      <br />
      <input
        type={type}
        id={htmlId}
        name={name}
        className={
          (error.fields.includes(name) ? "bg-red-500" : "bg-slate-600") +
          " text-lg rounded-md mb-2 w-full" +
          (className ? (" " + className) : "")
        }
        required={required}
      />
    </>
  )
}

export default FormInput