import "./soundwave.css";

function SoundWave() {
    return(
        <div className="listening">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 26">
    <defs><style>{`.wave{fill:#231f20;}`}</style></defs>
    <g id="audio-wave" data-name="audio-wave">
      <rect id="wave-5" className="wave" x="32" y="7" width="4" height="12" rx="2" ry="2"/>
      <rect id="wave-4" className="wave" x="24" y="2" width="4" height="22" rx="2" ry="2"/>
      <rect id="wave-3" className="wave" x="16" width="4" height="26" rx="2" ry="2"/>
      <rect id="wave-2" className="wave" x="8" y="5" width="4" height="16" rx="2" ry="2"/>
      <rect id="wave-1" className="wave" y="9" width="4" height="8" rx="2" ry="2"/>
      <rect id="wave-5-2" data-name="wave-4" className="wave" x="72" y="7" width="4" height="12" rx="2" ry="2"/>
      <rect id="wave-4-2" data-name="wave-5" className="wave" x="64" y="2" width="4" height="22" rx="2" ry="2"/>
      <rect id="wave-3-2" data-name="wave-3" className="wave" x="56" width="4" height="26" rx="2" ry="2"/>
      <rect id="wave-2-2" data-name="wave-2" className="wave" x="48" y="5" width="4" height="16" rx="2" ry="2"/>
      <rect id="wave-1-2" data-name="wave-1" className="wave" x="40" y="9" width="4" height="8" rx="2" ry="2"/>
    </g>
  </svg>
</div>
    )
}

export default SoundWave;