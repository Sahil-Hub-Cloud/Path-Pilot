import { Roadmap, Task, StudentProfile } from './store';

// Helper to get day name
function getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function scheduleRoadmap(roadmap: Roadmap, profile: StudentProfile, startDate: Date = new Date()): Roadmap {
    const scheduledTasks: Task[] = [];
    let currentDate = new Date(startDate);

    // Create a deep copy of tasks to modify
    const tasksToSchedule = [...roadmap.tasks];

    // Map of TaskId -> Completed/Scheduled Date (to handle prerequisites)
    // For MVP we assume the topological sort from roadmap generator is sufficient order.
    // We just process them in order.

    for (const task of tasksToSchedule) {
        if (task.status === 'completed') {
            scheduledTasks.push(task);
            continue;
        }

        let hoursRemaining = task.estimatedHours;

        // Find the next available slot(s)
        // We assume tasks are done sequentially for now (one at a time)
        // In a real app, we might parallelize.

        while (hoursRemaining > 0) {
            const dayName = getDayName(currentDate);
            const hoursAvailableToday = profile.availability[dayName] || 0;

            // Simple logic: If we have time today, use it. 
            // Note: This logic assumes we consume the WHOLE available time for this task until finished.
            // In reality, we must track "consumed hours" for the current date if multiple tasks fit.
            // For MVP, we'll simplify: One task per slot or spread across days? 
            // Let's just decrement hours.

            if (hoursAvailableToday > 0) {
                // We simulate work being done.
                // If task takes 10 hours, and we have 2 hours today. We do 2 hours, 8 remaining. Move to next day.
                // effectively, the due date is when hoursRemaining <= 0.

                // We don't track partial progress in the Date object here, just moving forward.
                // But for multiple tasks on same day? 
                // We need a pointer "currentDay time used".
            }

            // Better simplified constraint: 
            // Just step forward day by day until we accumulate enough hours.

            // Optimization: We are not implementing fine-grained hour tracking for MVP Step 1.
            // We will just assume we start at the beginning of 'currentDate'

            const dailyCap = hoursAvailableToday;
            if (dailyCap > 0) {
                if (hoursRemaining <= dailyCap) {
                    // Finish today
                    hoursRemaining = 0;
                    // We don't increment currentDate here because we might strictly fit? 
                    // actually let's assume one massive task consumes the day and moves to next.
                } else {
                    hoursRemaining -= dailyCap;
                    currentDate = addDays(currentDate, 1);
                }
            } else {
                // No work today, skip
                currentDate = addDays(currentDate, 1);
            }
        }

        // Task finished on currentDate
        scheduledTasks.push({
            ...task,
            dueDate: currentDate.toISOString()
        });

        // For next task, do we start on same day? 
        // To be safe and simple: start next task on the NEXT day ? 
        // Or keep accumulating? 
        // Let's Just add 1 day buffer to keep it chill.
        currentDate = addDays(currentDate, 0); // No buffer?
        // Actually, if we finished mid-day, we technically have time left. 
        // But complexity wise, let's just say "Next task starts after".
    }

    return {
        ...roadmap,
        tasks: scheduledTasks,
        updatedAt: new Date().toISOString()
    };
}
