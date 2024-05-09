"use strict";

let introWheelLock = false,
	historyWheelLock = false;

$("#fullpage").fullpage({
	scrollingSpeed: 600,
	controlArrows: false,
	easingcss3: "linear",
	loopHorizontal: false,
	touchSensitivity: 1,
	normalScrollElements: ".scroll-element",
	keyboardScrolling: false,
	scrollOverflow: true,
	scrollOverflowOptions: {
		probeType: 3
		// useTransition: false,
		// useTransform: false
		// HWCompositing: false
		// disablePointer: true,
		// disableTouch: false,
		// disableMouse: true
	},
	afterRender: function () {
		initArchiveSwiper();

		//mobile tab button center
		if (windowWidth <= 1280) {
			var $tabhmenu = $(".award .tab__list");
			var tabMenuClick = function () {
				$(".award .tab__list .tab__button").on("click", function (e) {
					e.preventDefault();
					var padding = 20;
					var $element = $(this);
					var tabOffset = $element.offset().left;
					var tabWidth = $element.width();
					var menuScrollLeft = $tabhmenu.scrollLeft() - padding;
					var menuWidth = $tabhmenu.width();
					var myScrollPos = tabOffset + tabWidth / 2 + menuScrollLeft - menuWidth / 4;

					$tabhmenu.stop().animate(
						{
							scrollLeft: myScrollPos - menuWidth / 4
						},
						300
					);
				});
			};
			tabMenuClick();
		}

		const iscroll = $.fn.fp_scrolloverflow.iscrollHandler.iScrollInstances[0];

		const growthCountObj = {
			duration: 1,
			startVal: 0,
			useEasing: false
		};
		const countNum = [38000, 3500, 181, 7000];

		let targetTops = [];
		let targetHeight = [];
		let target = $(".growth__item");
		target.each(function (index, item) {
			let targetTop = $(item).position().top;
			targetTops.push(targetTop);
			targetHeight.push(targetTop + $(item).innerHeight());
		});

		let elementTop, elementBottom, viewportTop, viewportBottom;
		function isScrolledIntoView(index) {
			elementTop = targetTops[index];
			elementBottom = targetHeight[index];
			viewportTop = Math.abs(iscroll.y);
			viewportBottom = viewportTop + $(".main").innerHeight();
			return elementBottom > viewportTop && elementTop < viewportBottom;
		}

		iscroll.on("scroll", function () {
			target.each(function (index, item) {
				let countEl = $(item).find(".growth__emphasis > strong");
				let countElId = countEl.attr("id");

				if (isScrolledIntoView(index) == true && !countEl.hasClass("active")) {
					let count = new countUp.CountUp(countElId, countNum[index], growthCountObj);
					count.start();
					countEl.addClass("active");
				}
			});
		});

		// $(".main .scroll-element--vertical").on("mouseenter", function (event) {
		// 	iscroll.wheelOff();
		// });

		// $(".main .scroll-element--vertical").on("mouseleave", function (event) {
		// 	iscroll.wheelOn();
		// });

		$(".main .scroll-element--vertical").on("touchstart", function (event) {
			iscroll.disable();
		});

		$(".main .scroll-element--vertical").on("touchend", function (event) {
			iscroll.enable();
		});

		$(".award .tab__button").on("click", function () {
			iscroll.scrollTo(0, iscroll.y);
		});

		$(window).on("resize", function () {
			$.fn.fullpage.reBuild();
		});
	},
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

			if ($(".intro").hasClass("intro--start")) {
				$.fn.fullpage.setAllowScrolling(false, "up");
				$.fn.fullpage.setAllowScrolling(true, "down");
			} else {
				$.fn.fullpage.setAllowScrolling(false, "down");
				$.fn.fullpage.setAllowScrolling(true, "up");
			}

			// desktop intro wheel sequence

			$(".intro").on("wheel", function (event) {
				if (event.originalEvent.deltaY > 0 && !introWheelLock) {
					if (!$(".intro").hasClass("intro--start")) {
						$.fn.fullpage.setAllowScrolling(false, "up");
						$(".intro").addClass("intro--start");
						introWheelLock = true;

						setTimeout(function () {
							$.fn.fullpage.setAllowScrolling(true, "down");
							introWheelLock = false;
						}, 800);
					}
				} else if (event.originalEvent.deltaY < 0 && !introWheelLock) {
					if ($(".intro").hasClass("intro--start")) {
						$.fn.fullpage.setAllowScrolling(false, "down");
						$(".intro").removeClass("intro--start");
						introWheelLock = true;

						setTimeout(function () {
							$.fn.fullpage.setAllowScrolling(true, "up");
							introWheelLock = false;
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
					if (event.originalEvent.deltaY > 0 && !historyWheelLock) {
						$.fn.fullpage.moveSlideRight();
					} else if (event.originalEvent.deltaY < 0 && historyWheelLock) {
						$.fn.fullpage.moveSlideLeft();
					}
				}
			});
		}

		if (index === 4) {
			$.fn.fullpage.setAllowScrolling(true, "up");
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
		if (slideIndex === 0) {
			$.fn.fullpage.setAllowScrolling(true, "up");

			setTimeout(function () {
				historyWheelLock = false;
			}, 800);
		}

		if (slideIndex === 1) {
			$.fn.fullpage.setAllowScrolling(false, "up");

			historySwiper.mousewheel.enable();

			setTimeout(function () {
				historyWheelLock = true;
			}, 800);

			if ($(window).width() <= 1280) {
				historySwiper.allowTouchMove = true;
			}
		}
	}
});

const historySwiper = new Swiper(".history .slide .swiper", {
	// speed: 700,
	slidesPerView: "auto",
	spaceBetween: 20,
	resistance: true,
	resistanceRatio: 0,
	// touchRatio: 4,
	freeMode: {
		// enabled: false,
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
			// freeMode: {
			// 	enabled: true
			// }
		}
	},
	on: {
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
				if (swiper.isEnd) {
					setTimeout(function () {
						$.fn.fullpage.setAllowScrolling(true, "down");
					}, 250);
				} else {
					$.fn.fullpage.setAllowScrolling(false, "down");
				}
			});
		},
		// touchMove: function (swiper, event) {
		// 	$.fn.fullpage.setAllowScrolling(false, "left");
		// },
		// touchEnd: function (swiper, event) {
		// 	if (swiper.isBeginning) {
		// 		$.fn.fullpage.setAllowScrolling(true, "left");
		// 	}

		// 	if (swiper.isEnd) {
		// 		setTimeout(function () {
		// 			$.fn.fullpage.setAllowScrolling(true, "down");
		// 		}, 250);
		// 	} else {
		// 		$.fn.fullpage.setAllowScrolling(false, "down");
		// 	}
		// },
		// slideChangeTransitionEnd: function (swiper) {
		// 	if (swiper.isBeginning) {
		// 		$.fn.fullpage.setAllowScrolling(true, "left");
		// 	}
		// },
		scroll: function (swiper, event) {
			if (swiper.isBeginning) {
				setTimeout(function () {
					historyWheelLock = true;
				}, 800);
			} else {
				historyWheelLock = false;
			}

			if (swiper.isEnd) {
				setTimeout(function () {
					$.fn.fullpage.setAllowScrolling(true, "down");
				}, 800);
			} else {
				$.fn.fullpage.setAllowScrolling(false, "down");
			}
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
