import React from "react";

interface CustomFileInputProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  handleFileChange,
  disabled,
}) => (
  <div className="relative">
    <label
      htmlFor="file"
      className={`block w-full text-sm text-white border border-gray-300 rounded-lg cursor-pointer bg-orange-500 focus:outline-none py-2 px-4 text-center ${
        disabled ? "bg-gray-400 cursor-not-allowed" : ""
      }`}
    >
      Διαλέξτε φωτογραφία
    </label>
    <input
      id="file"
      name="file"
      type="file"
      onChange={handleFileChange}
      className="hidden"
      disabled={disabled}
    />
  </div>
);

export default CustomFileInput;
