export function getInitials(fullName) {
  const names = fullName.split(" ");
  const initials = names.map((name) => name[0].toUpperCase());
  const initialsStr = initials.join("");

  return initialsStr;
}
