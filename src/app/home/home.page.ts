import { Component } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Plugins } from '@capacitor/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
const { App } = Plugins;

import { timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  DURATION_IN_SECONDS = 120;
  MILLISECONDS_PER_SECOND = 1000;
  OVI_ISCH_FERTIG_AUDIO_ASSET_PATH = 'assets/ovi_isch_fertig.aac';
  end_time: Date;
  seconds: number;
  progressbar_value: number;
  timer_subscription: any;

  constructor(
    private nativeAudio: NativeAudio,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private screenOrientation: ScreenOrientation
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
      else {
        console.log('cannot exit');
      }
    });
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  ionViewDidEnter() {
    this.setupAndStartTimerForCountdown();
  }

  private evalTimeDifference() {
    const now = new Date();
    const remaining_time_in_milliseconds = this.end_time.getTime() - now.getTime();
    console.log('remaining_time_in_milliseconds:', remaining_time_in_milliseconds)
    const is_time_elapsed = remaining_time_in_milliseconds <= 0;
    if (!is_time_elapsed) {
      this.seconds = 1 + Math.floor(remaining_time_in_milliseconds / 1000);
      this.progressbar_value = 1 - (remaining_time_in_milliseconds / (this.DURATION_IN_SECONDS * this.MILLISECONDS_PER_SECOND));
    }
    else {
      this.seconds = 0;
      this.progressbar_value = 1;
      this.stopTimer();
      this.setupAndStartTimerForPlaySound();
    }
  }

  private setupAndStartTimerForCountdown() {
    const now = new Date();
    const duration_in_milliseconds = this.DURATION_IN_SECONDS * this.MILLISECONDS_PER_SECOND;
    this.end_time = new Date(now.getTime() + duration_in_milliseconds);
    const source = timer(0, 100);
    this.timer_subscription = source.subscribe(() => this.evalTimeDifference());
  }

  private stopTimer() {
    this.timer_subscription.unsubscribe();
  }

  private setupAndStartTimerForPlaySound() {
    const source = timer(0, 3000);
    this.timer_subscription = source.subscribe(() => this.playSound());
  }

  private playSound() {
    this.nativeAudio.preloadSimple('audio_1', this.OVI_ISCH_FERTIG_AUDIO_ASSET_PATH).then((value: any) => {
      console.log('preload succeeded:', value);
      this.nativeAudio.play('audio_1');
    }, (reason: any) => {
      console.log('preload failed:', reason);
      this.nativeAudio.play('audio_1');
    });
  }
}
