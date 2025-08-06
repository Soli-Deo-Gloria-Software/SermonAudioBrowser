import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  standalone: false
})
export class AvatarComponent implements OnInit {
  @Input() src: string;
  @Input() name: string;
  @Input() displayCircle: boolean = true;
  @Output() avatarClicked: EventEmitter<any> = new EventEmitter<any>();

  borderRadius: string = '';
  initials: string = '';
  ngOnInit(): void {
    if (this.name){
      let names = this.name.split(' ');
      names.forEach(n => {
        this.initials+= n.substring(0,1).toUpperCase();
      });
    }

    this.borderRadius = this.displayCircle ? '50%' : '0';
  }

  onAvatarClicked(): void {
    this.avatarClicked.emit();
  }
}
