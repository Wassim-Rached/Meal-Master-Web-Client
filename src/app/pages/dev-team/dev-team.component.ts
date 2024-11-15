import { Component } from '@angular/core';
import { SharedModule } from '../../shared-module/shared-module.module';

import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Developer {
  name: string;
  role: string;
  image: string;
  githubLink: string;
  linkedinLink: string;
}

@Component({
  selector: 'app-dev-team',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './dev-team.component.html',
  styleUrl: './dev-team.component.css',
})
export class DevTeamComponent {
  developers: Developer[] = [
    {
      name: 'Wassim Rached',
      role: 'Back-End Developer',
      image: 'https://www.wassimrached.me/_next/image?url=%2Fme.png&w=384&q=75',
      githubLink: 'https://github.com/wassim-rached',
      linkedinLink: 'https://www.linkedin.com/in/wassim-rached-407994239',
    },
    {
      name: 'Zayneb Lemjid',
      role: 'Web Developer',
      image:
        'https://media.licdn.com/dms/image/v2/D4D03AQES1uUnHRWP-g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729722743846?e=1736985600&v=beta&t=BC0DtmqAFKveyU2thrjLYdFmGvQ-Up5yBn-JjX8z60U',
      githubLink: '',
      linkedinLink: 'https://www.linkedin.com/in/zayneb-lemjid',
    },
    {
      name: 'Chayma Chouikh',
      role: 'Web Developer',
      image:
        'https://media.licdn.com/dms/image/v2/D4E03AQGNDbWNpu6PaA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731103109828?e=1736985600&v=beta&t=gB16obPbb7l6Bqyo8Hg5rTwTvjuLrITES58slHkC1P0',
      githubLink: '',
      linkedinLink: 'https://www.linkedin.com/in/chayma-chouikh',
    },
    {
      name: 'Mohamed Yassine Souissi',
      role: 'Web Developer',
      image:
        'https://www.freelances.tn/wp-content/uploads/2023/12/1687823831071-1701546398-300x300.jpeg',
      githubLink: '',
      linkedinLink: 'https://www.linkedin.com/in/mohamed-yassine-souissi',
    },
  ];

  get solidIcons() {
    return { faGithub, faLinkedin };
  }
}
