import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('secondHand')secondHand: any;
  @ViewChild('minsHand')minsHand: any;
  @ViewChild('hourHand')hourHand: any;

  title = 'innovex';
  today = new Date(2022, 5, 20, 0, 0, 0, 0);
  currenttask = {
    title: '',
    description: '',
    color: '',
    system_time: this.today
  }
  secondsDegrees: string;
  minsDegrees: string;
  hourDegrees: string;

  runningServers: number = 0;
  wall_color = '#a9a9a9';
  clock_face_color = '#f2f2f2';
  hour_label_color= '#ff0000';
  currentClockTime: Date;
  allTasks = [];

  modalRef?: BsModalRef;

  constructor(private el: ElementRef, private renderer: Renderer2, private modalService: BsModalService) {
  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    let sec = 0;
      let min = 0;
      let hour = 0;
    setInterval(() => {
      if (sec<60) {
        sec++
      } else if (sec===60) {
        sec=0;
        min++;
      }
      if (min>60) {
        hour++;
        min=0;
        sec=0;
      }
      const now = new Date(2022, 5, 20, hour, min, sec);
      this.setDate(now);
    }, 1000);
    setInterval(() => {
      //start n random servers between 10 and 20 inclusive
      this.startServer();
    }, 30000)
    setInterval(() => {
      // stop n random servers between 5 and K inclusive
      this.stopServer();
    }, 40000)
    setInterval(() => {
      // report K servers running
      this.reportServer()
    }, 50000)
  }
  
  setDate(now): void {
    const seconds = now.getSeconds();
    this.secondsDegrees = `rotate(${((seconds / 60) * 360) + 90}deg)`;
    this.renderer.setStyle(this.secondHand.nativeElement, 'transform', this.secondsDegrees);
    const mins = now.getMinutes();
    this.minsDegrees = `rotate(${((mins / 60) * 360) + ((seconds/60)*6) + 90}deg)`;
    this.renderer.setStyle(this.minsHand.nativeElement, 'transform', this.minsDegrees);
    const hour = now.getHours();
    this.hourDegrees = `rotate(${((hour / 12) * 360) + ((mins/60)*30) + 90}deg)`;
    this.renderer.setStyle(this.hourHand.nativeElement, 'transform', this.hourDegrees);
    this.currentClockTime = new Date(2022, 5, 20, hour, mins, seconds);
  } 

  startServer(): void {
    // get a random number between 10 and 20 inclusive
    const randomStartServers = this.getRandomIntInclusive(10, 20);
    // increment number of running servers
    this.runningServers = this.runningServers + randomStartServers;
    // get a random color(rc) and assign to wall color
    this.wall_color = `#${Math.floor(Math.random()*16777215).toString(16)}`; 
    // send number along with random wall color(rc)
    const nowtime = new Date();
    this.currenttask = {
      title: 'START',
      description: `${this.currentClockTime} - start ${randomStartServers} servers `,
      color: this.wall_color,
      system_time: nowtime
    }
    this.allTasks.push(this.currenttask);
  }
  stopServer(): void {
    // get a random number between 5 and K 
    const randomStopServers = this.getRandomIntInclusive(5, this.runningServers);
    // decrement number of running servers by the random number
    this.runningServers = this.runningServers - randomStopServers;
    // get a random clock face color(rcfc)
    this.clock_face_color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    // send number along with random clock face color(rcfc)
    const nowtime = new Date();

    this.currenttask = {
      title: 'STOP',
      description: `${this.currentClockTime} - stop ${randomStopServers} servers `,
      color: this.clock_face_color,
      system_time: nowtime
    }
    this.allTasks.push(this.currenttask);

  }
  reportServer(): void {
    // get a random hour label color (rhlc)
    this.hour_label_color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    // send number along with a random hour label color(rhlc)
    const nowtime = new Date();
    this.currenttask = {
      title: 'REPORT',
      description: `${this.currentClockTime} - report ${this.runningServers} servers running`,
      color: this.hour_label_color,
      system_time: nowtime
    }
    this.allTasks.push(this.currenttask);

  }
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
