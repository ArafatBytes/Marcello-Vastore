"use client";
import { useState, forwardRef, useEffect } from "react";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import CountryDropdown from "./country-dropdown";

export const PhoneInput = forwardRef(function PhoneInput({
  className = "",
  onCountryChange,
  onChange,
  value,
  placeholder,
  defaultCountry,
  inline = false,
  ...props
}, ref) {
  const [country, setCountry] = useState();
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (value) {
      try {
        const parsed = parsePhoneNumber(value);
        if (parsed) {
          const found = {
            code: parsed.country,
            callingCode: '+' + parsed.countryCallingCode,
            name: '',
          };
          setCountry(found);
          setNumber(parsed.nationalNumber);
        }
      } catch {}
    } else {
      setNumber("");
    }
  }, [value]);

  const handleCountryChange = (c) => {
    setCountry(c);
    onChange?.({ target: { value: c.callingCode } });
    setNumber("");
  };

  const handleNumberChange = (e) => {
    const num = e.target.value.replace(/\D/g, '');
    setNumber(num);
    if (country) {
      const full = `${country.callingCode}${num}`.replace(/\D/g, '');
      onChange?.({ target: { value: `+${full}` } });
    } else {
      onChange?.(e);
    }
  };

  return (
    <div className={`flex items-center gap-2 relative bg-transparent transition-colors text-base rounded-md border border-[#ede9df] h-11 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed md:text-sm ${inline ? "rounded-l-none w-full" : ""} ${className}`}>
      <CountryDropdown value={country} onChange={handleCountryChange} />
      <input
        ref={ref}
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder || "Enter number"}
        className="flex-1 border border-[#ede9df] rounded px-3 py-2 text-[15px] bg-[#fafafa] focus:outline-none focus:border-[#222]"
        inputMode="tel"
        autoComplete="tel"
        name="phone"
        type="tel"
        {...props}
      />
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";
