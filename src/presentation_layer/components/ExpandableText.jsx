import React, { useState } from 'react'

const ExpandableText = ({ text = "" }) => {
  const [expanded, setExpanded] = useState(false)

  if (!text || text.trim() === "") {
    return <span className="text-muted">No description available.</span>
  }

  const preview = text.length > 180 ? text.substring(0, 100) + "..." : text

  return (
    <div>
      <span style={{ lineHeight: '1.9' }}>
        {expanded ? text : preview}
      </span>

      {text.length > 180 && (
        <div>
          <span
            onClick={() => setExpanded(!expanded)}
            style={{
              color: "#362e17ff",
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
