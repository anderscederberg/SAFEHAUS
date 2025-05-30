export default async function handler(req, res) {
  const clientId = "1dc0552f56f542a783ce912a74e9d4d2";
  const clientSecret = "c6b40922d78a4a96963ade61f7cf836b";

  const trackId = req.query.id;
  if (!trackId) {
    return res.status(400).json({ error: "Missing track ID" });
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const { access_token } = await tokenRes.json();

    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const track = await trackRes.json();

    res.status(200).json({
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumArt: track.album.images[0]?.url,
      previewUrl: track.preview_url,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch track", detail: err });
  }
}
