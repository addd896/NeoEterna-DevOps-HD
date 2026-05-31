const UserInfo = ({ user }) => {
    if (!user) return null; // or show a loading/skeleton UI
  
    return (
      <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
        <h3 className="text-xl font-medium mb-2">Welcome, {user.name}</h3>
        <p>Email: {user.email}</p>
        <p>Wallet: {user.walletAddress || "Not linked"}</p>
      </div>
    );
  };
  
  export default UserInfo;
  