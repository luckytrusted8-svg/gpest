/**
 * Web Audio API Sound Synthesizer for Instant Notifications
 * Zero external audio files, zero network delay, plays crisp notification chime.
 */
export function playNotificationChime(type: 'chime' | 'success' | 'alert' = 'chime') {
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;

        if (type === 'alert') {
            // Urgent Alert Tone (Dual-beep)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(740, now);
            osc.frequency.setValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
            return;
        }

        // Standard Apple/Slack-style Harmonic Crisp Chime
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.28);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.08); // A5
        gain2.gain.setValueAtTime(0.16, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.45);

        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(1174.66, now + 0.14); // D6 Sparkle
        gain3.gain.setValueAtTime(0.08, now + 0.14);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.14);
        osc3.stop(now + 0.55);
    } catch {
        // Safe failover if browser policy restricts audio before user gesture
    }
}
