'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  price_inr: number | null;
  price_label: string | null;
  billing_period: string;
  features: string[];
  is_highlighted: boolean;
  sort_order: number;
  is_published: boolean;
}

export default function AdminPackagesPage() {
  const supabase = createClient();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPkg, setCurrentPkg] = useState<Partial<PackageItem>>({
    name: '',
    slug: '',
    category: 'consulting',
    short_description: '',
    price_inr: null,
    price_label: '',
    billing_period: 'monthly',
    features: [],
    is_highlighted: false,
    sort_order: 0,
    is_published: false,
  });
  const [featureInput, setFeatureInput] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('packages')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleTogglePublish = async (pkg: PackageItem) => {
    const next = !pkg.is_published;
    await supabase.from('packages').update({ is_published: next }).eq('id', pkg.id);
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, is_published: next } : p))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPkg.name || !currentPkg.slug) return;

    if (currentPkg.id) {
      // Update
      await supabase.from('packages').update(currentPkg).eq('id', currentPkg.id);
    } else {
      // Insert
      await supabase.from('packages').insert(currentPkg);
    }

    setIsEditing(false);
    fetchPackages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    await supabase.from('packages').delete().eq('id', id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setCurrentPkg({
      ...currentPkg,
      features: [...(currentPkg.features || []), featureInput.trim()],
    });
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setCurrentPkg({
      ...currentPkg,
      features: (currentPkg.features || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-2xl text-text">Service Packages & Pricing</h1>
          <p className="text-xs text-text-muted mt-1">
            Section 9.8: Hardcode no prices. Added and updated here by admin.
          </p>
        </div>

        {!isEditing && (
          <Button
            size="sm"
            onClick={() => {
              setCurrentPkg({
                name: '',
                slug: '',
                category: 'consulting',
                short_description: '',
                price_inr: null,
                price_label: '',
                billing_period: 'monthly',
                features: [],
                is_highlighted: false,
                sort_order: packages.length,
                is_published: false,
              });
              setIsEditing(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Create Package</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="rounded-2xl glass border border-border p-6 space-y-4 max-w-2xl">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-h3 text-lg text-text">
              {currentPkg.id ? 'Edit Package' : 'New Package'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-text-dim hover:text-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Package Name *</label>
              <input
                type="text"
                required
                value={currentPkg.name || ''}
                onChange={(e) => setCurrentPkg({ ...currentPkg, name: e.target.value })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Slug *</label>
              <input
                type="text"
                required
                value={currentPkg.slug || ''}
                onChange={(e) => setCurrentPkg({ ...currentPkg, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Category</label>
              <select
                value={currentPkg.category || 'consulting'}
                onChange={(e) => setCurrentPkg({ ...currentPkg, category: e.target.value as any })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              >
                <option value="consulting">Consulting</option>
                <option value="website">Website</option>
                <option value="crm">CRM</option>
                <option value="marketing">Marketing</option>
                <option value="bundle">Bundle</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Price INR (Optional)</label>
              <input
                type="number"
                placeholder="e.g. 45000"
                value={currentPkg.price_inr ?? ''}
                onChange={(e) => setCurrentPkg({ ...currentPkg, price_inr: e.target.value ? parseInt(e.target.value, 10) : null })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-dim uppercase">Custom Price Label</label>
              <input
                type="text"
                placeholder="e.g. Custom Quote"
                value={currentPkg.price_label || ''}
                onChange={(e) => setCurrentPkg({ ...currentPkg, price_label: e.target.value })}
                className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-text-dim uppercase">Short Description</label>
            <input
              type="text"
              value={currentPkg.short_description || ''}
              onChange={(e) => setCurrentPkg({ ...currentPkg, short_description: e.target.value })}
              className="h-10 px-3 w-full rounded-xl bg-bg border border-border text-xs text-text mt-1"
            />
          </div>

          {/* Features Editor */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-dim uppercase">Included Features</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Direct WhatsApp lead pipeline..."
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                className="h-9 px-3 flex-1 rounded-xl bg-bg border border-border text-xs text-text"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-3 rounded-xl bg-surface-hover border border-border text-xs text-green"
              >
                Add
              </button>
            </div>
            <div className="space-y-1 mt-2">
              {(currentPkg.features || []).map((feat, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-bg text-xs border border-border">
                  <span>{feat}</span>
                  <button type="button" onClick={() => removeFeature(i)} className="text-danger hover:underline">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
              <input
                type="checkbox"
                checked={currentPkg.is_highlighted || false}
                onChange={(e) => setCurrentPkg({ ...currentPkg, is_highlighted: e.target.checked })}
                className="rounded"
              />
              <span>Highlight with "Most Chosen" border</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
              <input
                type="checkbox"
                checked={currentPkg.is_published || false}
                onChange={(e) => setCurrentPkg({ ...currentPkg, is_published: e.target.checked })}
                className="rounded"
              />
              <span>Published on Live Site</span>
            </label>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button variant="secondary" type="button" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Package
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl glass border border-border overflow-hidden">
          <div className="overflow-x-auto w-full"><table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-dim uppercase font-mono tracking-wider bg-surface/50">
              <tr>
                <th className="py-3 px-4">Name & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-dim">
                    No packages created yet. Public /pricing shows the default empty state.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text">{pkg.name}</div>
                      <div className="font-mono text-[11px] text-text-dim">/{pkg.slug}</div>
                    </td>
                    <td className="py-3 px-4 uppercase font-mono text-[11px] text-text">
                      {pkg.category}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-text">
                      {pkg.price_inr ? formatINR(pkg.price_inr) : pkg.price_label || 'Custom'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(pkg)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          pkg.is_published
                            ? 'bg-green/10 text-green border border-green/30'
                            : 'bg-surface text-text-dim border border-border'
                        }`}
                      >
                        {pkg.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button
                        onClick={() => {
                          setCurrentPkg(pkg);
                          setIsEditing(true);
                        }}
                        className="text-text hover:text-green"
                      >
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-text hover:text-danger"
                      >
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
