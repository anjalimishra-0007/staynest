import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import api, { getErrorMessage } from '../../api/client.js';

import { STAY_TYPES } from '../../utils/format.js';

const empty = {
  title: '',
  description: '',
  type: 'homestay',
  city: '',
  state: '',
  address: '',
  pricePerNight: '',
  maxGuests: 2,
  bedrooms: 1,
  amenities: '',
  imageUrl: '',
};

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    api.get(`/listings/${id}`).then(({ data }) =>
      setForm({
        ...empty,
        ...data,
        amenities: data.amenities.join(', '),
        imageUrl: data.images[0] || '',
      })
    );
  }, [id, isEdit]);

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  // TODO: replace the image URL field with real image upload (Cloudinary / multer).
  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const title = form.title.trim();
    const description = form.description.trim();
    const type = form.type;
    const city = form.city.trim();
    const state = form.state.trim();
    const address = form.address.trim();
    const imageUrl = form.imageUrl.trim();
    const amenities = form.amenities.trim();

    const pricePerNight = Number(form.pricePerNight);
    const maxGuests = Number(form.maxGuests);
    const bedrooms = Number(form.bedrooms);

    if (!title || !description || !city || !state || !address) {
      setError('Please fill in all required fields.');
      return;
    }

    if (pricePerNight <= 0) {
      setError('Price per night must be greater than 0.');
      return;
    }

    if (maxGuests < 1) {
      setError('Maximum guests must be at least 1.');
      return;
    }

    if (bedrooms < 0) {
      setError('Bedrooms cannot be negative.');
      return;
    }

    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        setError('Please enter a valid image URL.');
        return;
      }
    }

    const payload = {
      title,
      description,
      type,
      city,
      state,
      address,
      pricePerNight,
      maxGuests,
      bedrooms,
      amenities: amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    if (imageUrl) payload.images = [imageUrl];

    try {
      if (isEdit) {
        await api.put(`/listings/${id}`, payload);
      } else {
        await api.post('/listings', payload);
      }

      navigate('/host');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className="card form wide" onSubmit={submit}>
      <h1>{isEdit ? 'Edit listing' : 'Create a new listing'}</h1>

      <input
        required
        placeholder="Title"
        value={form.title}
        onChange={set('title')}
      />

      <textarea
        required
        placeholder="Describe your place"
        value={form.description}
        onChange={set('description')}
      />

      <div className="row">
        <select value={form.type} onChange={set('type')}>
          {STAY_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <input
          required
          type="number"
          min="0"
          placeholder="Price per night (₹)"
          value={form.pricePerNight}
          onChange={set('pricePerNight')}
        />
      </div>

      <div className="row">
        <input
          required
          placeholder="City"
          value={form.city}
          onChange={set('city')}
        />

        <input
          required
          placeholder="State"
          value={form.state}
          onChange={set('state')}
        />
      </div>

      <input
        required
        placeholder="Address"
        value={form.address}
        onChange={set('address')}
      />

      <div className="row">
        <label className="grow">
          Max guests
          <input
            type="number"
            min="1"
            value={form.maxGuests}
            onChange={set('maxGuests')}
          />
        </label>

        <label className="grow">
          Bedrooms
          <input
            type="number"
            min="0"
            value={form.bedrooms}
            onChange={set('bedrooms')}
          />
        </label>
      </div>

      <input
        placeholder="Amenities (comma separated: WiFi, AC, Parking)"
        value={form.amenities}
        onChange={set('amenities')}
      />

      <input
        placeholder="Image URL (optional)"
        value={form.imageUrl}
        onChange={set('imageUrl')}
      />

      {error && <p className="error">{error}</p>}

      <button className="btn">
        {isEdit ? 'Save changes' : 'Publish listing'}
      </button>
    </form>
  );
}