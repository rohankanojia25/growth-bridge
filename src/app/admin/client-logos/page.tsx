'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';

interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export default function AdminClientLogosPage() {
  const supabase = createClient();
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<ClientLogo>>({
    name: '',
    logo_url: '',
    website_url: '',
    is_published: true,
    sort_order: 0,
  });
  const [uploading, setUploading] = useState(false);

  const fetchLogos = async () => {
    const { data } = await supabase.from('client_logos').select('*').order('sort_order');
    if (data) setLogos(data);
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Max file size is 2 MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `logos/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('assets')
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('assets').getPublicUrl(path);
      setCurrent({ ...current, logo_url: urlData.publicUrl });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.name || !current.logo_url) return;

    if (current.id) {
      await supabase.from('client_logos').update(current).eq('id', current.id);
    } else {
      await supabase.from('client_logos').insert(current);
    }

    setIsEditing(false);
    fetchLogos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client logo?')) return;
    await supabase.from('client_logos').delete().eq('id', id);
    setLogos((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-2xl text-text">Client Logos Strip</h1>
          <p className="text-xs text-text-muted mt-1">
            Section 4.9: Renders on homepage only if 4 or more published logos exist. Otherwise collapsed.
          </p>
        </div>

        {!isEditing && (
          <Button
            size="sm"
            onClick={() => {
              setCurrent({
                name: '',
                logo_url: '',
                website_url: '',
                is_published: true,
                sort_order: logos.length,
              });
              setIsEditing(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Add Client Logo</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-2xl glass border border-border p-6 space-y-4 max-w-md">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-h3 text-lg text-text">
              {current.id ? 'Edit Client Logo' : 'Add Client Logo'}
            </h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-text-dim hover:text-text">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Client / Brand Name *</label>
            <input
              type="text"
              required
              value={current.name || ''}
              onChange={(e) => setCurrent({ ...current, name: e.target.value })}
              className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Website URL (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={current.website_url || ''}
              onChange={(e) => setCurrent({ ...current, website_url: e.target.value })}
              className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Upload Logo Image (PNG / SVG / WebP, max 2MB)</label>
            <input
              type="file"
              accept=".png,.svg,.webp,.jpg"
              onChange={handleFileUpload}
              className="block w-full text-xs text-text-dim mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green file:text-[#04110A]"
            />
            {uploading && <p className="text-xs text-green mt-1">Uploading...</p>}
            {current.logo_url && (
              <div className="mt-3 p-3 rounded-xl bg-bg border border-border flex items-center justify-center">
                <img src={current.logo_url} alt="Preview" className="max-h-12 object-contain" />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
            <input
              type="checkbox"
              checked={current.is_published || false}
              onChange={(e) => setCurrent({ ...current, is_published: e.target.checked })}
              className="rounded"
            />
            <span>Published</span>
          </label>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={uploading}>
              Save Logo
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl glass border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Brand Name</th>
                <th className="py-3 px-4">Website</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-dim">
                    No client logos added yet. Homepage client strip remains cleanly hidden.
                  </td>
                </tr>
              ) : (
                logos.map((logo) => (
                  <tr key={logo.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <img src={logo.logo_url} alt={logo.name} className="h-6 object-contain" />
                    </td>
                    <td className="py-3 px-4 font-semibold text-text">{logo.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-text-dim">{logo.website_url || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${logo.is_published ? 'text-green bg-green/10' : 'text-text-dim bg-surface'}`}>
                        {logo.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button onClick={() => { setCurrent(logo); setIsEditing(true); }} className="text-text hover:text-green">
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button onClick={() => handleDelete(logo.id)} className="text-text hover:text-danger">
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
