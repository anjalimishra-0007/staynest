export default function Loader() {
  return (
    <div className="skeleton-grid" aria-label="Loading stays">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="card skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton-body">
            <div className="skeleton skeleton-tag" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-location" />
            <div className="skeleton skeleton-price" />
          </div>
        </div>
      ))}
    </div>
  );
}