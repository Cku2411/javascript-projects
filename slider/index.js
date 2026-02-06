const testimonials = [
  {
    testimonial:
      "This web app completely transformed the way I manage my projects. The interface is intuitive, and I can track progress in real-time without any hassle. It has saved me countless hours!",
    author: "Sarah L., Project Manager",
  },
  {
    testimonial:
      "I was skeptical at first, but after using this app for a few weeks, I can’t imagine working without it. The automation features are a game-changer, and customer support is outstanding.",
    author: "James T., Entrepreneur",
  },
  {
    testimonial:
      "What I love most is the simplicity. Everything just works seamlessly—from collaboration tools to analytics. My team adopted it instantly, and productivity has skyrocketed.",
    author: "Emily R., Team Lead",
  },
  {
    testimonial:
      "The app is fast, reliable, and beautifully designed. It feels modern yet easy to use. I especially appreciate how secure it is, giving me peace of mind when handling sensitive data.",
    author: "Michael K., IT Specialist",
  },
  {
    testimonial:
      "I’ve tried several similar tools, but this one stands out. It’s affordable, powerful, and keeps improving with regular updates. Highly recommended for anyone looking to streamline their workflow.",
    author: "Sophia M., Freelancer",
  },
];

const testimonialElm = document.querySelector(".testimonial");

const authorElm = document.querySelector(".author");

let index = 0;

function updateTestimonial(i) {
  const { testimonial, author } = testimonials[i];
  testimonialElm.textContent = testimonial;
  authorElm.textContent = author;
}

updateTestimonial(index);

const body = document.querySelector("body");
body.addEventListener("click", () => {
  if (index == testimonials.length - 1) {
    index = 0;
  } else {
    index++;
  }
  updateTestimonial(index);
});
