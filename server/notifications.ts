import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface GenerationStats {
  totalImages: number;
  totalVideos: number;
  imagesCompleted: number;
  videosCompleted: number;
  imagesFailed: number;
  videosFailed: number;
}

function getAppUrl(): string {
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (domain) return `https://${domain}`;
  return process.env.APP_URL || "http://localhost:5000";
}

export async function sendGenerationCompleteEmail(
  toEmail: string,
  username: string,
  stats: GenerationStats
): Promise<boolean> {
  if (!resend) {
    console.log("Resend not configured — skipping email notification");
    return false;
  }

  const successImages = stats.imagesCompleted;
  const successVideos = stats.videosCompleted;
  const failedImages = stats.imagesFailed;
  const failedVideos = stats.videosFailed;
  const totalGenerated = successImages + successVideos;

  try {
    const { data, error } = await resend.emails.send({
      from: "Smarthinkerz Studio <onboarding@resend.dev>",
      to: toEmail,
      subject: `Your media generation is complete — ${totalGenerated} files ready`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px;">Smarthinkerz Studio</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">AI-Powered Media Generation</p>
          </div>

          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #e2e8f0;">Hi ${username},</p>
            <p style="font-size: 16px; color: #cbd5e1; line-height: 1.6;">
              Your media generation job has finished. Here's a summary:
            </p>

            <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Images Generated</td>
                  <td style="padding: 8px 0; color: #22c55e; font-size: 14px; text-align: right; font-weight: 600;">${successImages}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Videos Generated</td>
                  <td style="padding: 8px 0; color: #22c55e; font-size: 14px; text-align: right; font-weight: 600;">${successVideos}</td>
                </tr>
                ${failedImages > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Images Failed</td>
                  <td style="padding: 8px 0; color: #ef4444; font-size: 14px; text-align: right; font-weight: 600;">${failedImages}</td>
                </tr>` : ""}
                ${failedVideos > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Videos Failed</td>
                  <td style="padding: 8px 0; color: #ef4444; font-size: 14px; text-align: right; font-weight: 600;">${failedVideos}</td>
                </tr>` : ""}
                <tr style="border-top: 1px solid #334155;">
                  <td style="padding: 12px 0 4px; color: #e2e8f0; font-size: 15px; font-weight: 600;">Total Ready</td>
                  <td style="padding: 12px 0 4px; color: #6366f1; font-size: 15px; text-align: right; font-weight: 700;">${totalGenerated}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
              Log in to your dashboard to view, download, and manage your generated media.
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${getAppUrl()}/admin/login" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
                View Dashboard
              </a>
            </div>
          </div>

          <div style="padding: 20px 32px; background: #0c1222; text-align: center; border-top: 1px solid #1e293b;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              Smarthinkerz Studio — AI-powered media generation platform
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send notification email:", error);
      return false;
    }

    console.log(`Notification email sent to ${toEmail} (id: ${data?.id})`);
    return true;
  } catch (err) {
    console.error("Error sending notification email:", err);
    return false;
  }
}
