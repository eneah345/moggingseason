export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image_base64 } = req.body;
  if (!image_base64) return res.status(400).json({ error: "No image provided" });

  const params = new URLSearchParams();
  params.append("api_key", process.env.FACEPP_KEY);
  params.append("api_secret", process.env.FACEPP_SECRET);
  params.append("image_base64", image_base64);
  params.append("return_attributes", "beauty,skinstatus,gender,age");

  const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();
  return res.status(200).json(data);
}
