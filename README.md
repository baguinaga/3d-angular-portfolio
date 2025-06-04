# Angular 3D Portfolio

**Deployed at: [aguinaga.io](https://aguinaga.io)**

This repository showcases my personal portfolio website, a project initially conceived to leverage my experience with Angular while exploring the integration of dynamic 3D graphics using [three.js](https://threejs.org/). The ambition was to create not just a static display, but an engaging, interactive background that would bring the portfolio to life.

## Architectural Evolution & Key Achievements

What began as a portfolio with a novel visual element evolved into a deeper exploration of robust 3D scene management within the Angular framework. This evolution led to several key achievements:

- **Successfully Implemented Service-Oriented Scene Management:** To accommodate the initial vision of distinct 3D scenes tied to different application routes, I designed and implemented a modular system of Angular services. This architecture thoughtfully decouples critical concerns:

  - **Rendering Logic:** Centralized control over the three.js rendering loop, ensuring consistent updates and performance.
  - **Scene Management:** Dedicated services manage the lifecycle of individual scenes—loading, unloading, and state preservation. This allows each scene to be a self-contained module with its own assets and logic.
  - **Interaction Handling:** A flexible and extensible system for defining and binding scene-specific user interactions. Interaction callbacks are defined per scene and dynamically attached to DOM events using a factory pattern. Crucially, a higher-order function manages the registration and, importantly, the deregistration of these interactions when scenes are switched, preventing common issues like memory leaks and lingering event listeners.

- **Interactive 3D Experience:** The current live version features an interactive particle system. While this demonstrates a subset of the interactions originally envisioned, the underlying architectural system is robust and intentionally designed to support a broader range of complex interactive features in the future

- **Mobile-Responsive Design:** The portfolio, including its 3D elements, was developed to ensure a consistent and functional experience across various screen sizes, including mobile web browsers. Personaly tested on Chrome and Firefox mobile web browsers.

- **Inspired By:** The particle animation drew inspiration from the `webgl_buffergeometry_drawrange` example provided by three.js ([view source](https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawrange.html)).

## Key Technologies

- **Frontend Framework:** Angular
- **3D Graphics Library:** three.js
- **Languages:** TypeScript, JavaScript, HTML, CSS
- **Styling:** Tailwind CSS
- **Future/Planned:** React, Next.js, React-Three-Fiber - (Redesign)

## Learning, Reflection & Future Direction

This project served as an invaluable learning experience, particularly in the nuances of integrating complex, real-time 3D graphics within a component-based framework like Angular. It highlighted the critical roles of modular design and performance optimization. Perhaps the most significant takeaway was a deeper understanding of **right-sizing project scope**. As development progressed, my ambition for a highly reusable, multi-scene system grew, which, in turn, added layers of complexity to what is currently a _single-scene application_ on the live site. This was a practical lesson in balancing aspirational design with iterative, deliverable milestones.

Looking ahead, and having since transitioned to working extensively with React and Next.js, the next evolution of this portfolio will focus on:

1. **Enhancing Current Interactions:** Implementing a few more polished and engaging interactions within the existing Angular application.
2. **Leveraging Multi-Scene Capability:** Introducing distinct scenes accessible via routing, thereby fully utilizing the scene management architecture already in place.
3. **Developing a Modern, Shareable Template:** Re-imagining and rebuilding the portfolio using **React and React-Three-Fiber**. The R3F ecosystem offers a rich suite of tools and community for three.js development, which I intend to leverage to create a high-quality, open-source portfolio template for the broader developer community.

This repository, therefore, stands as a testament to my journey in front-end development—not only showcasing my ability to architect and implement complex interactive features but also reflecting my commitment to continuous learning and adaptation in an ever-evolving technological landscape.
