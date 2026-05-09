import './SectionHeader.css';

export function SectionHeader({ eyebrow, title, align = 'center' }) {
  return (
    <div className={`section-header section-header--${align}`}>
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2>{title}</h2>
    </div>
  );
}
