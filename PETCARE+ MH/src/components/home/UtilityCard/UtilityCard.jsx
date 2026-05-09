import './UtilityCard.css';

export function UtilityCard({ title, image, description, icon: Icon, link = '#' }) {
  return (
    <article className="utility-card">
      <img src={image} alt={title} />
      
      <div className="utility-card__content">
        <h3>
          <Icon size={22} />
          {title}
        </h3>
        <p>{description}</p>
        
        {/* Nút bấm tròn với icon bàn chân mèo */}
        <a href={link} className="utility-card__btn" aria-label={`Khám phá thêm về ${title}`}>
          <img 
            src="/images/figma/icons/chan trang.png" 
            alt="Paw Icon" 
            className="utility-card__paw-icon"
          />
        </a>
      </div>
    </article>
  );
}