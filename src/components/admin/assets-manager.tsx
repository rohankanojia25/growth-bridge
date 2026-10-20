'use client';

import { useState } from 'react';
import { ASSET_SLOTS, type AssetSlot } from '@/lib/assets.config';
import { AssetFallback } from '@/components/ui/asset-fallback';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Check, AlertCircle } from 'lucide-react';

interface AssetRecord {
  id?: string;
  slot_key: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  focal_x: number | null;
  focal_y: number | null;
}

export function AssetsManager({ initialAssets }: { initialAssets: AssetRecord[] }) {
  const supabase = createClient();
  const [assets, setAssets] = useState<Record<string, AssetRecord>>(() => {
    const map: Record<string, AssetRecord> = {};
    initialAssets.forEach((a) => {
      map[a.slot_key] = a;
    });
    return map;
  });

  const [loadingSlot, setLoadingSlot] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ slot: string; message: string; isError?: boolean } | null>(null);

  const handleFileUpload = async (slot: AssetSlot, file: File) => {
    setLoadingSlot(slot.key);
    setFeedback(null);

    // Validation per Section 5.5: Max 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ slot: slot.key, message: 'File exceeds 5 MB limit.', isError: true });
      setLoadingSlot(null);
      return;
    }

    // Reject SVG containing <script>
    if (file.type === 'image/svg+xml') {
      const text = await file.text();
      if (/<script/i.test(text)) {
        setFeedback({ slot: slot.key, message: 'SVG containing script tags is strictly rejected.', isError: true });
        setLoadingSlot(null);
        return;
      }
    }

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `slots/${slot.key}-${Date.now()}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadErr } = await supabase.storage
        .from('assets')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: urlData } = supabase.storage.from('assets').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Upsert record into site_assets table
      const upsertPayload = {
        slot_key: slot.key,
        url: publicUrl,
        alt: slot.defaultAlt,
        focal_x: 50,
        focal_y: 50,
      };

      const { data: saved, error: dbErr } = await supabase
        .from('site_assets')
        .upsert(upsertPayload, { onConflict: 'slot_key' })
        .select()
        .single();

      if (dbErr) throw dbErr;

      setAssets((prev) => ({
        ...prev,
        [slot.key]: saved,
      }));

      setFeedback({ slot: slot.key, message: 'Asset updated successfully.' });
    } catch (err: unknown) {
      setFeedback({
        slot: slot.key,
        message: err instanceof Error ? err.message : 'Upload failed',
        isError: true,
      });
    } finally {
      setLoadingSlot(null);
    }
  };

  const handleUpdateMeta = async (slotKey: string, alt: string, focalX: number, focalY: number) => {
    setLoadingSlot(slotKey);
    try {
      const { error } = await supabase
        .from('site_assets')
        .update({ alt, focal_x: focalX, focal_y: focalY })
        .eq('slot_key', slotKey);

      if (!error) {
        setAssets((prev) => ({
          ...prev,
          [slotKey]: { ...prev[slotKey], alt, focal_x: focalX, focal_y: focalY },
        }));
        setFeedback({ slot: slotKey, message: 'Saved metadata.' });
      }
    } finally {
      setLoadingSlot(null);
    }
  };

  const handleRemove = async (slotKey: string) => {
    if (!confirm('Remove this custom asset and restore the generative fallback?')) return;
    setLoadingSlot(slotKey);

    try {
      await supabase.from('site_assets').delete().eq('slot_key', slotKey);
      setAssets((prev) => {
        const copy = { ...prev };
        delete copy[slotKey];
        return copy;
      });
      setFeedback({ slot: slotKey, message: 'Restored fallback.' });
    } finally {
      setLoadingSlot(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h2 text-2xl text-text">Site Assets & Visual Slots</h1>
        <p className="text-xs text-text-muted mt-1">
          Upload custom logos, photography, and banner graphics. Every slot automatically renders an art-directed generative fallback until customized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSET_SLOTS.map((slot) => {
          const current = assets[slot.key];
          const isLoading = loadingSlot === slot.key;

          return (
            <div
              key={slot.key}
              className="rounded-2xl glass border border-border p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display font-semibold text-sm text-text">
                      {slot.label}
                    </h2>
                    <span className="font-mono text-[10px] text-text-dim block mt-0.5">
                      slot: {slot.key}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                      slot.required
                        ? 'bg-green/10 text-green border border-green/30'
                        : 'bg-surface text-text-dim border border-border'
                    }`}
                  >
                    {slot.required ? 'Required' : 'Optional'}
                  </span>
                </div>

                {/* Aspect & Recommended Size */}
                <div className="text-[11px] font-mono text-text-dim">
                  Recommended: <span className="text-text">{slot.recommendedSize}</span>
                </div>

                {/* Visual Preview */}
                <div className="rounded-xl overflow-hidden border border-border bg-bg relative aspect-[16/10] flex items-center justify-center">
                  {current?.url ? (
                    <img
                      src={current.url}
                      alt={current.alt || slot.defaultAlt}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${current.focal_x ?? 50}% ${current.focal_y ?? 50}%`,
                      }}
                    />
                  ) : (
                    <AssetFallback
                      variant={slot.fallbackVariant}
                      aspect={slot.aspect}
                      className="w-full h-full"
                    />
                  )}
                </div>

                {feedback && feedback.slot === slot.key && (
                  <div
                    className={`text-[11px] p-2 rounded-lg ${
                      feedback.isError
                        ? 'bg-danger/10 text-danger border border-danger/30'
                        : 'bg-green/10 text-green border border-green/30'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="pt-2 border-t border-border space-y-3">
                {current && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-mono text-text-dim uppercase">Alt Text</label>
                      <input
                        type="text"
                        defaultValue={current.alt || ''}
                        onBlur={(e) =>
                          handleUpdateMeta(
                            slot.key,
                            e.target.value,
                            current.focal_x ?? 50,
                            current.focal_y ?? 50
                          )
                        }
                        className="h-8 px-2 w-full rounded bg-bg border border-border text-xs text-text mt-1"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.svg"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(slot, file);
                      }}
                    />
                    <div className="h-9 px-3 rounded-xl bg-green text-[#04110A] text-xs font-semibold flex items-center justify-center gap-1.5 hover:shadow-[0_0_16px_rgba(25,242,140,0.3)] transition-all text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isLoading ? 'Saving...' : current ? 'Replace' : 'Upload'}</span>
                    </div>
                  </label>

                  {current && (
                    <button
                      onClick={() => handleRemove(slot.key)}
                      disabled={isLoading}
                      className="p-2 h-9 rounded-xl glass border border-border text-danger hover:bg-danger/10 transition-colors"
                      title="Remove custom asset and restore fallback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
