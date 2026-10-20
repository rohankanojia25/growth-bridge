import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Growth Bridge Accelerator — Business Consulting & Marketing, Delhi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#05060A',
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(25, 242, 140, 0.15) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(123, 97, 255, 0.18) 0%, transparent 45%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Logo / Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '999px',
              backgroundColor: '#19F28C',
            }}
          />
          <div
            style={{
              fontSize: '18px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#19F28C',
              fontWeight: 600,
            }}
          >
            Strategy · Websites · CRM · Marketing
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#F5F7FA',
              maxWidth: '900px',
            }}
          >
            One partner for your{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(120deg, #19F28C, #3DD6F5, #7B61FF)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              growth.
            </span>
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#A3A9B8',
              lineHeight: 1.4,
              maxWidth: '850px',
            }}
          >
            Bridging your business to growth. Delhi NCR & Across India.
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '32px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#F5F7FA',
              letterSpacing: '-0.02em',
            }}
          >
            Growth Bridge Accelerator
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#19F28C',
              fontWeight: 600,
            }}
          >
            +91 88838 38363
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
