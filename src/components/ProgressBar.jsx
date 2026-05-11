function getProgressCopy(pct) {
  if (pct === 0) return 'Nothing done yet. Pick one thing.'
  if (pct <= 25) return 'Getting started.'
  if (pct <= 50) return 'Halfway there — keep going.'
  if (pct <= 74) return 'More done than not. Finish strong.'
  if (pct <= 99) return "Almost. Don't stop here."
  return 'Everything done. Rest or add more.'
}

function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="progress-section">
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-info">
        <span className="progress-pct">{pct}%</span>
        <span className="progress-copy">{getProgressCopy(pct)}</span>
      </div>
    </div>
  )
}

export default ProgressBar