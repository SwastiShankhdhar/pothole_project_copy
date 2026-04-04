export const detectPothole = async (lat, lng) => {
  const res = await fetch("http://localhost:8000/api/detection/camera/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude: lat,
      longitude: lng,
      image_base64: ""   // temporary (important fix below)
    }),
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
};