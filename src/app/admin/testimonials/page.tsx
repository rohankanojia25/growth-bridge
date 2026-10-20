'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  business_name: string;
  quote: string;
  is_published: boolean;
  sort_order: number;
}

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Testimonial>>({
    author_name: '',
    author_role: '',
    business_name: '',
    quote: '',
    is_published: true,
    sort_order: 0,
  });

  const fetchItems = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.author_name || !current.quote) return;

    if (current.id) {
      await supabase.from('testimonials').update(current).eq('id', current.id);
    } else {
      await supabase.from('testimonials').insert(current);
    }

    setIsEditing(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-2xl text-text">Testimonials</h1>
          <p className="text-xs text-text-muted mt-1">Section 12: No invented testimonials. Only real feedback added here.</p>
        </div>

        {!isEditing && (
          <Button
            size="sm"
            onClick={() => {
              setCurrent({
                author_name: '',
                author_role: '',
                business_name: '',
                quote: '',
                is_published: true,
                sort_order: items.length,
              });
              setIsEditing(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Add Testimonial</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-2xl glass border border-border p-6 space-y-4 max-w-xl">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-h3 text-lg text-text">
              {current.id ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-text-dim hover:text-text">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Author Name *</label>
              <input
                type="text"
                required
                value={current.author_name || ''}
                onChange={(e) => setCurrent({ ...current, author_name: e.target.value })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Role / Title</label>
              <input
                type="text"
                placeholder="e.g. Managing Director"
                value={current.author_role || ''}
                onChange={(e) => setCurrent({ ...current, author_role: e.target.value })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Business Name</label>
            <input
              type="text"
              placeholder="e.g. Royal Heritage Furnishings, Delhi"
              value={current.business_name || ''}
              onChange={(e) => setCurrent({ ...current, business_name: e.target.value })}
              className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Quote / Review *</label>
            <textarea
              rows={4}
              required
              value={current.quote || ''}
              onChange={(e) => setCurrent({ ...current, quote: e.target.value })}
              className="p-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
            <input
              type="checkbox"
              checked={current.is_published || false}
              onChange={(e) => setCurrent({ ...current, is_published: e.target.checked })}
              className="rounded"
            />
            <span>Published on Live Site</span>
          </label>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Testimonial
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl glass border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Author & Business</th>
                <th className="py-3 px-4">Quote Preview</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-dim">
                    No testimonials added yet. Section 4.10: section collapses gracefully until added.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text">{item.author_name}</div>
                      <div className="text-[11px] text-text-dim">{item.business_name}</div>
                    </td>
                    <td className="py-3 px-4 text-text-muted line-clamp-1 max-w-sm">
                      "{item.quote}"
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${item.is_published ? 'text-green bg-green/10' : 'text-text-dim bg-surface'}`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button onClick={() => { setCurrent(item); setIsEditing(true); }} className="text-text hover:text-green">
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-text hover:text-danger">
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
