const dir = "../../data";

export const loadFile = async <T>(file: string): Promise<T> => {
  const path = `${dir}/${file}`;
  const response = await fetch(path);
  return await response.json();
};
