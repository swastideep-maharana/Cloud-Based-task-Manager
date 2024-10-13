import React from "react";
import clsx from "clsx";

const Textbox = React.forwardRef(
  (
    { type = "text", placeholder, label, classname, register, name, error },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label htmlFor={name} className="text-slate-800 font-medium">
            {label}
          </label>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            {...register}
            aria-invalid={!!error}
            className={clsx(
              "w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out",
              { "border-red-600 focus:ring-red-500": error }, // Error state styles
              classname
            )}
          />
        </div>

        {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
      </div>
    );
  }
);

export default Textbox;
