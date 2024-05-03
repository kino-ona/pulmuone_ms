"use strict";

$("#fullpage").fullpage({
	scrollingSpeed: 600,
	controlArrows: false,
	easingcss3: "linear",
	loopHorizontal: false,
	touchSensitivity: 1,
	lockAnchors: true,
	normalScrollElements: ".scroll-element",
	scrollOverflow: true,
	onLeave: function (index, nextIndex, direction) {
		if (nextIndex === 2 && direction === "up") {
			$.fn.fullpage.setAllowScrolling(false, "up");
		}

		if (nextIndex === 4 && direction === "down") {
			historySwiper.mousewheel.disable();

			if ($(window).width() <= 1280) {
				historySwiper.allowTouchMove = false;
			}
		}
	},
	afterLoad: function (anchorLink, index) {
		if (index === 1) {
			$.fn.fullpage.setAllowScrolling(true, "down");
		}

		if (index === 2) {
			$(".history .fp-slidesContainer").css({
				transition: "none",
				transform: "translate3d(0px, 0px, 0px)"
			});

			$(".history .slide:nth-child(1)").addClass("active").siblings(".slide").removeClass("active");
			historySwiper.slideTo(0, false);

			if ($(window).width() <= 1280) {
				historySwiper.allowTouchMove = true;
			}

			$.fn.fullpage.setAllowScrolling(false, "down");

			// desktop intro wheel sequence
			let wheelLock = false;

			$(".intro").on("wheel", function (event) {
				if (event.originalEvent.deltaY > 0 && !wheelLock) {
					if (!$(".intro").hasClass("intro--start")) {
						$.fn.fullpage.setAllowScrolling(false, "up");
						$(".intro").addClass("intro--start");
						wheelLock = true;

						setTimeout(function () {
							$.fn.fullpage.setAllowScrolling(true, "down");
							wheelLock = false;
						}, 800);
					}
				} else if (event.originalEvent.deltaY < 0 && !wheelLock) {
					if ($(".intro").hasClass("intro--start")) {
						$.fn.fullpage.setAllowScrolling(false, "down");
						$(".intro").removeClass("intro--start");
						wheelLock = true;

						setTimeout(function () {
							$.fn.fullpage.setAllowScrolling(true, "up");
							wheelLock = false;
						}, 800);
					}
				}
			});

			// mobile intro touch sequence
			$(".intro").on("touchstart", function (event) {
				let swipe = event.originalEvent.touches,
					start = swipe[0].pageY;
				$(this)
					.on("touchmove", function (event) {
						let contact = event.originalEvent.touches,
							end = contact[0].pageY,
							distance = end - start;

						if (distance < -30) {
							// down
							if (!$(".intro").hasClass("intro--start")) {
								$(".intro").addClass("intro--start");
							}
						}

						if (distance > 30) {
							// up
							if ($(".intro").hasClass("intro--start")) {
								$(".intro").removeClass("intro--start");
							}
						}
					})
					.one("touchend", function () {
						$(this).off("touchmove touchend");
						if ($(".intro").hasClass("intro--start")) {
							$.fn.fullpage.setAllowScrolling(true, "down");
							$.fn.fullpage.setAllowScrolling(false, "up");
						} else {
							$.fn.fullpage.setAllowScrolling(true, "up");
							$.fn.fullpage.setAllowScrolling(false, "down");
						}
					});
			});
		}

		if (index === 3) {
			$.fn.fullpage.setAllowScrolling(true, "up");
			if (!historySwiper.isEnd) {
				$.fn.fullpage.setAllowScrolling(false, "down");
			}

			// history section slide
			$(".history").on("wheel", function (event) {
				if ($(window).width() > 1280) {
					if (event.originalEvent.deltaY > 0) {
						$.fn.fullpage.moveSlideRight();
					} else if (event.originalEvent.deltaY < 0) {
						if (historySwiper.isBeginning) {
							$.fn.fullpage.moveSlideLeft();
						}
					}
				}
			});
		}

		if (index === 4) {
			$.fn.fullpage.setAllowScrolling(true, "up");

			initArchiveSwiper();

			let growthState = false;

			$(".main").on("wheel touchmove", function (event) {
				if ($(".growth").position().top <= 0 && !growthState) {
					//실행내용 추가 예정
					growthState = true;
				} else if ($(".growth").position().top > 0 && growthState) {
					//실행내용 추가 예정
					growthState = false;
				}
			});
		}
	},
	onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {
		if (slideIndex === 1) {
			historySwiper.mousewheel.disable();

			if ($(window).width() <= 1280) {
				historySwiper.allowTouchMove = false;
			}
		}
	},
	afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
		if (slideIndex === 1) {
			$.fn.fullpage.setAllowScrolling(false, "up");
			historySwiper.mousewheel.enable();
			if ($(window).width() <= 1280) {
				historySwiper.allowTouchMove = true;
			}
		} else {
			$.fn.fullpage.setAllowScrolling(true, "up");
		}
	}
});

const historySwiper = new Swiper(".history .slide .swiper", {
	slidesPerView: "auto",
	spaceBetween: 20,
	resistance: true,
	resistanceRatio: 0,
	touchRatio: 4,
	freeMode: {
		enabled: true,
		momentum: false,
		momentumBounce: false
	},
	mousewheel: {
		enabled: false,
		sensitivity: 4
	},
	breakpoints: {
		1280: {
			allowTouchMove: false
		}
	},
	on: {
		progress: function (swiper, progress) {},
		breakpoint: function (swiper, breakpointParams) {
			swiper.on("touchMove", function () {
				$.fn.fullpage.setAllowScrolling(false, "left");
			});
			swiper.on("touchEnd", function () {
				if (swiper.isBeginning) {
					$.fn.fullpage.setAllowScrolling(true, "left");
				} else {
					$.fn.fullpage.setAllowScrolling(false, "left");
				}
			});
		},
		reachEnd: function (swiper) {
			$.fn.fullpage.setAllowScrolling(true, "down");
		}
	}
});

//archive pc swiper
let archiveSwiper = undefined;
let windowWidth = window.innerWidth;

const initArchiveSwiper = () => {
	if (windowWidth > 1280 && archiveSwiper == undefined) {
		archiveSwiper = new Swiper(".archive__swiper", {
			autoplay: {
				delay: 1,
				desableOnInteraction: false
			},
			speed: 8000,
			loop: true,
			loopedSlides: 1,
			slidesPerView: "auto",
			freemode: true
		});
	} else if (windowWidth <= 1280 && archiveSwiper !== undefined) {
		archiveSwiper.destroy();
		archiveSwiper = undefined;
	}
};

//archive mo more btn
const archiveBtn = document.querySelector(".archive__mobileBox .archive__btnBox");
const archiveList = document.querySelectorAll(".archive__mobileBox .archive__list");

archiveBtn.addEventListener("click", function () {
	archiveList.forEach(function (list) {
		list.style.display = "block";
	});
	this.style.display = "none";
	$.fn.fullpage.reBuild();
});
