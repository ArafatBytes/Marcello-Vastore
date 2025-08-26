"use client";
import { useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { lookup } from "country-data-list";

const countries = lookup.countries({})
  .filter(c => c.status === "assigned" && c.countryCallingCodes.length)
  .map(c => ({
    name: c.name,
    code: c.alpha2,
    callingCode: c.countryCallingCodes[0],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function CountryDropdown({ value, onChange, className }) {
  return (
    <select
      className={`border border-[#ede9df] rounded bg-[#fafafa] px-2 py-2 text-[15px] focus:outline-none focus:border-[#222] w-44 truncate ${className || ''}`}
      value={value ? value.code : ''}
      onChange={e => {
        const selected = countries.find(c => c.code === e.target.value);
        if (onChange && selected) onChange(selected);
      }}
      aria-label="Country code"
    >
      <option value="">Code</option>
      {countries.map(c => (
        <option key={c.code} value={c.code}>
          {c.name} (+{c.callingCode.replace('+','')})
        </option>
      ))}
    </select>
  );
}
