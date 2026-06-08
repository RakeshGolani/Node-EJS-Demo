const { Job } = require("./models");
const { sendEmailJobsQue } = require("./utils/admin/sendEmail");

async function jobWorker() {
    while (true) {
        const job = await Job.findOne({
            where: { queue: "emails", reserved_at: null },
            order: [["id", "ASC"]],
        });

        if (!job) {
            // nothing found → small sleep to avoid 100% CPU
            await new Promise(r => setImmediate(r));
            continue;
        }

        try {
            job.reserved_at = new Date();
            await job.save();

            let payload = job.payload;
            if (typeof payload === "string") {
                payload = JSON.parse(payload);
            }

            await sendEmailJobsQue(
                payload.emailTemplate,
                payload.userName,
                payload.email,
                payload.data,
                payload.subject
            );

            await job.destroy();
            console.log(`✅ Job ${job.id} completed`);
        } catch (err) {
            job.attempts += 1;
            await job.save();
            console.error(`❌ Job ${job.id} failed (attempt ${job.attempts}):`, err.message);
        }
    }
}

// Start worker
jobWorker();