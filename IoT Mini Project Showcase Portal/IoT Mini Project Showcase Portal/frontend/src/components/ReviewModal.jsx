import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Send, AlertTriangle } from 'lucide-react';

export default function ReviewModal({ project, onClose, user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [project.id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${project.id}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to leave a review.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('sansah_token');
      const res = await fetch(`${API_URL}/api/projects/${project.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit review');
        return;
      }

      setReviews([data, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      setError('Network error. Ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-2xl bg-navy-950 border border-navy-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative max-h-[90vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-navy-900 flex items-center justify-between bg-navy-900/50">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="text-cyan-400" size={20} />
              Reviews for {project.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-semibold">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span>{avgRating} ({reviews.length} reviews)</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-navy-900 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Review List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-navy-950/50">
          {loading ? (
            <div className="text-center text-slate-500 py-10 font-bold">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-slate-500 py-10">No reviews yet. Be the first!</div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-navy-900/60 border border-navy-800/60 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-900 flex items-center justify-center text-[10px] font-bold text-cyan-400 overflow-hidden">
                      {r.User?.profilePicture ? (
                        <img src={r.User.profilePicture} alt={r.User.name} className="w-full h-full object-cover" />
                      ) : (
                        r.User?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-300">{r.User?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? "fill-amber-400" : "opacity-30"} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-xs text-slate-400 leading-relaxed pl-8">{r.comment}</p>}
                <div className="text-[10px] text-slate-600 pl-8 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        {user ? (
          <div className="p-6 bg-navy-900/50 border-t border-navy-900">
            {error && (
              <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star size={24} className={`${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} transition-colors`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your feedback..."
                  rows={2}
                  className="flex-1 bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="shrink-0 p-3 h-[46px] bg-cyan-500 text-navy-950 hover:bg-cyan-400 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 bg-navy-900/80 border-t border-navy-900 text-center text-xs text-slate-400 font-semibold">
            Log in to leave a review.
          </div>
        )}
      </div>
    </div>
  );
}
