class HapticsManager {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public trigger(duration = 35) {
    if (!this.enabled) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    } catch {
      // Ignore vibration errors
    }
  }

  public triggerPattern(pattern: number[]) {
    if (!this.enabled) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore
    }
  }

  public triggerTabooError() {
    if (!this.enabled) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        // Distinct buzzing error vibration pattern
        navigator.vibrate([140, 60, 180, 60, 220]);
      }
    } catch {
      // Ignore
    }
  }
}

export const haptics = new HapticsManager();
