import cron from 'node-cron';
import { Reminder, User } from '../models/SimpleModels.js';
import { sendReminderEmail } from './emailService.js';

// Schedule reminders check every minute
export const initReminderScheduler = (io) => {
  console.log('📅 Reminder scheduler initialized');

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay(); // 0-6 (Sunday-Saturday)

      // Find active reminders for current time
      const allReminders = Reminder.find({ isActive: true });
      const reminders = allReminders.filter(reminder => 
        reminder.schedule?.time === currentTime
      );

      for (const reminder of reminders) {
        const { frequency, daysOfWeek, endDate } = reminder.schedule;

        // Check if reminder should fire based on frequency
        let shouldFire = false;

        if (frequency === 'daily') {
          shouldFire = true;
        } else if (frequency === 'weekly' && daysOfWeek && daysOfWeek.includes(currentDay)) {
          shouldFire = true;
        } else if (frequency === 'once') {
          // Check if not already notified
          shouldFire = !reminder.notified;
        }

        // Check end date
        if (endDate && now > new Date(endDate)) {
          shouldFire = false;
          reminder.isActive = false;
          Reminder.findByIdAndUpdate(reminder._id, { isActive: false });
        }

        if (shouldFire) {
          // Get user data
          const user = User.findById(reminder.userId);
          
          // Send notification via Socket.io
          if (io && user) {
            io.to(reminder.userId.toString()).emit('reminder', {
              id: reminder._id,
              title: reminder.title,
              description: reminder.description,
              type: reminder.type,
              time: currentTime,
            });
          }

          // Send email if enabled (simplified for local storage)
          console.log(`📧 Reminder: ${reminder.title} for user ${reminder.userId}`);

          // Update reminder (simplified for local storage)
          console.log(`✅ Reminder fired: ${reminder.title}`);
          
          // If 'once' frequency, deactivate
          if (frequency === 'once') {
            reminder.isActive = false;
            Reminder.findByIdAndUpdate(reminder._id, { isActive: false });
          }

        }
      }
    } catch (error) {
      console.error('❌ Reminder scheduler error:', error);
    }
  });
};
