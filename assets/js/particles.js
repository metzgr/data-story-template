var config = {
  "particles": {
    "number": {
      "value": 30,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": ["#2EB4E7","#2EB4E7","#2EB4E7","#fff"]
    },
    "shape": {
      "type": "edge",
      "stroke": {
        "width": 0,
        "color": "#212121"
      }
    },
    "opacity": {
      "value": .75,
      "random": false,
      "anim": {
        "enable": false,
        "speed": .1,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 5,
      "random": true
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "enable": true,
      "speed": .5,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "in",
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "push": {
        "particles_nb": 3
      }
    }
  },
  "retina_detect": true
};


particlesJS('site__bg', config);
