import { useState, useEffect } from 'react';

export const useCartTimer = (cartItemsLength, onExpire) => {
    const [reservationExpiry, setReservationExpiry] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);

    useEffect(() => {
        if (!reservationExpiry || cartItemsLength === 0) {
            setTimeRemaining(null);
            return;
        }

        const timer = setInterval(() => {
            const now = new Date();
            const diff = reservationExpiry - now;

            if (diff <= 0) {
                clearInterval(timer);
                setTimeRemaining("00:00");
                
                if (onExpire) onExpire();
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [reservationExpiry, cartItemsLength, onExpire]);

    return {
        timeRemaining,
        setReservationExpiry,
        isExpired: timeRemaining === "00:00",
        isRunningOut: timeRemaining && timeRemaining.startsWith("00:")
    };
};