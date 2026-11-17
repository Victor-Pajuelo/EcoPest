package pe.edu.upc.ecopest.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pe.edu.upc.ecopest.exceptions.RateLimitExceededException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayDeque;
import java.util.Deque;

// Limita cuantas veces se llama a la IA (Gemini) para no pasar la cuota gratuita ni generar costos.
// Cuenta las llamadas del ultimo minuto y las del dia (hora de Lima). Si se pasa, responde 429.
@Component
public class AiUsageLimiter {

    private static final ZoneId LIMA = ZoneId.of("America/Lima");

    private final int maxPerMinute;
    private final int maxPerDay;
    private final Deque<Long> lastMinute = new ArrayDeque<>();
    private LocalDate day = LocalDate.now(LIMA);
    private int countToday = 0;

    public AiUsageLimiter(@Value("${gemini.max-requests-per-minute:5}") int maxPerMinute,
                          @Value("${gemini.max-requests-per-day:60}") int maxPerDay) {
        this.maxPerMinute = maxPerMinute;
        this.maxPerDay = maxPerDay;
    }

    public synchronized void acquire() {
        acquire(System.currentTimeMillis(), LocalDate.now(LIMA));
    }

    synchronized void acquire(long nowMillis, LocalDate today) {
        if (!today.equals(day)) {
            day = today;
            countToday = 0;
        }
        while (!lastMinute.isEmpty() && nowMillis - lastMinute.peekFirst() >= 60_000) {
            lastMinute.pollFirst();
        }
        if (countToday >= maxPerDay) {
            throw new RateLimitExceededException("The daily limit of AI requests was reached, try again tomorrow");
        }
        if (lastMinute.size() >= maxPerMinute) {
            throw new RateLimitExceededException("Too many AI requests, wait a minute and try again");
        }
        lastMinute.addLast(nowMillis);
        countToday++;
    }
}
