import { useMemo, useState } from "react";

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function useAdoptionState() {
  const [records, setRecords] = useState([]);

  const actions = useMemo(
    () => ({
      isAdopted(originalName) {
        return records.some(
          (record) =>
            record.originalName.toLowerCase() === originalName.toLowerCase()
        );
      },
      displayName(originalName) {
        const found = records.find(
          (record) =>
            record.originalName.toLowerCase() === originalName.toLowerCase()
        );
        return found?.displayName ?? originalName;
      },
      contactByDisplayName(displayName) {
        return records.find((record) => record.displayName === displayName)?.phone ?? "";
      },
      adopt(originalName, phone, customName) {
        const base = capitalize(originalName);
        const custom = customName.trim();
        const displayName = custom ? `${capitalize(custom)} the ${base}` : base;
        setRecords((prev) => {
          const next = prev.filter(
            (record) =>
              record.originalName.toLowerCase() !== originalName.toLowerCase()
          );
          next.push({ originalName, displayName, phone });
          return next;
        });
      },
      removeByDisplayName(displayName) {
        setRecords((prev) =>
          prev.filter((record) => record.displayName !== displayName)
        );
      },
    }),
    [records]
  );

  return { records, ...actions };
}
