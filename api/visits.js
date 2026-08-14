let count = 0;

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ count });
  }

  if (req.method === "POST") {
    count += 1;
    return res.status(200).json({ count });
  }

  return res.status(405).json({ error: "Method not allowed." });
}