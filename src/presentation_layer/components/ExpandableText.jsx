import React, { useState } from 'react';


const ExpandableText = ({ text = "" }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text || text.trim() === "") {
    return <span>No description available.</span>;
  }

  const preview = text.length > 160 ? text.substring(0, 160) + "..." : text;

  return (
    <div>
      <span>{expanded ? text : preview}</span>
      {text.length > 160 && (
        <span
          style={{ color: "#ffc107", cursor: "pointer" }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? " Read less" : " Read more"}
        </span>
      )}
    </div>
  );
};
export default ExpandableText;