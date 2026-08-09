
const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
};

export const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => ('0' + Math.round(c).toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const srgbToLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linearToSrgb = (c: number): number => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

const M1 = [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041],
];
const M2 = [
    [0.83516141, 0.36863141, -0.20379282],
    [-0.42885911, 1.0099416, 0.41891751],
    [-0.38028163, -0.26099304, 1.6412746],
];
const M3 = [
    [1, 0.3963377774, 0.2158037573],
    [1, -0.1055613458, -0.0638541728],
    [1, -0.0894841775, -1.291485548],
];
const M4 = [
    [4.0767416621, -3.3077115913, 0.2309699292],
    [-1.2684380046, 2.6097574011, -0.3413193965],
    [-0.0041960863, -0.7034186147, 1.707614701],
];

export function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);
    const lms_ = [
        l + 0.3963377774 * a + 0.2158037573 * b,
        l - 0.1055613458 * a - 0.0638541728 * b,
        l - 0.0894841775 * a - 1.291485548 * b,
    ];
    const lms = lms_.map(val => val * val * val);
    const xyz = [
        M4[0][0] * lms[0] + M4[0][1] * lms[1] + M4[0][2] * lms[2],
        M4[1][0] * lms[0] + M4[1][1] * lms[1] + M4[1][2] * lms[2],
        M4[2][0] * lms[0] + M4[2][1] * lms[1] + M4[2][2] * lms[2],
    ];
    const rgbLinear = [
        M2[0][0] * xyz[0] + M2[0][1] * xyz[1] + M2[0][2] * xyz[2],
        M2[1][0] * xyz[0] + M2[1][1] * xyz[1] + M2[1][2] * xyz[2],
        M2[2][0] * xyz[0] + M2[2][1] * xyz[1] + M2[2][2] * xyz[2],
    ];
    return rgbLinear.map(val => Math.max(0, Math.min(1, linearToSrgb(val))) * 255) as [number, number, number];
}

export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
    const rgbLinear = [srgbToLinear(r / 255), srgbToLinear(g / 255), srgbToLinear(b / 255)];
    const xyz = [
        M1[0][0] * rgbLinear[0] + M1[0][1] * rgbLinear[1] + M1[0][2] * rgbLinear[2],
        M1[1][0] * rgbLinear[0] + M1[1][1] * rgbLinear[1] + M1[1][2] * rgbLinear[2],
        M1[2][0] * rgbLinear[0] + M1[2][1] * rgbLinear[1] + M1[2][2] * rgbLinear[2],
    ];
    const lms = [
        M3[0][0] * xyz[0] + M3[0][1] * xyz[1] + M3[0][2] * xyz[2],
        M3[1][0] * xyz[0] + M3[1][1] * xyz[1] + M3[1][2] * xyz[2],
        M3[2][0] * xyz[0] + M3[2][1] * xyz[1] + M3[2][2] * xyz[2],
    ];
    const lms_ = lms.map(val => Math.cbrt(val));
    const lab = [
        0.2104542553 * lms_[0] + 0.793617785 * lms_[1] - 0.0040720468 * lms_[2],
        1.9779984951 * lms_[0] - 2.428592205 * lms_[1] + 0.4505937099 * lms_[2],
        0.0259040371 * lms_[0] + 0.7827717662 * lms_[1] - 0.808675766 * lms_[2],
    ];
    const l = lab[0];
    const c = Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
    let h = (Math.atan2(lab[2], lab[1]) * 180) / Math.PI;
    if (h < 0) h += 360;
    return [l, c, h];
}

export const hexToOklch = (hex: string): [number, number, number] => {
    const [r, g, b] = hexToRgb(hex);
    return rgbToOklch(r, g, b);
};

const calculateLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const calculateContrastRatio = (rgb1: [number, number, number], rgb2: [number, number, number]): number => {
  const lum1 = calculateLuminance(rgb1);
  const lum2 = calculateLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const parseOklch = (oklchStr: string): { l: number; c: number; h: number } | null => {
    const match = oklchStr.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (!match) return null;
    return { l: parseFloat(match[1]), c: parseFloat(match[2]), h: parseFloat(match[3]) };
};

export const formatOklch = (l: number, c: number, h: number): string => {
    return `oklch(${l.toFixed(3)} ${c.toFixed(4)} ${h.toFixed(2)})`;
};
