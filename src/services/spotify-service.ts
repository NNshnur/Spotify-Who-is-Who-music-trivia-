import fetchFromSpotify from "../services/api";

/**
 * Requests a single artist
 *
 * @param  {string} token       The auth token
 * @param  {string} genre       The genre to fetch an artist for
 *
 * @return {object}             The response data
 */
export const getArtist = async (token: string, genre: string) => {
  const response = await fetchFromSpotify({
    token: token,
    endpoint: "recommendations/",
    params: { seed_genres: genre, limit: 1, market: "US" },
  });
  return response.tracks[0].artists[0];
};

/**
 * Requests a single artist
 *
 * @param  {string} token       The auth token
 * @param  {string} genre       The genre to fetch an artist for
 *
 * @return {object}             The response data
 */
export const getArtists = async (
  token: string,
  genre: string,
  amount: number
) => {
  const response = await fetchFromSpotify({
    token: token,
    endpoint: "recommendations/",
    params: { seed_genres: genre, limit: amount },
  });
  let artists = response.tracks[0].artists[0];
  for (let i = 1; i < amount; i++) {
    artists = { ...artists, ...response.tracks[i].artists[0] };
  }
  return artists;
};

/**
 * Requests a list of related artists for an artist
 *
 * @param  {string} token       The auth token
 * @param  {string} artistId    The artist id to fetch related artists for
 *
 * @return {object}             The response data
 */
export const getRelatedArtists = async (token: string, artistId: string) => {
  const response = await fetchFromSpotify({
    token: token,
    endpoint: "artists/" + artistId + "/related-artists/",
  });
  return response;
};

/**
 * Requests an artist's top songs
 *
 * @param  {string} token       The auth token
 * @param  {string} artistId    The artist id to fetch songs for
 *
 * @return {object}             The response data
 */
export const getSongs = async (token: string, artistId: string) => {
  const response = await fetchFromSpotify({
    token: token,
    endpoint: "artists/" + artistId + "/top-tracks/",
    params: { market: "US" },
  });
  return response;
};
