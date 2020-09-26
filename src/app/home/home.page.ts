import { Component } from '@angular/core';

import { timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  DURATION_IN_SECONDS = 120;
  MILLISECONDS_PER_SECOND = 1000;
  end_time: Date;
  seconds: number;
  progressbar_value: number;
  timer_subscription: any;

  constructor() {}

  ionViewDidEnter() {
    console.log('ionViewDidEnter...');
    this.setupAndStartTimer();
  }

  evalTimeDifference() {
    const now = new Date();
    const remaining_time_in_milliseconds = this.end_time.getTime() - now.getTime();
    console.log('remaining_time_in_milliseconds:', remaining_time_in_milliseconds)
    const is_time_elapsed = remaining_time_in_milliseconds <= 0;
    if (!is_time_elapsed) {
      this.seconds = Math.floor(remaining_time_in_milliseconds / 1000);
      this.progressbar_value = 1 - (remaining_time_in_milliseconds / (this.DURATION_IN_SECONDS * this.MILLISECONDS_PER_SECOND));
    }
    else {
      this.seconds = 0;
      this.progressbar_value = 1;
      this.stopTimer();
    }
  }

  private setupAndStartTimer() {
    const now = new Date();
    console.log('now:', now);
    const duration_in_milliseconds = this.DURATION_IN_SECONDS * this.MILLISECONDS_PER_SECOND;
    this.end_time = new Date(now.getTime() + duration_in_milliseconds);
    console.log('ts_end:', this.end_time);

    const source = timer(0, 100);
    this.timer_subscription = source.subscribe(() => this.evalTimeDifference());
  }

  private stopTimer() {
    this.timer_subscription.unsubscribe();
  }
}
