const DEFAULT_BACKEND_URL =
  "https://b40cf1b2-011e-4a03-ae0b-efdf4e7b2447-00-j4vt3ckq1dfg.archer.replit.dev/";

export async function proxyBackend(req, res, backendPath) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Only GET requests are supported." });
    return;
  }

  const backendUrl = (
    process.env.BACKEND_URL || DEFAULT_BACKEND_URL
  ).replace(/\/$/, "");
  const requestUrl = new URL(req.url || "/", "https://spo-ruby.vercel.app");

  try {
    const response = await fetch(`${backendUrl}${backendPath}${requestUrl.search}`, {
      method: "GET",
      headers: {
        Cookie: req.headers.cookie || "",
        Accept: "application/json",
      },
      redirect: "manual",
    });

    const contentType =
      response.headers.get("content-type") || "application/json";
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) res.setHeader("Set-Cookie", setCookie);
    res.status(response.status);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", contentType);
    res.send(await response.text());
  } catch {
    res.status(502).json({
      error: "The Spotify backend is not reachable right now.",
    });
  }
}
