

export const getTMDBPersonImages = async (nconst) => {
  try {
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    console.log("TMDB API Key:", import.meta.env.VITE_TMDB_API_KEY);
    if (!TMDB_API_KEY) {
      console.error("TMDB API Key is missing in environment variables.");
      return { tmdbId: null, profiles: [] };
    }

    // Find person by IMDb nconst
    const res = await fetch(
      `https://api.themoviedb.org/3/find/${nconst}?external_source=imdb_id&api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();

    if (data.person_results && data.person_results.length > 0) {
      const tmdbId = data.person_results[0].id;

      // Fetch profile images
      const imagesRes = await fetch(
        `https://api.themoviedb.org/3/person/${tmdbId}/images?api_key=${TMDB_API_KEY}`
      );
      const imagesData = await imagesRes.json();

      return { tmdbId, profiles: imagesData.profiles || [] };
    }

    return { tmdbId: null, profiles: [] };
  } catch (err) {
    console.error("Error fetching TMDB person images:", err);
    return { tmdbId: null, profiles: [] };
  }
};
