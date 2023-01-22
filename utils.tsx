import { isValidName } from "./validators";
export function formatTextToUrlName(text: string): string {
  text = text.toLowerCase();
  let name = text;

  name = name.replace(/[^a-z0-9\-_\s]+/gi, ""); // Replace all invalid characters (except spaces)
  name = name.replace(/\s/g, "-"); // Replace spaces to -

  // double check to be sure
  if (isValidName(name)) {
    return name;
  } else {
    console.error("formatTitleToName function not working");
    return null;
  }
}
