export interface TextInputProps {
  labelText: string;
  name: string;
  id?: string;
  type?: "text" | "password" | "email";
  required?: boolean;
  autoComplete?: string;
}

export default function TextInput({
  labelText,
  name,
  id,
  type = "text",
  required = false,
  autoComplete,
}: TextInputProps) {
  return (
    <>
      <label
        htmlFor={id ?? name}
        className="block text-sm text-black font-medium mb-2"
      >
        {labelText}
      </label>
      <input
        type={type}
        id={id ?? name}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </>
  );
}
