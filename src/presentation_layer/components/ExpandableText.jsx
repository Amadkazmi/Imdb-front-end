import React, { useState } from 'react'

const ExpandableText = ({ text = "" }) => {
  const [expanded, setExpanded] = useState(false)

  if (!text || text.trim() === "") {
    return <span className="text-muted">No description available.</span>
  }

  const preview = text.length > 180 ? text.substring(0, 180) + "..." : text

  return (
    <div>
      <span style={{ lineHeight: '1.6' }}>
        {expanded ? text : preview}
      </span>

      {text.length > 180 && (
        <div>
          <span
            onClick={() => setExpanded(!expanded)}
            style={{
              color: "#ffc107",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}
            role="button"
            aria-label={expanded ? "Read less" : "Read more"}
          >
            {expanded ? "▲ Read less" : "▼ Read more"}
          </span>
        </div>
      )}
    </div>
  )
}

export default ExpandableText
