import { Resend } from 'resend';

const FEEDBACK_TO = 'l729455589@gmail.com';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
    return;
  }

  const { type, message, contact, diagnostics } = req.body ?? {};
  if (!type || !message || !diagnostics) {
    res.status(400).json({ error: 'Invalid feedback payload' });
    return;
  }

  const resend = new Resend(apiKey);
  const subject = `[极简记账] 问题反馈 - ${type}`;
  const text = [
    `问题类型: ${type}`,
    `联系方式: ${contact || '-'}`,
    '',
    '问题说明:',
    message,
    '',
    '诊断信息:',
    `语言: ${diagnostics.language}`,
    `页面: ${diagnostics.url}`,
    `PWA: ${diagnostics.standalone ? 'standalone' : 'browser'}`,
    `时间: ${diagnostics.currentTime}`,
    `版本: ${diagnostics.appVersion}`,
    `设备: ${diagnostics.userAgent}`,
    `记账数量: ${diagnostics.counts?.expenses ?? 0}`,
    `日程数量: ${diagnostics.counts?.schedules ?? 0}`,
    `店铺记忆数量: ${diagnostics.counts?.storeMemories ?? 0}`,
  ].join('\n');

  try {
    await resend.emails.send({
      from: 'SimpleBook <onboarding@resend.dev>',
      to: FEEDBACK_TO,
      subject,
      text,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to send feedback' });
  }
}
