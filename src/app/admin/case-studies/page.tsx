'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: Array<{ label: string; value: string }>;
  is_published: boolean;
}

export default function AdminCaseStudiesPage() {
  const supabase = createClient();
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<CaseStudy>>({
    title: '',
    slug: '',
    client_name: '',
    industry: '',
    summary: '',
    challenge: '',
    solution: '',
    results: [],
    is_published: false,
  });

  const [resLabel, setResLabel] = useState('');
  const [resValue, setResValue] = useState('');

  const fetchStudies = async () => {
    const { data } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false });
    if (data) setStudies(data);
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.title || !current.slug) return;

    if (current.id) {
      await supabase.from('case_studies').update(current).eq('id', current.id);
    } else {
      await supabase.from('case_studies').insert(current);
    }

    setIsEditing(false);
    fetchStudies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this case study?')) return;
    await supabase.from('case_studies').delete().eq('id', id);
    setStudies((prev) => prev.filter((s) => s.id !== id));
  };

  const addResult = () => {
    if (!resLabel.trim() || !resValue.trim()) return;
    setCurrent({
      ...current,
      results: [...(current.results || []), { label: resLabel.trim(), value: resValue.trim() }],
    });
    setResLabel('');
    setResValue('');
  };

  const removeResult = (idx: number) => {
    setCurrent({
      ...current,
      results: (current.results || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-2xl text-text">Case Studies</h1>
          <p className="text-xs text-text-muted mt-1">Manage published client success transformations.</p>
        </div>

        {!isEditing && (
          <Button
            size="sm"
            onClick={() => {
              setCurrent({
                title: '',
                slug: '',
                client_name: '',
                industry: '',
                summary: '',
                challenge: '',
                solution: '',
                results: [],
                is_published: false,
              });
              setIsEditing(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Create Case Study</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-2xl glass border border-border p-6 space-y-4 max-w-2xl">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-h3 text-lg text-text">
              {current.id ? 'Edit Case Study' : 'New Case Study'}
            </h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-text-dim hover:text-text">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Title *</label>
              <input
                type="text"
                required
                value={current.title || ''}
                onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Slug *</label>
              <input
                type="text"
                required
                value={current.slug || ''}
                onChange={(e) => setCurrent({ ...current, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Client Name *</label>
              <input
                type="text"
                required
                value={current.client_name || ''}
                onChange={(e) => setCurrent({ ...current, client_name: e.target.value })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Industry Sector</label>
              <input
                type="text"
                placeholder="e.g. Retail Showroom"
                value={current.industry || ''}
                onChange={(e) => setCurrent({ ...current, industry: e.target.value })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Summary</label>
            <textarea
              rows={2}
              value={current.summary || ''}
              onChange={(e) => setCurrent({ ...current, summary: e.target.value })}
              className="p-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">The Challenge</label>
            <textarea
              rows={3}
              value={current.challenge || ''}
              onChange={(e) => setCurrent({ ...current, challenge: e.target.value })}
              className="p-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">The Connected Solution</label>
            <textarea
              rows={3}
              value={current.solution || ''}
              onChange={(e) => setCurrent({ ...current, solution: e.target.value })}
              className="p-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          {/* Results Editor */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-dim uppercase">Key Measured Results</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Value (e.g. +310%)"
                value={resValue}
                onChange={(e) => setResValue(e.target.value)}
                className="h-9 px-3 w-1/3 rounded-xl bg-bg border border-border text-xs text-text font-mono"
              />
              <input
                type="text"
                placeholder="Label (e.g. WhatsApp Inquiries)"
                value={resLabel}
                onChange={(e) => setResLabel(e.target.value)}
                className="h-9 px-3 flex-1 rounded-xl bg-bg border border-border text-xs text-text"
              />
              <button
                type="button"
                onClick={addResult}
                className="px-3 rounded-xl bg-surface-hover border border-border text-xs text-green"
              >
                Add
              </button>
            </div>

            <div className="space-y-1 mt-2">
              {(current.results || []).map((res, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-bg text-xs border border-border">
                  <span><strong>{res.value}</strong>: {res.label}</span>
                  <button type="button" onClick={() => removeResult(i)} className="text-danger hover:underline">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-text cursor-pointer pt-2">
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
              Save Case Study
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl glass border border-border overflow-hidden">
          <div className="overflow-x-auto w-full"><table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Title & Client</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-dim">
                    No case studies created yet.
                  </td>
                </tr>
              ) : (
                studies.map((st) => (
                  <tr key={st.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text">{st.title}</div>
                      <div className="text-[11px] text-text-dim">{st.client_name} · /{st.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-text">{st.industry || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${st.is_published ? 'text-green bg-green/10' : 'text-text-dim bg-surface'}`}>
                        {st.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button onClick={() => { setCurrent(st); setIsEditing(true); }} className="text-text hover:text-green">
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button onClick={() => handleDelete(st.id)} className="text-text hover:text-danger">
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}
