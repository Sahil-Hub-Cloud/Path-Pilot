# Security Policy

## Supported Versions
Only the latest version of the `main` branch is actively supported with security updates.

## Zero Trust Architecture
PathPilot employs a strict Zero Trust Architecture. We assume all requests are malicious until proven otherwise.
- All endpoints are strictly rate limited via Upstash.
- Strict CSP and CORS policies are enforced across all Edge nodes.
- All data mutations are verified server-side via robust Firestore Rules V2.
- Code submissions are deeply sandboxed, stripped, and rate-limited.

## Reporting a Vulnerability
We take the security of PathPilot very seriously. If you believe you have found a vulnerability, please report it to us immediately.

1. Email your findings to **security@pathpilot.ai**.
2. Include full details, steps to reproduce, and any Proof of Concept (PoC) code.
3. Please do not disclose the vulnerability publicly until we have had a chance to remediate it.

## Bug Bounty
We run a private bug bounty program for critical vulnerabilities including:
- Remote Code Execution (RCE) escaping the Judge0 sandbox.
- Authentication Bypasses (Identity Toolkit, Firestore).
- Unauthorized access to Firestore `security_logs` or `blocked_ips`.
- SQLi or NoSQLi leading to data exfiltration.

Contact us via email for more details.
