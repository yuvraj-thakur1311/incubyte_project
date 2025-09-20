import React from "react";
import SweetCard from "./SweetCard";

const SweetList = ({ sweets, loading, isAdmin }) => {
  if (loading) return <p>Loading sweets...</p>;
  if (!sweets.length) return <p>No sweets available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sweets.map((sweet) => (
        <SweetCard
          key={sweet._id || sweet.id}
          sweet={sweet}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default SweetList;
