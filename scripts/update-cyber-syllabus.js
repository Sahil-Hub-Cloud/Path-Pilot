const fs = require('fs');
const path = require('path');

const cyberSecuritySyllabus = [
  {
    title: "Introduction to Cyber Security",
    topics: ["What is Cyber Security?", "Importance of Cyber Security", "Cyber Security Domains", "CIA Triad", "Vulnerability, Threat and Risk"]
  },
  {
    title: "Linux Essentials",
    topics: ["History and Features of Linux", "Architecture of Linux OS", "Linux Distributions", "Linux Command Line", "Software Package Management"]
  },
  {
    title: "Linux Administration",
    topics: ["File System", "Users and Groups", "File/Folder Permissions", "Special Permissions", "Disk Management", "Service and Process Management"]
  },
  {
    title: "Networking Fundamentals",
    topics: ["Computer Networks and Types of Networks", "Network Devices", "IP and MAC Address", "IPv4 and IPV6 Packet Structure", "Addressing and Subnetting", "OSI Model and TCP/IP Model", "Network Protocols (TCP, UDP, ICMP, ARP)", "Network Services (DNS, DHCP, SNMP, FTP)", "Packet Analysis using Wireshark"]
  },
  {
    title: "Network Security",
    topics: ["Internet, Intranet, and Extranet", "DMZ", "DNSSEC", "Firewalls", "IDS, IPS and IDPS", "VPN and tunneling", "Network Address Translation (NAT) and PAT", "Honeypots & Deception Technology", "Practical Assignment - I"]
  },
  {
    title: "Vulnerability Management",
    topics: ["Fundamentals of Vulnerability Assessment and Management", "Vulnerability Assessment tool Deployment Strategy", "Scanning Methodologies", "Authenticated vs Non-Authenticated Scanning", "Planning and Performing Infrastructure Security Assessment", "Interpreting and Calculating CVSS Score", "Risk Identification and Categorization", "Reporting", "Patches and Updates"]
  },
  {
    title: "Network Penetration Testing",
    topics: ["Introduction to Penetration Testing", "Types of Penetration Testing", "Pentesting Services", "Penetration Testing Phases", "Pre-Engagement Actions", "OSINT", "Exploitation (Automated)", "Password Cracking", "Red Team Vs Blue Team Operations"]
  },
  {
    title: "Advanced Network Pentesting",
    topics: ["Manual Exploitation of System Vulnerabilities", "Post-Exploitation", "Privilege Escalation (Linux and Windows)", "Pivoting and Double Pivoting", "Cyber Kill Chain, MITRE ATT&CK"]
  },
  {
    title: "Cryptography",
    topics: ["Introduction to Cryptography", "Symmetric Ciphers", "Asymmetric Ciphers", "Building SSL certificates", "Digital Certificates and Digital Signatures", "Disk Encryption", "Hashing", "Encoding", "Steganography"]
  },
  {
    title: "Active Directory Basics",
    topics: ["Introduction to Active Directory", "Active Directory Setup", "Kerberos Authentication"]
  },
  {
    title: "Active Directory Pentesting",
    topics: ["Active Directory Attack Vectors", "Active Directory Enumeration", "Active Directory Exploitation", "Active Directory Post Exploitation", "AD Defense- Detection"]
  },
  {
    title: "Cyber Security Compliance",
    topics: ["Cyber Security Compliance (GDPR, HIPAA, SOX)", "ISO IEC 27001/ISO 27002", "PCI-DSS", "Penetration Testing Standards (OWASP, WASC, SANS25, PTES, OSSTMM)", "Risk Governance & Risk Management", "Cyber Crime & Classification of Cyber Crimes", "NIST Cybersecurity Framework", "Case Studies", "Practical Assignment - II & Capture The Flag (CTF) - I"]
  },
  {
    title: "Web Fundamentals",
    topics: ["Web application Technologies", "Web Application offence and defence", "Web Reconnaissance", "Web Application Vulnerability Assessment", "CMS Enumeration and Exploitation", "Tools - Nikto, OWASP-Zap, gobuster, wpscan"]
  },
  {
    title: "Web Application Pentesting",
    topics: ["OWASP Top 10 Web Risks", "Web Application Pentesting Checklist", "Authentication & Authorization", "Session Management", "File Security", "Web Application Firewalls", "Tools - BurpSuite, Sqlmap, wafw00f", "Practical Assignment - III & Capture The Flag (CTF) - II"]
  },
  {
    title: "Bug Bounty Insights",
    topics: ["Introduction to bug bounty", "Bug Bounty Hunting vs Penetration Testing", "Bug bounty essentials and platforms", "Mind Maps and Recon", "Bug bounty report writing"]
  },
  {
    title: "Mobile Application, IoT & Cloud Security",
    topics: ["Mobile app vulnerabilities and exploitation techniques", "IoT Security", "Cloud security architecture concepts and security considerations", "Threats and mitigation strategies for cloud data security", "Legal and compliance aspects of cloud security"]
  },
  {
    title: "Social Engineering & Wi-Fi Security Fundamentals",
    topics: ["Different social engineering attack types and techniques", "Defenses against social engineering attacks", "Wi-Fi security protocols and their weaknesses", "Common Wi-Fi attacks (aircrack-ng, rogue APs, captive portals)", "Strategies for securing mobile apps and Wi-Fi networks"]
  },
  {
    title: "Scripting Basics for Pentesting",
    topics: ["Basics of Shell Scripting", "Basics of Python Programming", "Automating Pentesting with Python"]
  },
  {
    title: "Threat Intelligence",
    topics: ["Introduction to Threat Intelligence", "Indicators of Compromise(IOC)", "Indicators of Attack(IOA)", "Indicators of Exposure(IOE)", "Threat Hunting"]
  },
  {
    title: "Security Operations Fundamentals",
    topics: ["Introduction to SIEM", "Enterprise Infrastructure", "Security Operations Essentials"]
  },
  {
    title: "Security Operations with QRadar",
    topics: ["IBM Qradar - Log Analysis", "IBM Qradar - Network/Flow Analysis", "Offense Management", "AQL", "Asset/Dashboard Management", "DSM", "Rule Management"]
  },
  {
    title: "Security Operations with Splunk",
    topics: ["SOC Analysis using Splunk", "Search Processing Language Basics", "Splunk Knowledge Objects", "Generating Alerts", "SOAR"]
  },
  {
    title: "Enterprise Security Concepts",
    topics: ["Endpoint Security", "Endpoint Detection and Response(EDR/XDR)", "Data Leakage Prevention", "Practical Assignment - IV"]
  }
];

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const roadmapsPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'roadmaps.ts');
let roadmapsContent = fs.readFileSync(roadmapsPath, 'utf8');

// Build the new chapters array string
let newChaptersStr = 'chapters: [\n';
let topicIdCounter = 1000;

cyberSecuritySyllabus.forEach((module, mIndex) => {
  newChaptersStr += `            {\n`;
  newChaptersStr += `                id: "ch${mIndex + 1}-cybersecurity",\n`;
  newChaptersStr += `                title: ${JSON.stringify(module.title)},\n`;
  newChaptersStr += `                description: "Master the concepts of ${module.title}",\n`;
  newChaptersStr += `                estimatedHours: 10,\n`;
  newChaptersStr += `                topics: [\n`;
  
  module.topics.forEach((topic, tIndex) => {
    const slug = generateSlug(topic);
    newChaptersStr += `                    { id: "topic_${slug}", title: ${JSON.stringify(topic)}, difficulty: "Intermediate", duration: "1.5 hours", videoUrl: "https://www.youtube.com/embed/a03XHaG26L8" /* NetworkChuck */ }${tIndex < module.topics.length - 1 ? ',' : ''}\n`;
  });
  
  newChaptersStr += `                ]\n`;
  newChaptersStr += `            }${mIndex < cyberSecuritySyllabus.length - 1 ? ',' : ''}\n`;
});
newChaptersStr += '        ],';

// Use a regex to find the chapters array within the cybersecurity object
// We know it starts with "chapters: [" and ends before "steps: [" inside the cybersecurity object.

const cybersecurityRegex = /("cybersecurity"|'cybersecurity'|cybersecurity):\s*\{[\s\S]*?(chapters:\s*\[[\s\S]*?\]\s*,)\s*steps:/;
const match = roadmapsContent.match(cybersecurityRegex);

if (match && match[2]) {
  console.log('Found chapters array, replacing...');
  roadmapsContent = roadmapsContent.replace(match[2], newChaptersStr + '\n        ');
  fs.writeFileSync(roadmapsPath, roadmapsContent, 'utf8');
  console.log('Successfully updated roadmaps.ts');
} else {
  console.error('Could not find chapters array for cybersecurity!');
}
