const COS_BASE = import.meta.env.VITE_ASSET_BASE || "";
const APP_BASE = import.meta.env.BASE_URL || "/";

const COS_FOLDERS = [
  "CD贴图",
  "test1",
  "旅行者1号fbx模型",
  "models",
  "frames",
  "music",
  "Cosmicswave",
  "Aboutpage",
  "travel",
];

const encodePathSegments = (fullPath: string) => {
  return fullPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
};

const urlCache = new Map<string, string>();

export const asset = (path: string): string => {
  const cached = urlCache.get(path);
  if (cached) return cached;

  const cleanPath = path.replace(/^\/+/, "");
  const folder = cleanPath.split("/")[0];
  let url: string;

  if (COS_FOLDERS.includes(folder)) {
    url = `${COS_BASE}/${encodePathSegments(cleanPath)}`;
  } else if (cleanPath.startsWith("images/")) {
    url = `${COS_BASE}/${encodePathSegments(cleanPath)}`;
  } else {
    url = `${APP_BASE}${cleanPath}`;
  }

  if (import.meta.env.DEV) {
    console.log("[asset]", url);
  }
  urlCache.set(path, url);
  return url;
};
