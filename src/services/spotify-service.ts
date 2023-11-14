import fetchFromSpotify from "../services/api";

/**
 * Requests a single artist
 *
 * @param  {string} token       The auth token
 * @param  {string} genre       The genre to fetch an artist for
 * @param  {string} market      The market to fetch an artist for
 *
 * @return {object}             A single artist object
 */
export const getArtist = async (
  token: string,
  genre: string,
  market: string
) => {
  const response = await getArtists(token, genre, 1, market);
  return response[0];
};

/**
 * Requests a list of artists
 *
 * @param  {string} token       The auth token
 * @param  {string} genre       The genre to fetch a list of artists for
 * @param  {number} amount      The number of artists to fetch
 * @param  {string} market      The market to fetch an artist for
 *
 * @return {object}             A list of artist objects
 */
export const getArtists = async (
  token: string,
  genre: string,
  amount: number,
  market: string
) => {
  const response = await fetchFromSpotify({
    token: token,
    endpoint: "recommendations/",
    params: { seed_genres: genre, limit: amount, market: market },
  });
  let artists: any = [];
  for (let i = 0; i < amount; i++) {
    artists.push(response.tracks[i].artists[0]);
  }
  return artists;
};

/**
 * Requests a list of related artists for an artist
 *
 * @param  {string} token       The auth token
 * @param  {string} artistId    The artist id to fetch related artists for
 *
 * @return {object}             A list of related artist objects
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
 * @param  {string} artistId    The market to fetch songs for
 *
 * @return {object}             A list of track objects for an artist related to their top songs
 */
export const getSongs = async (
  token: string,
  artistId: string,
  market: string
) => {
  const response = await fetchFromSpotify({
    token: token,
    endpoint: "artists/" + artistId + "/top-tracks/",
    params: { market: market },
  });
  return response;
};

/**
 * Retrieves a song's preview url
 *
 * @param  {object} trackList      The array of tracks
 * @param  {number} trackNumber    The index of the track to fetch the url for
 *
 * @return {string}                The preview url - this can be null
 */
export const getPreviewUrl = (trackList: any, trackNumber: number) => {
  return trackList.tracks[trackNumber].preview_url;
};
