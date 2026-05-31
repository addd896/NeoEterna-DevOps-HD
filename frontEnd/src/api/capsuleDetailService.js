import axios from "./axiosInstance";

/**
 * Fetches the full details of a capsule by its ID.
 *
 * @param {string} id - The unique ID of the capsule to retrieve.
 * @returns {Promise<Object>} - The capsule data object from the backend.
 *
 * Example usage:
 * const capsule = await fetchCapsuleDetail('64f5c4...');
 */
export const fetchCapsuleDetail = async (id) => {
  const res = await axios.get(`/capsules/${id}`); // Makes a GET request to /api/capsules/:id
  return res.data.data; // Returns the 'data' field from the response body
};
