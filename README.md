<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="src/assets/title.PNG" alt="Logo" width="300px">
  </a>
<h3 align="center">Spotify Who is Who</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Spotify Who is Who Title][title]](https://github.com/fasttrackd-student-work/angular-whos-who-sprint-09-2023-assessment-2-team-1-1)

For this assessment, students are tasked with developing a front-end Angular application that interfaces with [Spotify's API](https://developer.spotify.com/) in order to get genres, artists, and **sample** songs. The user will then be able to listen to songs and guess which artist created it.

### Built With

- [![Node.js][Node.js]][Node.js-url]
- [![Angular][Angular.io]][Angular-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]
- [![Spotify][Spotify API]][Spotify-url]

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- [Node.js, npm](https://nodejs.org/)

- [Angular](https://angular.io/guide/setup-local)

  ```sh
  npm install -g @angular/cli
  ```

- [Spotify Developer Account and App](https://developer.spotify.com/documentation/web-api/concepts/apps)

### Installation

1. Create an application on Spotify
2. Clone the repo

   ```sh
   git clone https://github.com/fasttrackd-student-work/angular-whos-who-sprint-09-2023-assessment-2-team-1-1
   ```

3. Install NPM packages

   ```sh
   npm install
   ```

4. Enter your Client ID and Client Secret in `src/app/config.ts`

   ```js
   export const client_id = "YOUR_CLIENT_ID_HERE";
   export const client_secret = "YOUR_CLIENT_SECRET_HERE";
   ```

5. Run the project
   ```sh
   ng serve
   ```

<!-- CONTACT -->

## Contact

Mika Nelson - mika.nelson@protonmail.com

Natalia Shnur - nataliashnur@gmail.com

Project Link: [https://github.com/fasttrackd-student-work/angular-whos-who-sprint-09-2023-assessment-2-team-1-1](https://github.com/fasttrackd-student-work/angular-whos-who-sprint-09-2023-assessment-2-team-1-1)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Node.js]: https://img.shields.io/badge/node.js-233056?style=for-the-badge&logo=nodedotjs&logoColor=5aaa46
[Node.js-url]: https://nodejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Spotify API]: https://img.shields.io/badge/spotify-212121?style=for-the-badge&logo=spotify&logoColor=1ed760
[Spotify-url]: https://developer.spotify.com/
[title]: src/assets/game.PNG
