export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import vm from 'vm';

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ output: 'No code provided.' }, { status: 400 });
        }

        // Sandbox execution using built-in vm
        let output = '';
        const context = {
            console: {
                log: (...args: any[]) => {
                    output += args.map(a => String(a)).join(' ') + '\n';
                },
                error: (...args: any[]) => {
                    output += '[Error] ' + args.map(a => String(a)).join(' ') + '\n';
                }
            }
        };

        try {
            vm.createContext(context);
            vm.runInContext(code, context, { timeout: 1000 });
        } catch (e: any) {
            output += `\nRuntime Error: ${e.message}`;
        }

        return NextResponse.json({ output: output || 'Program executed successfully with no output.' });

    } catch (error: any) {
        return NextResponse.json({ output: `System Error: ${error.message}` }, { status: 500 });
    }
}

