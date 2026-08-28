import { proxyBackend } from "./_proxy.js";

export default function handler(req, res) {
  return proxyBackend(req, res, "/callback");
}
