import React, { useState, useEffect, useCallback, useMemo } from "react";

function Header() {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	const targetDate = useMemo(() => new Date("2025-09-01T00:00:00"), []);

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date().getTime();
			const distance = targetDate.getTime() - now;

			if (distance > 0) {
				setTimeLeft({
					days: Math.floor(distance / (1000 * 60 * 60 * 24)),
					hours: Math.floor(
						(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
					),
					minutes: Math.floor(
						(distance % (1000 * 60 * 60)) / (1000 * 60)
					),
					seconds: Math.floor((distance % (1000 * 60)) / 1000),
				});
			} else {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		};

		
		calculateTimeLeft();

		
		const timer = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(timer);
	}, [targetDate]);

	
	const handleOrderClick = useCallback((e) => {
		e.preventDefault();
		const formUrl =
			"https://docs.google.com/forms/d/12JbaP2QkU8BPL4tP-SCD8yn1Za_0s6bnSkwOQD5mhUU/edit";
		window.open(formUrl, "_blank");
	}, []);

	const handleDownloadClick = useCallback((e) => {
		e.preventDefault();
		window.open("http://localhost:5000/download", "_blank");
	}, []);

	
	const formattedTime = useMemo(
		() => ({
			hours: timeLeft.hours.toString().padStart(2, "0"),
			minutes: timeLeft.minutes.toString().padStart(2, "0"),
			seconds: timeLeft.seconds.toString().padStart(2, "0"),
		}),
		[timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
	);

	return (
		<header className="header">
			<div className="container">
				<div className="header-content">
					<a
						href="#"
						className="order-btn"
						onClick={handleOrderClick}
					>
						Order Now
					</a>
					<div className="header-center">
						<a href="#" className="logo">
							Black
						</a>
						<div className="countdown-timer">
							<span className="countdown-label">Next Drop:</span>
							<div className="countdown-display">
								<span className="time-unit">
									<span className="time-number">
										{timeLeft.days}
									</span>
									<span className="time-label">D</span>
								</span>
								<span className="time-separator">:</span>
								<span className="time-unit">
									<span className="time-number">
										{formattedTime.hours}
									</span>
									<span className="time-label">H</span>
								</span>
								<span className="time-separator">:</span>
								<span className="time-unit">
									<span className="time-number">
										{formattedTime.minutes}
									</span>
									<span className="time-label">M</span>
								</span>
								<span className="time-separator">:</span>
								<span className="time-unit">
									<span className="time-number">
										{formattedTime.seconds}
									</span>
									<span className="time-label">S</span>
								</span>
							</div>
						</div>
					</div>
					<a
						href="#"
						className="download-btn"
						onClick={handleDownloadClick}
					>
						Download Look Book
					</a>
				</div>
			</div>
		</header>
	);
}

export default React.memo(Header);
