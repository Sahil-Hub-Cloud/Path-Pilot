'use client';

import { FileDown } from 'lucide-react';

interface ExportResumeProps {
  profile: {
    displayName: string;
    email: string;
    learningPath: string;
    collegeName: string;
    yearOfStudy: string;
    skillScore: number;
    labsCompleted: number;
    employabilityLevel: string;
    githubUsername: string;
    badges: string[];
    skills: { label: string; value: number }[];
  };
  className?: string;
}

export default function ExportResume({ profile, className = '' }: ExportResumeProps) {
  const generatePDF = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${profile.displayName} - Path Pilot Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #2C1A0E; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 32px; border-bottom: 3px solid #006B7A; padding-bottom: 24px; }
  .name { font-size: 28px; font-weight: 900; color: #006B7A; margin-bottom: 4px; }
  .tagline { font-size: 13px; color: #8B6E52; font-weight: 600; letter-spacing: 0.05em; }
  .contact { font-size: 12px; color: #8B6E52; margin-top: 8px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #006B7A; border-bottom: 2px solid #EDE4D3; padding-bottom: 6px; margin-bottom: 12px; }
  .stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F5EAD7; }
  .stat-label { font-size: 13px; font-weight: 600; }
  .stat-value { font-size: 13px; font-weight: 800; color: #006B7A; }
  .skill-bar { display: flex; align-items: center; margin-bottom: 8px; }
  .skill-name { width: 100px; font-size: 12px; font-weight: 600; }
  .skill-track { flex: 1; height: 8px; background: #EDE4D3; border-radius: 4px; overflow: hidden; margin: 0 12px; }
  .skill-fill { height: 100%; background: linear-gradient(90deg, #006B7A, #2E7D52); border-radius: 4px; }
  .skill-pct { width: 36px; font-size: 12px; font-weight: 800; color: #006B7A; text-align: right; }
  .badge-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .badge { background: rgba(0,107,122,0.08); border: 1px solid rgba(0,107,122,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #006B7A; }
  .footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 2px solid #EDE4D3; font-size: 11px; color: #B89A7E; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="name">${profile.displayName}</div>
    <div class="tagline">${profile.learningPath ? profile.learningPath + ' Developer' : 'Software Developer'}</div>
    <div class="contact">${profile.email}${profile.collegeName ? ' | ' + profile.collegeName : ''}${profile.yearOfStudy ? ' | Year ' + profile.yearOfStudy : ''}</div>
  </div>

  <div class="section">
    <div class="section-title">Skills & Proficiency</div>
    ${profile.skills.map(s => `
    <div class="skill-bar">
      <div class="skill-name">${s.label}</div>
      <div class="skill-track"><div class="skill-fill" style="width:${s.value}%"></div></div>
      <div class="skill-pct">${s.value}%</div>
    </div>`).join('')}
  </div>

  <div class="section">
    <div class="section-title">Achievements</div>
    <div class="stat-row"><div class="stat-label">AI Skill Score</div><div class="stat-value">${profile.skillScore || 'N/A'}</div></div>
    <div class="stat-row"><div class="stat-label">Labs Completed</div><div class="stat-value">${profile.labsCompleted}</div></div>
    <div class="stat-row"><div class="stat-label">Employability Level</div><div class="stat-value">${profile.employabilityLevel}</div></div>
    ${profile.githubUsername ? `<div class="stat-row"><div class="stat-label">GitHub</div><div class="stat-value">github.com/${profile.githubUsername}</div></div>` : ''}
  </div>

  ${profile.badges.length > 0 ? `
  <div class="section">
    <div class="section-title">Badges Earned</div>
    <div class="badge-list">
      ${profile.badges.map(b => `<div class="badge">${b}</div>`).join('')}
    </div>
  </div>` : ''}

  <div class="footer">
    Generated from Path Pilot | path-pilot-5tb7.vercel.app | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generatePDF}
      className={`flex items-center gap-2 text-xs font-bold text-[var(--peacock-blue)] hover:underline ${className}`}
    >
      <FileDown size={14} /> Export as PDF
    </button>
  );
}
