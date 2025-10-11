const { exec } = require('child_process');

exec('netstat -ano | findstr :8081', (error, stdout) => {
  if (stdout) {
    const lines = stdout.trim().split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') {
        exec(`taskkill /PID ${pid} /F`, (err) => {
          if (!err) console.log(`Killed process ${pid} on port 8081`);
        });
      }
    });
  }
});
