import { Component, EventEmitter, input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import  * as AvatarSize from '../../models/enums/avatar-size';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './avatar.component.css'
})
export class AvatarComponent implements OnInit {
  src = input.required<string>();
  name  = input.required<string>();
  displayCircle = input<boolean>(true);
  size = input<AvatarSize.AvatarSize>(AvatarSize.AvatarSize.md);
  @Output() avatarClicked: EventEmitter<any> = new EventEmitter<any>();

  borderRadius: string = '';
  initials: string = '';
  AvatarSize = AvatarSize.AvatarSize;
  ngOnInit(): void {
    let name = this.name();
    if (name){
      let names = name.split(' ');
      names.forEach(n => {
        this.initials+= n.substring(0,1).toUpperCase();
      });
    }

    this.borderRadius = this.displayCircle() ? '50%' : '0';
  }

  onAvatarClicked(): void {
    this.avatarClicked.emit();
  }

  textClass() : string {
    switch (this.size()){
      case AvatarSize.AvatarSize.lg:
        return 'h1'
      case AvatarSize.AvatarSize.md:
        return 'h3'
      default:
        return 'h6'
    }
  }

  sizeClass() : string {
    switch (this.size()){
      case AvatarSize.AvatarSize.lg:
        return 'lg'
      case AvatarSize.AvatarSize.sm:
        return 'sm'
      default:
        return ''
    }
  }
}
