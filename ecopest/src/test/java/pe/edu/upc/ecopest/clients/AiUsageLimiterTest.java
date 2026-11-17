package pe.edu.upc.ecopest.clients;

import org.junit.jupiter.api.Test;
import pe.edu.upc.ecopest.exceptions.RateLimitExceededException;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AiUsageLimiterTest {

    private final LocalDate today = LocalDate.of(2026, 11, 17);

    @Test
    void blocksWhenTheMinuteLimitIsReachedAndAllowsAgainAfterAMinute() {
        AiUsageLimiter limiter = new AiUsageLimiter(2, 100);
        limiter.acquire(0, today);
        limiter.acquire(1_000, today);
        assertThrows(RateLimitExceededException.class, () -> limiter.acquire(2_000, today));
        assertDoesNotThrow(() -> limiter.acquire(61_000, today));
    }

    @Test
    void blocksWhenTheDailyLimitIsReachedAndResetsTheNextDay() {
        AiUsageLimiter limiter = new AiUsageLimiter(100, 2);
        limiter.acquire(0, today);
        limiter.acquire(120_000, today);
        assertThrows(RateLimitExceededException.class, () -> limiter.acquire(240_000, today));
        assertDoesNotThrow(() -> limiter.acquire(360_000, today.plusDays(1)));
    }
}
