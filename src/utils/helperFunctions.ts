export const isValidOtpFormat = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/; // Regular expression to match a 6-digit number
  return otpRegex.test(otp);
};

export const isValidPhone = (value: unknown): value is string => {
  return typeof value === "string" && /^\+?[0-9]+$/.test(value.trim());
};
