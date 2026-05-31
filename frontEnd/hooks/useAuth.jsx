useEffect(() => {
  // Define an async function to fetch the current user's profile
  const fetchUser = async () => {
    try {
      // Send a GET request to your backend auth route to get the user's info
      const res = await axios.get('/auth/me');

      // If successful, store the user object in local state (or context/global state)
      setUser(res.data);
    } catch (err) {
      // If there's an error (unauthenticated, expired token, etc.), clear the user
      setUser(null);
    }
  };

  // Call the async function immediately after component mounts
  fetchUser();
}, []); // Empty dependency array ensures this runs only once after first render
