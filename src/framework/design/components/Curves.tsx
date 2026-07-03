export function HeaderCurveDown() {
  return (
    <div className="tool-header__curve" aria-hidden="true">
      <svg viewBox="0 0 1440 44" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#ffffff"
          d="M0,20 C360,44 720,8 1080,24 C1260,32 1380,28 1440,22 L1440,44 L0,44 Z"
        />
      </svg>
    </div>
  );
}

export function FooterCurveUp() {
  return (
    <div className="footer-curve" aria-hidden="true">
      <svg viewBox="0 0 1440 44" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="var(--ds-brand)"
          d="M0,44 L0,16 C360,0 720,32 1080,18 C1260,10 1380,14 1440,20 L1440,44 Z"
        />
      </svg>
    </div>
  );
}
