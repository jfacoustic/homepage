export interface TextAreaProps {
  labelText: string;
  name: string;
  id?: string | undefined;
}
export default function TextArea({ labelText, name, id }: TextAreaProps) {
  return (
    <>
      <label
        htmlFor={id ?? name}
        className="block text-sm text-black font-medium mb-2"
      >
        {labelText}
      </label>
      <textarea
        id={id ?? name}
        name={name}
        rows={4}
        required
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </>
  );
}
