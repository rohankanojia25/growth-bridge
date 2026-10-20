'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X, Eye, FileEdit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
}

export default function AdminBlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [current, setCurrent] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content_md: '',
    tags: [],
    is_published: false,
  });
  const [tagInput, setTagInput] = useState('');

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.title || !current.slug) return;

    const payload = {
      ...current,
      published_at: current.is_published && !current.published_at ? new Date().toISOString() : current.published_at,
    };

    if (current.id) {
      await supabase.from('blog_posts').update(payload).eq('id', current.id);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }

    setIsEditing(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setCurrent({
      ...current,
      tags: [...(current.tags || []), tagInput.trim()],
    });
    setTagInput('');
  };

  const removeTag = (idx: number) => {
    setCurrent({
      ...current,
      tags: (current.tags || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-2xl text-text">Blog & Articles</h1>
          <p className="text-xs text-text-muted mt-1">Section 9.5: Markdown editor with live preview.</p>
        </div>

        {!isEditing && (
          <Button
            size="sm"
            onClick={() => {
              setCurrent({
                title: '',
                slug: '',
                excerpt: '',
                content_md: '# Article Heading\n\nWrite in markdown here...',
                tags: [],
                is_published: false,
              });
              setIsEditing(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Write New Article</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-2xl glass border border-border p-6 space-y-4 max-w-3xl">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-h3 text-lg text-text">
              {current.id ? 'Edit Article' : 'New Article'}
            </h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-text-dim hover:text-text">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Article Title *</label>
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

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Excerpt / Summary</label>
            <textarea
              rows={2}
              value={current.excerpt || ''}
              onChange={(e) => setCurrent({ ...current, excerpt: e.target.value })}
              className="p-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-dim uppercase">Tags / Topics</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Local SEO"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="h-9 px-3 flex-1 rounded-xl bg-bg border border-border text-xs text-text"
              />
              <button type="button" onClick={addTag} className="px-3 rounded-xl bg-surface-hover border border-border text-xs text-green">
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(current.tags || []).map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-green bg-green/10 border border-green/30">
                  <span>{t}</span>
                  <button type="button" onClick={() => removeTag(i)} className="text-danger">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Markdown Editor with Tabs: Edit / Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-text-dim uppercase">Content (Markdown)</label>
              <div className="flex items-center gap-1 glass p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 ${activeTab === 'edit' ? 'bg-green text-[#04110A] font-semibold' : 'text-text-muted'}`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 ${activeTab === 'preview' ? 'bg-green text-[#04110A] font-semibold' : 'text-text-muted'}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>
            </div>

            {activeTab === 'edit' ? (
              <textarea
                rows={12}
                value={current.content_md || ''}
                onChange={(e) => setCurrent({ ...current, content_md: e.target.value })}
                className="p-4 w-full rounded-xl bg-bg border border-border text-xs font-mono text-text leading-relaxed"
              />
            ) : (
              <div className="p-6 rounded-xl bg-bg border border-border max-h-[350px] overflow-y-auto prose prose-invert text-xs leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {current.content_md || '*No content written yet.*'}
                </ReactMarkdown>
              </div>
            )}
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
              Save Article
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl glass border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-text-dim">
                    No articles published yet.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text">{p.title}</div>
                      <div className="text-[11px] text-text-dim font-mono">/{p.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${p.is_published ? 'text-green bg-green/10' : 'text-text-dim bg-surface'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button onClick={() => { setCurrent(p); setIsEditing(true); }} className="text-text hover:text-green">
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-text hover:text-danger">
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
