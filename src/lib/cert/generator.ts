export interface CertificateData {
    pilotName: string;
    missionTitle: string;
    date: string;
    hash: string;
    credits: number;
    isMinted?: boolean;
    txHash?: string;
}

export function generateCertificateSVG(data: CertificateData): string {
    const verifiedBadge = data.isMinted ? `
        <rect x="620" y="50" width="140" height="30" rx="15" fill="#10B981" fill-opacity="0.1" stroke="#10B981" stroke-width="1"/>
        <text x="690" y="70" text-anchor="middle" fill="#10B981" style="font-family: Arial; font-weight: 900; font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;">Verified by Polygon</text>
    ` : '';

    return `
<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="800" height="600" fill="#020617"/>
    <rect x="20" y="20" width="760" height="560" stroke="#06B6D4" stroke-width="2" stroke-opacity="0.2"/>
    <rect x="40" y="40" width="720" height="520" stroke="#06B6D4" stroke-width="1" stroke-opacity="0.1"/>
    
    ${verifiedBadge}
    
    <!-- Decorative Elements -->
    <path d="M0 0L100 0L0 100V0Z" fill="#06B6D4" fill-opacity="0.05"/>
    <path d="M800 600L700 600L800 500V600Z" fill="#06B6D4" fill-opacity="0.05"/>
    
    <!-- Content -->
    <text x="400" y="150" text-anchor="middle" fill="#06B6D4" style="font-family: Arial; font-weight: 900; font-size: 14px; letter-spacing: 0.5em; text-transform: uppercase;">Neural Mastery Certification</text>
    <text x="400" y="220" text-anchor="middle" fill="white" style="font-family: Arial; font-weight: 900; font-size: 32px; text-transform: uppercase;">${data.pilotName}</text>
    
    <line x1="300" y1="250" x2="500" y2="250" stroke="#06B6D4" stroke-width="2" stroke-opacity="0.5"/>
    
    <text x="400" y="300" text-anchor="middle" fill="white" fill-opacity="0.4" style="font-family: Arial; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Has successfully synchronized with the neural patterns of</text>
    <text x="400" y="340" text-anchor="middle" fill="#06B6D4" style="font-family: Arial; font-weight: 900; font-size: 24px; text-transform: uppercase;">${data.missionTitle}</text>
    
    <text x="400" y="420" text-anchor="middle" fill="white" fill-opacity="0.2" style="font-family: Arial; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;">Validation Date: ${data.date} // Credits Awarded: ${data.credits} ♦</text>
    
    <!-- Seal/Hash -->
    <circle cx="400" cy="500" r="40" stroke="#06B6D4" stroke-width="1" stroke-opacity="0.3"/>
    <text x="400" y="505" text-anchor="middle" fill="#06B6D4" style="font-family: Arial; font-weight: 900; font-size: 12px;">P-B</text>
    
    <text x="400" y="570" text-anchor="middle" fill="white" fill-opacity="0.1" style="font-family: Arial; font-size: 8px; letter-spacing: 0.1em;">NEURAL_HASH: ${data.hash}</text>
</svg>
    `.trim();
}

export function generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

export async function mintCertificate(pilotName: string, missionTitle: string): Promise<CertificateData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const hash = generateHash(`${pilotName}-${missionTitle}-${Date.now()}`);
    const txHash = `0x${generateHash(hash + 'poly')}${generateHash(hash + 'gon')}`;

    return {
        pilotName,
        missionTitle,
        date: new Date().toLocaleDateString(),
        hash,
        credits: 50,
        isMinted: true,
        txHash
    };
}
