import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import api, { getErrorMessage } from '../api/client.js';

import Loader from '../components/Loader.jsx';

import BookingBox from '../components/BookingBox.jsx';

import Reviews from '../components/Reviews.jsx';

export default function ListingDetail() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const load = () =>
    api
      .get(`/listings/${id}`)
      .then(({ data }) => {
        setListing(data);
        setActiveImage(0);
      })
      .catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!listing) return <Loader />;

  const images = listing.images?.length ? listing.images : [];
  const imageCount = images.length;

  const showPrevious = () => {
    setActiveImage((current) =>
      current === 0 ? imageCount - 1 : current - 1
    );
  };

  const showNext = () => {
    setActiveImage((current) =>
      current === imageCount - 1 ? 0 : current + 1
    );
  };

  return (
    <section>
      <h1>{listing.title}</h1>

      <p className="muted">
        {listing.reviewCount > 0
          ? `★ ${listing.avgRating} · ${listing.reviewCount} reviews · `
          : ''}
        {listing.city}, {listing.state}
      </p>

      {imageCount > 0 && (
        <div className="gallery">
          <div className="gallery-main">
            <img
              className="hero-img"
              src={images[activeImage]}
              alt={`${listing.title} ${activeImage + 1}`}
            />

            {imageCount > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-btn gallery-prev"
                  onClick={showPrevious}
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="gallery-btn gallery-next"
                  onClick={showNext}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {imageCount > 1 && (
            <div className="gallery-thumbnails">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={`gallery-thumbnail ${
                    index === activeImage ? 'active' : ''
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="detail-layout">
        <div>
          <h2>
            {listing.type} hosted by {listing.host?.name}
          </h2>

          <p className="muted">
            Up to {listing.maxGuests} guests · {listing.bedrooms} bedroom
            {listing.bedrooms !== 1 ? 's' : ''}
          </p>

          <p>{listing.description}</p>

          <h3>Amenities</h3>

          <ul className="amenities">
            {listing.amenities.map((a) => (
              <li key={a}>✓ {a}</li>
            ))}
          </ul>

          <h3>Location</h3>

          <p className="muted">
            {listing.address}, {listing.city}
          </p>

          {/* TODO: show a map (Leaflet + OpenStreetMap) - see issue tracker */}

          <Reviews listingId={listing._id} onReviewAdded={load} />
        </div>

        <BookingBox listing={listing} />
      </div>
    </section>
  );
}