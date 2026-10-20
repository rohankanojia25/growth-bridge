import { ImageResponse } from 'next/og';

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
          padding: '80px',
        }}
      >
        {/* Top Logo / Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '999px',
              backgroundColor: '#19F28C',
              marginRight: '16px',
            }}
          />
          <div
            style={{
              display: 'flex',
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#F5F7FA',
              maxWidth: '960px',
              marginBottom: '20px',
            }}
          >
            One partner for your growth.
          </div>
          <div
            style={{
              display: 'flex',
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
              display: 'flex',
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
              display: 'flex',
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
