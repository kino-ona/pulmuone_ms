"use strict";

const archiveSwiper = new Swiper(".archive__swiper", {
	autoplay: {
		delay: 0,
		disableOnInteraction: false
	},
	speed: 6000,
	loop: true,
	slidesPerView: "auto",
	spaceBetween: 20,
	freeMode: true,
	allowTouchMove: false

	// breakpoints: {
	// 	1280: {
	//
	// 	}
	// }
});

//아카이브 슬라이드
const archiveArea = document.querySelector(".archive_box");

archiveArea.addEventListener("mouseenter", () => {
	archiveSwiper.stop();
});

archiveArea.addEventListener("mouseleave", () => {
	archiveSwiper.start();
});
