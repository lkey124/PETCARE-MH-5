import './FeatureCard.css';

export function FeatureCard({ image, title, description }) {
  return (
    <article className="feature-card">
      {/* Ảnh bìa chính của thẻ */}
      <img src={image} alt={title} />
      
      <div className="feature-card__body">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
        
        <button type="button" aria-label={`Xem thêm ${title}`}>
          {/* Hình ảnh chân mèo thay thế cho icon cũ */}
          <img 
            src="/images/figma/icons/chan vangg.png" 
            alt="Mũi tên" 
            className="paw-icon" 
          />
        </button>
      </div>
    </article>
  );
}