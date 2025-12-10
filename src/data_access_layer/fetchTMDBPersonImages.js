// fetchTMDBPersonImages.js
export const getTMDBPersonImages = async (nconst) => {
  try {
    const TMDB_API_KEY = "53fca71116f59200c250ddf587ccea1b";

    if (!TMDB_API_KEY) {
      console.error("TMDB API Key is missing. Add REACT_APP_TMDB_API_KEY in your .env");
      return [];
    }

    // Find the person in TMDB using IMDb nconst
    const res = await fetch(
      `https://api.themoviedb.org/3/find/${nconst}?external_source=imdb_id&api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();

    if (data.person_results && data.person_results.length > 0) {
      const tmdbId = data.person_results[0].id;

      // Fetch profile images for that person
      const imagesRes = await fetch(
        `https://api.themoviedb.org/3/person/${tmdbId}/images?api_key=${TMDB_API_KEY}`
      );
      const imagesData = await imagesRes.json();

      // Return array of profile images
      return imagesData.profiles || [];
    }

    return [];
  } catch (err) {
    console.error("Error fetching TMDB person images:", err);
    return [];
  }
};
