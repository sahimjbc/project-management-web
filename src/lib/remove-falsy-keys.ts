/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Recursively remove any properties/array elements that are null, undefined,
 * or empty strings. Additionally, if an array is empty, remove it.
 */
function removeFalsyKeys<T extends object | any[]>(obj: T): T {
  const isArray = Array.isArray(obj);
  const newArray: any[] = [];

  for (const key in obj) {
    const value = obj[key];

    if (value === null || value === undefined || value === "") {
      if (!isArray) {
        delete obj[key];
      }
    } else if (typeof value === "object" && value !== null) {
      const newObj = removeFalsyKeys(value);

      if (Array.isArray(newObj) && newObj.length === 0) {
        if (!isArray) {
          delete obj[key];
        }
      } else if (isArray) {
        newArray.push(newObj);
      } else {
        obj[key] = newObj;
      }
    } else if (isArray) {
      newArray.push(value);
    }
  }

  return (isArray ? newArray : obj) as T;
}

export default removeFalsyKeys;
