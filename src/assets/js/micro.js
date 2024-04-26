"use strict";

const archiveSwiper = new Swiper(".archive__swiper", {
	autoplay: {
		delay: 0,
		disableOnInteraction: false,
		pauseOnMouseEnter: true
	},
	speed: 6000,
	loop: true,
	slidesPerView: "auto",
	spaceBetween: 20,
	allowTouchMove: false

	// breakpoints: {
	// 	1280: {
	//
	// 	}
	// }
});

//아카이브 슬라이드
const archiveArea = document.querySelector(".archive_box");

// archiveArea.addEventListener("mouseenter", () => {
// 	//let activeSlide = document.querySelector(".swiper-slide-active").dataset.swiperSlideIndex;
// 	//archiveSwiper.slideTo(activeSlide);
// 	archiveSwiper.autoplay.stop();
// });

// archiveArea.addEventListener("mouseleave", () => {
// 	archiveSwiper.autoplay.start();
// });

//lottie
let animation1 = bodymovin.loadAnimation({
	container: document.getElementById("lottie_1"), // Required
	path: "https://assets5.lottiefiles.com/packages/lf20_ngcpf3x7.json", //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
	renderer: "svg", // Required
	loop: true, // Optional
	autoplay: true // Optional
});

let animation2 = bodymovin.loadAnimation({
	container: document.getElementById("lottie_2"), // Required
	path: "https://assets1.lottiefiles.com/packages/lf20_yoltywwd.json", //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
	renderer: "svg", // Required
	loop: true, // Optional
	autoplay: true // Optional
});
