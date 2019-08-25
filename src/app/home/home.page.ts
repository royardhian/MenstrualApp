import { Component, Inject, LOCALE_ID, Input, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  IMonthViewDisplayEventTemplateContext: any;
  startingDayMonth = 0;
  aqi: any;
  private days: {
    date: Date;
    label: string;
    secondary: boolean;
  }[];
  dayHeaders: any;
  datePipe: any;
  currentDate: Date = new Date();

  constructor(private router: Router, @Inject(LOCALE_ID) private appLocale: string) {

    // this.http = http;
    // this.presentLoading();
    // this.loader = loader;
    // this.aqi = { data: {} };
    // this.reload();
    // this.navCtrl.push(LockScreenComponent,{
    //       code:'1234',
    //       ACDelbuttons:true,
    //       passcodeLabel:'Please Enter Passcode',
    //       onCorrect:function(){
    //         console.log('Correct!');
    //       },
    //       onWrong:function(attemptNumber){
    //         console.log(attemptNumber + ' wrong passcode attempt(s)');
    //       }
    //     });

  }
  ngOnInit() {
    this.datePipe = new DatePipe(this.appLocale);
    const step = this.getStep('month');
    const direction = 0;
    let calculateCalendarDate = new Date(this.currentDate.getTime());

    const year = calculateCalendarDate.getFullYear() + direction * step.years,
      month = calculateCalendarDate.getMonth() + direction * step.months,
      date = calculateCalendarDate.getDate() + direction * step.days;

    calculateCalendarDate.setFullYear(year, month, date);

    const firstDayInNextMonth = new Date(year, month, 1);
    if (firstDayInNextMonth.getTime() <= calculateCalendarDate.getTime()) {
      calculateCalendarDate = new Date(firstDayInNextMonth.getTime() - 24 * 60 * 60 * 1000);
    }
    console.log(firstDayInNextMonth);
    console.log(calculateCalendarDate);
    const start = this.getRange(calculateCalendarDate);
    console.log(start);

    this.days = [];
    this.getViewData(start.startTime);
    console.log(this.dayHeaders);
    console.log(this.days);
    this.IMonthViewDisplayEventTemplateContext = { estimate: this.days };

    console.log('masuk');
  }
  gotoLogin() {
    this.router.navigate(['/login']);
  }
  getRange(currentDate: Date): {startTime: Date , endTime: Date} {
    const year = currentDate.getFullYear(),
        month = currentDate.getMonth(),
        firstDayOfMonth = new Date(year, month + 1, 1),
        difference = this.startingDayMonth - firstDayOfMonth.getDay(),
        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
        startDate = new Date(firstDayOfMonth.getTime());

    if (numDisplayedFromPreviousMonth > 0) {
        startDate.setDate(-numDisplayedFromPreviousMonth + 1);
    }

    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 42);

    return {
        startTime: startDate,
        endTime: endDate
    };
}
  private getStep(mode: any): { years: number; months: number; days: number; } {
    switch (mode) {
      case 'month':
        return {
          years: 0,
          months: 1,
          days: 0
        };
      case 'week':
        return {
          years: 0,
          months: 0,
          days: 7
        };
      case 'day':
        return {
          years: 0,
          months: 0,
          days: 1
        };
    }
  }

  getDates(startDate: Date, n: number): Date[] {
    // tslint:disable-next-line: prefer-const
    let dates = new Array(n),
      // tslint:disable-next-line: prefer-const
      current = new Date(startDate.getTime()),
      i = 0;
    current.setHours(12); // Prevent repeated dates because of timezone bug
    while (i < n) {
      dates[i] = new Date(current.getTime());
      current.setDate(current.getDate() + 1);
      i++;
    }
    return dates;
  }
  getViewData(startTime: Date) {
    const startDate = startTime,
      date = startDate.getDate(),
      month = (startDate.getMonth() + (date !== 1 ? 1 : 0)) % 12;

    const dates = this.getDates(startDate, 42);
    for (let i = 0; i < 42; i++) {
      const dateObject = this.createDateObject(dates[i]);
      dateObject.secondary = dates[i].getMonth() !== month;
      this.days[i] = dateObject;
    }

    this.dayHeaders = [];
    for (let i = 0; i < 7; i++) {
      this.dayHeaders.push(this.datePipe.transform(this.days[i].date, 'EEE'));
    }
  }
  createDateObject(date: Date) {
    this.datePipe = new DatePipe(this.appLocale);
    let current = false;
    if (this.datePipe.transform(date, 'd MM YYYY') === this.datePipe.transform(this.currentDate, 'd MM YYYY')) {
      current = true;
  }
    return {
      date,
      label: this.datePipe.transform(date, 'd'),
      secondary: false,
      current
    };
  }
  getHighlightClass(date: any): string {
    let className = '';

    // if (date.hasEvent) {
    //     if (date.secondary) {
    //         className = 'monthview-secondary-with-event';
    //     } else {
    //         className = 'monthview-primary-with-event';
    //     }
    // }

    // if (date.selected) {
    //     if (className) {
    //         className += ' ';
    //     }
    //     className += 'monthview-selected';
    // }

    if (date.current) {
        if (className) {
            className += ' ';
        }
        className += 'monthview-current';
    }

    if (date.secondary) {
        if (className) {
            className += ' ';
        }
        className += 'text-muted';
    }

    // if (date.disabled) {
    //     if (className) {
    //         className += ' ';
    //     }
    //     className += 'monthview-disabled';
    // }
    return className;
}
  // async presentLoading() {
  //   const loading = await this.loader.create({
  //     message: 'Loading'
  //   });
  //   await loading.present();
  // }
  //
  // reload() {
  //   this.http.get(`https://api.waqi.info/feed/here/?token=1107613628774daa0b8be4ac0d693c58304d9657`)
  //     .toPromise()
  //     .then(response => {
  //       this.aqi = response;
  //       console.log(this.aqi);
  //       this.loader.dismiss();
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       this.loader.dismiss();
  //     });
  // }
  // aqiStatus(val) {
  //   console.log(val);
  //   if (val <= 50) {
  //     return { code: 'good', val: 'Good' };
  //   } else if (val <= 100) {
  //     return { code: 'mod', val: 'Moderate' };
  //   } else if (val <= 200) {
  //     return { code: 'unhealthy', val: 'Unhealthy' };
  //   } if (val <= 300) {
  //     return { code: 'vunhealthy', val: 'Very Unhealthy' };
  //   } else if (val > 300) {
  //     return { code: 'hazardous', val: 'Hazardous' };
  //   } else {
  //     return { code: '', val: '' }
  //   }
  // }
}
