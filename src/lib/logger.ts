// Production-safe logger utility
// Replaces console.log with environment-aware logging

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    info(message: string, data?: LogData) {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, data || '');
        }
        // In production, send to Sentry/LogRocket
        // this.sendToMonitoring('info', message, data);
    }

    warn(message: string, data?: LogData) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, data || '');
        }
        // In production, send to Sentry
        // this.sendToMonitoring('warn', message, data);
    }

    error(message: string, error?: Error | any, data?: LogData) {
        console.error(`[ERROR] ${message}`, error, data || '');
        // Always send errors to monitoring, even in dev
        // this.sendToMonitoring('error', message, { error, ...data });
    }

    debug(message: string, data?: LogData) {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, data || '');
        }
    }

    // Future: Send to Sentry/LogRocket
    // private sendToMonitoring(level: LogLevel, message: string, data?: LogData) {
    //   if (typeof window !== 'undefined' && window.Sentry) {
    //     window.Sentry.captureMessage(message, {
    //       level,
    //       extra: data
    //     });
    //   }
    // }
}

export const logger = new Logger();
